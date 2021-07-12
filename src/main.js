import { createApp } from "vue";
import App from "./App.vue";

import * as Msal from "@azure/msal-browser";

import msconfig from "./config/msconfig";
import { MsalImplementation } from "./services/msal";

const publicClientApp = new Msal.PublicClientApplication(msconfig);
const msalImplementation = new MsalImplementation(publicClientApp);

const app = createApp(App);
app.provide("$authlib", msalImplementation);
app.mount("#app");
