import { DI_TOKENS, DIContainer } from "api/deps/diContainer";
import { NextFunction, Request, Response } from "express";

function connectionProviderMiddlewareFactory(diContainer: DIContainer) {
    const db = diContainer.resolve(DI_TOKENS.DATABASE);

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const connection = await db.getConnection();
        
            res.on("finish", () => {
                connection.disponse().catch(err => console.error('Error releasing DB connection:', err));
            });
    
            res.on("close", () => {
                connection.disponse().catch(err => console.error('Error releasing DB connection:', err));
            });
    
            diContainer.registerScoped(DI_TOKENS.DATABASE_CONNECTION, () => connection);
    
            next();
        } catch (err) {
            next(err);
        }
    }
}

export default connectionProviderMiddlewareFactory;
