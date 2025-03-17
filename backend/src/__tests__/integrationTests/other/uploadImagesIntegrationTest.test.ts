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
import { readFileSync } from "fs";
import { TEST_MEDIA_ROOT } from "config";
import path from "path";

let ADMIN: User;
let ADMIN_PASSWORD: string;
let VALID_FILE: string;
let TEXT_FILE: string;
let TOO_LARGE_IMAGE: string;

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();

    const mixins = new Mixins();

    const admin =  await mixins.createAdminUser(1);
    ADMIN = admin.user;
    ADMIN_PASSWORD = admin.password;
    VALID_FILE = path.join(TEST_MEDIA_ROOT, "valid_image.png");
    TEXT_FILE = path.join(TEST_MEDIA_ROOT, "text-file.txt");
    TOO_LARGE_IMAGE = path.join(TEST_MEDIA_ROOT, "too-large-image.png");
});

describe("uploadImagesIntegrationTest;", () => {
    it("Upload Images; Valid Images; Success;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .post(`/api/upload`)
                .attach("file", VALID_FILE),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);
    });

    it("Upload Images; Too Many Images; Failure;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .post(`/api/upload`)
                .attach("file", VALID_FILE)
                .attach("file", VALID_FILE)
                .attach("file", VALID_FILE)
                .attach("file", VALID_FILE)
                .attach("file", VALID_FILE)
                .attach("file", VALID_FILE)
                .attach("file", VALID_FILE)
                .attach("file", VALID_FILE)
                .attach("file", VALID_FILE)
                .attach("file", VALID_FILE)
                .attach("file", VALID_FILE),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(400);
    });

    it("Upload Images; Invalid Format; Failure;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .post(`/api/upload`)
                .attach("file", TEXT_FILE),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(415);
    });


    it("Upload Images; Too Large Image; Failure;", async () => {
        /**
        * @NOTE
        * For this to pass, you need to place a 8MB+ file in media/tests
        */
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .post(`/api/upload`)
                .attach("file", TOO_LARGE_IMAGE),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(413);
    });
});
