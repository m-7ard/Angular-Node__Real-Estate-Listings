import { NextFunction, Request, Response } from "express";

function responseLogger(req: Request, res: Response, next: NextFunction) {
    res.on("finish", function () {
        const timeStamp = `\x1b[33m${new Date().toLocaleTimeString()}\x1b[0m`;
        const statusCode = `\x1b[34m${res.statusCode}\x1b[0m`;
        const method = req.method;
        const url = req.originalUrl;
        const logMessage = `[${timeStamp}] ${method} ${url} ${statusCode}`;

        console.log(logMessage);
    });

    next();
}

export default responseLogger;
