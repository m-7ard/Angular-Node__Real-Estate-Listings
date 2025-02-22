import { NextFunction, Request, Response } from "express";

function errorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
    const divider = `\x1b[34m${"=".repeat(process.stdout.columns)}\x1b[0m`;
    console.log(divider);
    console.log("The following error was caught by the error handling middleware in createApplication.ts: ");
    console.error(err);
    console.log(divider);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).send();
}

export default errorLogger;
