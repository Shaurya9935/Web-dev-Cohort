import crypto from "node:crypto";
import express from "express";
import path from "node:path";
import { eq } from "drizzle-orm";
import JWT from "jsonwebtoken";
import jose from "node-jose";
import { db } from "./db";
import { usersTable } from "./db/schema";
import { PRIVATE_KEY, PUBLIC_KEY } from "./utils/cert";
import type { JWTClaims } from "./utils/user-token";


const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(express.static(path.resolve("public")));

app.get("/", (req, res) => {
    res.json({
        message: "Hello from auth server"
    });
});

app.get("/health", (req, res) => {
    res.json({
        message: `Server is healthy and running on port: ${PORT}`,
        healthy: true
    });
});

app.listen(PORT, () => {
  console.log(`AuthServer is running on PORT ${PORT}`);
});

//OIDC Endpoints
app.get("/.well-known/openid-configuration", (req, res) => {
    const ISSUER = `http://localhost:${PORT}`
    return res.json({
        issuer: ISSUER,
        authorization_endpoints: `${ISSUER}/o/authenticate`,
        user_info: `${ISSUER}/o/userinfo`,
        jwks_uri: `${ISSUER}/.well-known/jwks.json`,
    })
});

app.get("/.well-known/jwks.json", async(_, res) => {
    const key = await jose.JWK.asKey(PUBLIC_KEY, "pem");
    return res.json({
        keys: [key.toJSON()]
    });
});

app.get("/o/authenticate", (req, res) => {
    return res.sendFile(path.resolve("public", "autheticate.html"));
})

app.post("/o/userinfo", async (req, res)=> {
    const { email, password } = req.body;

    if(!email || !password){
        res.status(400).json({
            message: "Email and password are required."
        });
        return;
    };

    const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

    if(!user || !user.password || !user.salt) {
        res.status(401).json({
            message: "Invalid email and password."
        })
        return;
    }

    const hash = crypto
        .createHash("sha256")
        .update(password + user.salt)
        .digest("hex");

    if(hash !== user.password){
        res.status(401).json({
            message: "Invalid email or password"
        });
        return;
    }

    const ISSUER = `http://localhost:${PORT}`;
    const now  = Math.floor(Date.now() / 1000);

    const claims: JWTClaims = { 
        iss: ISSUER,
        sub: user.id,
        email: user.email,
        email_verified: String(user.emailVerified),
        exp: now + 3600,
        given_name: user.firstName ?? "",
        family_name: user.lastName ?? undefined,
        name: [user.firstName, user.lastName].filter(Boolean).join(" "),
        picture: user.profileImageURL ?? undefined
    };

    const token = JWT.sign(claims, PRIVATE_KEY, {algorithm: "RS256"});

    res.json({token});

    app.post("/o/authenticate/sign-up", async(req,res) => {
        const {firstName, lastName, email, password} = req.body;

        if(!email || !password || !firstName){
            return res.status(400).json({
                message: "First name, email, and password are required."
            });
        };

        const [existing] = await db
        .select({id: usersTable.id})
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

        if(existing){
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        };

        const salt = crypto.randomBytes(16).toString("hex");
        const hash = crypto
        .createHash("sha256")
        .update(password + user.salt)
        .digest("hex")

        await db.insert(usersTable).values({
            firstName,
            lastName: lastName ?? null,
            email,
            passowrd: hash,
            salt
        })
    })
});