import { adminSuperTest } from "__utils__/integrationTests/authSupertest";
import { db, setUpIntegrationTest, disposeIntegrationTest, resetIntegrationTest, server } from "__utils__/integrationTests/integrationTest.setup";
import Mixins from "__utils__/integrationTests/Mixins";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import ICreateMatchRequestDTO from "api/DTOs/matches/create/ICreateMatchRequestDTO";
import ICreateMatchResponseDTO from "api/DTOs/matches/create/ICreateMatchResponseDTO";
import Team from "domain/entities/Team";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import IMatchSchema from "infrastructure/dbSchemas/IMatchSchema";
import MatchRepository from "infrastructure/repositories/MatchRepository";
import { DateTime } from "luxon";
import supertest from "supertest";

let away_team: Team;
let home_team: Team;
let default_request: ICreateMatchRequestDTO;

const wasCreated = async () => {
    const rows = await db.queryRows<IMatchSchema>({
        statement: "SELECT * FROM matches",
    });
    expect(rows.length).toBe(1);
};

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();
    const mixins = new Mixins();
    away_team = await mixins.createTeam(1);
    home_team = await mixins.createTeam(2);

    default_request = {
        awayTeamId: away_team.id.value,
        homeTeamId: home_team.id.value,
        scheduledDate: new Date(),
        startDate: null,
        endDate: null,
        venue: "venue place",
        status: MatchStatus.SCHEDULED.value,
        goals: null
    };
});

describe("Create Match Integration Test - Happy Paths", () => {
    it("Create Scheduled Match", async () => {
        const request = { ...default_request };

        const response = await adminSuperTest({
            agent: supertest(server).post(`/api/matches/create`).send(request).set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        await wasCreated();
    });

    it("Create In Progress Match", async () => {
        const request = { ...default_request };
        request.status = MatchStatus.IN_PROGRESS.value;
        request.startDate = new Date();
        request.goals = {};

        const response = await adminSuperTest({
            agent: supertest(server).post(`/api/matches/create`).send(request).set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        await wasCreated();
    });

    it("Create Completed Match", async () => {
        const request = { ...default_request };
        request.status = MatchStatus.COMPLETED.value;
        request.goals = {};

        const startDate = DateTime.fromJSDate(request.scheduledDate)
            .toJSDate();

        const endDate = DateTime.fromJSDate(request.scheduledDate)
            .plus({ minutes: 90 })
            .toJSDate();

        request.startDate = startDate;
        request.endDate = endDate;

        const response = await adminSuperTest({
            agent: supertest(server).post(`/api/matches/create`).send(request).set("Content-Type", "application/json"),
            seed: 1,
        });

        const errors = response.body;

        expect(response.status).toBe(201);
        await wasCreated();
    });

    it("Create Cancelled Match", async () => {
        const request = { ...default_request };
        request.status = MatchStatus.CANCELLED.value;
        request.goals = null;

        const response = await adminSuperTest({
            agent: supertest(server).post(`/api/matches/create`).send(request).set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        await wasCreated();
    });

    it("Create In Progress Match With Valid Score", async () => {
        const mixins = new Mixins();
        const player = await mixins.createPlayer(1);
        const teamMembership = await mixins.createTeamMembership(player, away_team, null);

        const request = { ...default_request };
        request.status = MatchStatus.IN_PROGRESS.value;
        request.startDate = DateTime.fromJSDate(request.scheduledDate).plus({ minutes: 1 }).toJSDate();
        request.goals = {
            "1": { dateOccured: DateTime.fromJSDate(request.startDate).plus({ minutes: 1 }).toJSDate(), teamId: away_team.id.value, playerId: player.id.value },
            "2": { dateOccured: DateTime.fromJSDate(request.startDate).plus({ minutes: 1 }).toJSDate(), teamId: away_team.id.value, playerId: player.id.value },
        }

        const response = await adminSuperTest({
            agent: supertest(server).post(`/api/matches/create`).send(request).set("Content-Type", "application/json"),
            seed: 1,
        });

        const errors = response.body;

        expect(response.status).toBe(201);
        await wasCreated();

        const body: ICreateMatchResponseDTO = response.body;

        const repo = diContainer.resolve(DI_TOKENS.MATCH_REPOSITORY);
        const match = await repo.getByIdAsync(body.id)!;
        expect(match?.score).not.toBeNull();
        expect(match?.score?.awayTeamScore).toBe(2);
        expect(match?.score?.homeTeamScore).toBe(0);
    });
});
