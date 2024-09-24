import { Request, Response, NextFunction } from "express";
import { fetchSlackUser } from "../services/fetchSlackUser";
import { CustomError } from "../../errors/customErrorType";
import { slackUserQuerySchema } from "../models/slackUserSchema";

export const getSlackUserDetail = async (req: Request, res: Response, next: NextFunction) => {
        const parsedQuery = slackUserQuerySchema.parse(req.query);
        if (Object.keys(parsedQuery).length === 0){
            return next(new CustomError("Bad Request: Missing query parameters", 400))
        }
        const { userId, email, userName } = parsedQuery;
        try{
            const user = await fetchSlackUser({ userId, email, userName });

        if (!user) {
            return next(new CustomError("User not found", 404));
        }
        res.json(user);
    }catch(error: unknown){
        const message = error instanceof Error? error.message: "An unexpected error occured";
        return next(new CustomError(`Something went wrong: ${message}`, 500))
    };
    
};
