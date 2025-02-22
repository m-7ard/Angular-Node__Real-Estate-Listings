import { Result } from "neverthrow";
import IRequest from "./IRequest";

export type ICommandResult<Failure> = Result<void, Failure>;
type ICommand<Result extends ICommandResult<any>> = IRequest<Result>;

export default ICommand;
