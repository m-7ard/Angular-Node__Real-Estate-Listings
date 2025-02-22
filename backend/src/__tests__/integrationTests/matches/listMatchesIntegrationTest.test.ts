import supertest from "supertest";
import {
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import Mixins from "../../../__utils__/integrationTests/Mixins";
import Team from "domain/entities/Team";
import Match from "domain/entities/Match";
import IListMatchesRequestDTO from "api/DTOs/matches/list/IListMatchesRequestDTO";
import urlWithQuery from "__utils__/integrationTests/urlWithQuery";
import IListMatchesResponseDTO from "api/DTOs/matches/list/IListMatchesResponseDTO";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import MatchDates from "domain/valueObjects/Match/MatchDates";
import { DateTime } from "luxon";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";

const BASE_URL = "/api/matches/";

let team_001: Team;
let team_002: Team;
let team_003: Team;

let match_001: Match;
let match_002: Match;
let match_003: Match;

let default_request: IListMatchesRequestDTO = {
    limitBy: null,
    scheduledDate: null,
    status: null,
    teamId: null,
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
    team_001 = await mixins.createTeam(1);
    team_002 = await mixins.createTeam(2);
    team_003 = await mixins.createTeam(3);

    match_001 = await mixins.createScheduledMatch({
        seed: 1,
        awayTeam: team_001,
        homeTeam: team_002,
    });

    match_002 = await mixins.createCompletedMatch({
        seed: 2,
        awayTeam: team_001,
        homeTeam: team_002,
        goals: [],
    });

    match_003 = await mixins.createCompletedMatch({
        seed: 3,
        awayTeam: team_002,
        homeTeam: team_003,
        goals: [],
    });
});

describe("List Matches Integration Test;", () => {
    it("List Matches; No Params; Success;", async () => {
        const request = { ...default_request };
        const url = urlWithQuery(BASE_URL, request);

        const response = await supertest(server).get(`${url}`).set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IListMatchesResponseDTO = response.body;
        expect(body.matches.length).toBe(3);
    });

    it("List Matches; scheduledDate; Success;", async () => {
        const request = { ...default_request };
        request.scheduledDate = match_001.matchDates.scheduledDate;

        const response = await supertest(server).get(BASE_URL).query(request).set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IListMatchesResponseDTO = response.body;
        expect(body.matches.length).toBe(3);
    });

    test.each([
        [MatchStatus.COMPLETED, 2],
        [MatchStatus.SCHEDULED, 1],
        [MatchStatus.CANCELLED, 0],
        [MatchStatus.IN_PROGRESS, 0],
    ])("List Matches; status; Success;", async (status, expectAmount) => {
        const request = { ...default_request };
        request.status = status.value;

        const url = urlWithQuery(BASE_URL, request);

        const response = await supertest(server).get(`${url}`).set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IListMatchesResponseDTO = response.body;
        expect(body.matches.length).toBe(expectAmount);
    });

    it("List Matches; By Team Id; Success;", async () => {
        const request = { ...default_request };
        request.teamId = team_003.id.value;
        const url = urlWithQuery(BASE_URL, request);

        const response = await supertest(server).get(`${url}`).set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IListMatchesResponseDTO = response.body;
        expect(body.matches.length).toBe(1);
    });

    it("List Matches; By Scheduled Date; Success;", async () => {
        const request = { ...default_request };

        match_001.matchDates = MatchDates.executeCreate({ scheduledDate: DateTime.fromJSDate(new Date()).plus({ days: 1 }).toJSDate(), startDate: null, endDate: null });
        const repo = diContainer.resolve(DI_TOKENS.MATCH_REPOSITORY);
        await repo.updateAsync(match_001);

        request.scheduledDate = match_001.matchDates.scheduledDate;

        const url = urlWithQuery(BASE_URL, request);

        const response = await supertest(server).get(`${url}`).set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IListMatchesResponseDTO = response.body;
        expect(body.matches.length).toBe(1);
    });
});
