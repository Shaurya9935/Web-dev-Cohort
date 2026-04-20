import type { Request, Response } from 'express'
import { signinPayloadModel, signupPayloadModel } from './models'
import { randomBytes, createHmac } from 'node:crypto'
import { db } from '../../db'
import { usersTable } from '../../db/schema'
import { eq } from 'drizzle-orm'

class AutheticationController {
    public async handleSignup(req: Request, res: Response){
        const validationResult = await signupPayloadModel.safeParseAsync(req.body)

        if(validationResult.error) return res.status(400).json({
            message: 'body validation falied', 
            error: validationResult.error.issues
        })

        const { firstName, lastName, email, password } = validationResult.data
        
        const userEmailResult = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if(userEmailResult.length > 0) return res.status(400).json({
            message: "User with email already exist",
            error : "Duplicate entry"
        })

        const salt = randomBytes(32).toString('hex')
        const hash = createHmac('sha256', salt).update(password).digest('hex')

        const [result] = await db.insert(usersTable).values({
            firstName,
            lastName,
            email,
            password: hash,
            salt
        }).returning( {id: usersTable.id })

        return res.status(201).json({
            message: "user has been created successfully",
            data: {id: result?.id}
        })
    }

    public async handleSignin(req: Request, res: Response){
       const validationResult = await signinPayloadModel.safeParseAsync(req.body)

       if(validationResult.error) return res.status(400).json({
            message: 'body validation falied', 
            error: validationResult.error.issues
        })
    }
}

export default AutheticationController