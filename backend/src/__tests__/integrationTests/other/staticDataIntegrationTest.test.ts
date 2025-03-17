import supertest from "supertest";
import {
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import authSupertest from "__utils__/integrationTests/authSupertest";
import { StaticDataRequestDTO } from "../../../../types/api/contracts/other/static-data/StaticDataRequestDTO";
import User from "domain/entities/User";
import Mixins from "__utils__/integrationTests/Mixins";
import { StaticDataResponseDTO } from "../../../../types/api/contracts/other/static-data/StaticDataResponseDTO";
import ClientType from "domain/valueObjects/Client/ClientType";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";

let DEFAULT_REQUEST: StaticDataRequestDTO;
let ADMIN: User;
let ADMIN_PASSWORD: string;

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();

    DEFAULT_REQUEST = {};

    const mixins = new Mixins();

    const admin =  await mixins.createAdminUser(1);
    ADMIN = admin.user;
    ADMIN_PASSWORD = admin.password;
});

describe("staticDataIntegrationTest;", () => {
    it("Static Data; Up To Date Data; Success;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .get(`/api/static-data`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);

        const body: StaticDataResponseDTO = response.body;
        for (const key in body.clientTypes) {
            expect(ClientType.canCreate(key).isOk());
        }
        for (const key in body.realEstateListingTypes) {
            expect(RealEstateListingType.canCreate(key).isValid());
        }
    });
});
