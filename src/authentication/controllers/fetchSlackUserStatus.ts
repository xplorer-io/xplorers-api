import { Request, Response, NextFunction } from "express";
import { fetchSlackUser } from "../services/fetchSlackUser";
import { CustomError } from "../../errors/customErrorType";
import { SlackUserStatusResponse } from "../models/slackUserInterface";


export const checkSlackUserStatus = async (
    req: Request,
    res: Response<SlackUserStatusResponse>,
    next: NextFunction
) => {
    const email = req.query.userEmail as string;

    if (!email) {
        
        return next(new CustomError('User email must be provided', 400))
    }
    try {
        const user = await fetchSlackUser({ email });
        res.json({ isActive:  !!user });
    } catch (error: any) {
        return next(new CustomError(`Something went wrong: ${error.message || error}`, 400))
       
    }
};
