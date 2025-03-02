import { DI_TOKENS, ProductionDIContainer, IDIContainer } from "api/services/DIContainer";
import { NextFunction, Request, Response } from "express";

export function createRequestScopeMiddleware(container: IDIContainer) {
    return (req: any, res: any, next: Function) => {
        container.runInScope(() => {
            // You can add the scopeId to the request for debugging
            req.scopeId = container.getCurrentScopeId();
            next();
        });
    };
}

function connectionProviderMiddlewareFactory(diContainer: IDIContainer) {
    const db = diContainer.resolve(DI_TOKENS.DATABASE);

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const connection = await db.getConnection();
        
            res.on("finish", () => {
                connection.dispose().then(_ => console.log("disposed")).catch(err => console.error('Error releasing DB connection:', err));
            });
    
            res.on("close", () => {
                connection.dispose().then(_ => console.log("disposed")).catch(err => console.error('Error releasing DB connection:', err));
            });
    
            diContainer.registerScoped(DI_TOKENS.DATABASE_CONNECTION, () => connection);
    
            next();
        } catch (err) {
            next(err);
        }
    }
}

export default connectionProviderMiddlewareFactory;
