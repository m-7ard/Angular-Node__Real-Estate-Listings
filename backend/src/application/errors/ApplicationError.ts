export default class ApplicationError {
    constructor(public message: string, public path: string[], public code: string) {}
}