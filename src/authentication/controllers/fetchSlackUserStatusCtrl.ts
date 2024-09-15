import { Request, Response, NextFunction } from "express";
import { fetchSlackUser } from "../models/fetchSlackUser";
import { CustomError } from "../../errors/CustomError";


export const checkSlackUserStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const email = req.query.userEmail as string | undefined;

    if (!email) {
        
        return next(new CustomError('User email must be provided', 400))
    }

    try {
        const user = await fetchSlackUser({ email });

        if (!user) {
            return res.json({ isActive: false });
        }
        console.log(`User: ${user.first_name} exists in slack`);
        res.json({ isActive: true });
    } catch (error: any) {
        return next(new CustomError(`Something went wrong: ${error.message || error}`, 400))
       
    }
};
