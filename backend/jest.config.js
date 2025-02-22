module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "js"],
    moduleDirectories: ["node_modules", "src"],
    transformIgnorePatterns: ["/node_modules/(?!sql-template-tag|other-esm-modules-to-include)"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
        "^.+\\.(js|mjs)$": "babel-jest",
    },
};
