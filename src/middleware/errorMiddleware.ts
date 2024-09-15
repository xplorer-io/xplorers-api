import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError';

export const errorHandler = (
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent){
        return next(err)
    }
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }

    return res.status(500).json({
        message: 'Something went wrong. Please try again later.'
    });
};
export default errorHandler