import ITeamValidator from "application/interfaces/ITeamValidator";
import Team from "domain/entities/Team";
import IValueObject from "domain/valueObjects/IValueObject";
import { err, ok } from "neverthrow";
import { EMPTY_APPLICATION_ERROR } from "./values";

export default class SetupMockServices {
    public static setupTeamExistsValidatorSuccess<T extends IValueObject>({ mockValidator, input, output }: { mockValidator: jest.Mocked<ITeamValidator<T>>; input: T; output: Team }) {
        mockValidator.validate.mockImplementationOnce(async (id) => (id.equals(input) ? ok(output) : err({} as never)));
    }

    public static setupTeamExistsValidatorFailure<T extends IValueObject>({ mockValidator }: { mockValidator: jest.Mocked<ITeamValidator<T>> }) {
        mockValidator.validate.mockImplementationOnce(async (id) => err([EMPTY_APPLICATION_ERROR]));
    }
}
