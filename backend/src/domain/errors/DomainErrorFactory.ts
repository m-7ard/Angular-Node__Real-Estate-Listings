class DomainErrorFactory {
    public static createSingleListError(props: { message: string; path: string[], code: string }): [IDomainError] {
        return [{
            code: props.code,
            message: props.message,
            path: props.path
        }]
    }
}

export default DomainErrorFactory;