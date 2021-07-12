import * as msal from "@azure/msal-browser";

export default {
  auth: {
    clientId: "9fd0dafb-3646-47cc-b6a8-05ca78e5fff8",
    authority:
      "https://login.microsoftonline.com/06671189-dfc0-40b6-a063-435ac5cc7b24",
  },
  cache: {
    cacheLocation: "localStorage",
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(`${loglevel} - ${message}`);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Info,
    },
  },
};
