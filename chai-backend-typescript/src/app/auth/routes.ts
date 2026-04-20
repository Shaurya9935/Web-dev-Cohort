import express from "express";
import type {Router} from 'express'
import AutheticationController from "./controller";

const authenticationController = new AutheticationController()

export const authRouter: Router = express.Router()

authRouter.post('/signup', authenticationController.handleSignup.bind(authenticationController))
authRouter.post('/signin', authenticationController.handleSignin.bind(authenticationController))