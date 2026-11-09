const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

const config = withNativewind(getDefaultConfig(__dirname));
const nwResolve = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-native" && /node_modules[\\/](expo-asset|expo-font)[\\/]/.test(context.originModulePath)) {
    return context.resolveRequest(context, moduleName, platform);
  }
  return nwResolve
    ? nwResolve(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;