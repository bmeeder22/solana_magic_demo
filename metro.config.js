// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

module.exports = {
    ...getDefaultConfig(__dirname),
    resolver: {
        sourceExts: ["jsx", "js", "ts", "tsx", "cjs"],
        extraNodeModules: require('node-libs-browser'),
    },
};
