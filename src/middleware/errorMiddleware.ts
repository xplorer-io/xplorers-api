import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/customErrorType';

export const errorHandler = (
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }
    const message = err.message || "Something went wrong. Please try again later"

    return res.status(500).json({
        message: message
    });
};
export default errorHandler