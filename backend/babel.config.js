module.exports = {
    presets: [
      "@babel/preset-env",        // Transforms ES6+ to CommonJS
      "@babel/preset-typescript", // Handles TypeScript
    ],
    env: {
      test: {
        plugins: [
          "@babel/plugin-transform-modules-commonjs", // Transform modules to CommonJS for tests
        ],
      },
    },
  };