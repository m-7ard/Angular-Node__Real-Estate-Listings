import ITeamValidator from "application/interfaces/ITeamValidator";
import TeamId from "domain/valueObjects/Team/TeamId";

export function createMockTeamExistsValidator(): jest.Mocked<ITeamValidator<TeamId> > {
    return {
        validate: jest.fn(),
    }
}
