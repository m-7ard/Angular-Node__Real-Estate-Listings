function convertToTitleCase(input: string) {
    return input
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '); 
}

export default convertToTitleCase;