module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@assets': './assets',
            '@app': './src/app',
            '@features': './src/features',
            '@layouts': './src/shared/layouts',
            '@components': './src/shared/components',
            '@navigation': './src/shared/navigation',
            '@hooks': './src/shared/hooks',
            '@utils': './src/shared/utils',
            '@styles': './styles',
            '@types': './src/types',
          },
        },
      ],
    ],

  };
};
