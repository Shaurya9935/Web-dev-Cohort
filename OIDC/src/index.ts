import express from 'express';
import path from 'node:path'; 

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