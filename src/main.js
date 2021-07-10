import { createApp, provide } from "vue";
import App from "./App.vue";

import * as msal from "@azure/msal-browser";

const msconfig = {
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
      logLevel: msal.LogLevel.Trace,
    },
  },
};

const msalClientApp = new msal.PublicClientApplication(msconfig);

const app = createApp(App);
app.provide("msalClientApp", msalClientApp);
app.provide("genius", "Roberto");
app.mount("#app");
