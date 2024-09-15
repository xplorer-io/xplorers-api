import { Request, Response, NextFunction } from "express";
import { fetchSlackUser } from "../models/fetchSlackUser";
import { CustomError } from "../../errors/CustomError";

export const getSlackUserDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.query.userId as string | undefined;
        const email = req.query.userEmail as string | undefined;
        const userName = req.query.userName as string | undefined;

        if (!userId && !email && !userName) {
            return res.status(400).json({
                message: "At least one of userId, userEmail, or userName must be provided"
            });
        }

        const user = await fetchSlackUser({ userId, email, userName });

        if (!user) {
            return next(new CustomError("User not found", 404));
        }

        res.json(user);
    } catch (error: any) {
        return next(new CustomError(`Something went wrong: ${error.message || error}`, 500));
    }
};
