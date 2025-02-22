import { Result } from "neverthrow";
import IRequest from "./IRequest";

export type IQueryResult<Success, Failure> = Result<Success, Failure>;
type IQuery<Result extends IQueryResult<any, any>> = IRequest<Result>;

export default IQuery;
