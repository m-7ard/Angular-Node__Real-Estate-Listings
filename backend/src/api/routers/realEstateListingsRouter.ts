import { Router } from "express";
import registerAction from "../utils/registerAction";
import { DI_TOKENS, IDIContainer } from "api/services/DIContainer";
import CreateRealEstateListingAction from "api/actions/realEsateListings/CreateRealEstateListingAction";
import UpdateRealEstateListingAction from "api/actions/realEsateListings/UpdateRealEstateListingAction";
import DeleteRealEstateListingAction from "api/actions/realEsateListings/DeleteRealEstateListingAction";
import ReadRealEstateListingAction from "api/actions/realEsateListings/ReadRealEstateListingAction";
import ListRealEstateListingsAction from "api/actions/realEsateListings/ListRealEstateListingsAction";

export function createRealEstateListingsRouter(diContainer: IDIContainer) {
    const realEstateListingRouter = Router();

    registerAction({
        router: realEstateListingRouter,
        path: "/create",
        method: "POST",
        initialiseAction: () => {
            const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
            return new CreateRealEstateListingAction(requestDispatcher);
        },
    });

    registerAction({
        router: realEstateListingRouter,
        path: "/:id/update",
        method: "PUT",
        initialiseAction: () => {
            const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
            return new UpdateRealEstateListingAction(requestDispatcher);
        },
    });

    registerAction({
        router: realEstateListingRouter,
        path: "/:id/delete",
        method: "DELETE",
        initialiseAction: () => {
            const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
            return new DeleteRealEstateListingAction(requestDispatcher);
        },
    });

    registerAction({
        router: realEstateListingRouter,
        path: "/:id/",
        method: "GET",
        initialiseAction: () => {
            const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
            return new ReadRealEstateListingAction(requestDispatcher);
        },
    });

    registerAction({
        router: realEstateListingRouter,
        path: "/",
        method: "GET",
        initialiseAction: () => {
            const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
            return new ListRealEstateListingsAction(requestDispatcher);
        },
    });

    return realEstateListingRouter;
}
