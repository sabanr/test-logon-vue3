import { createApp } from "vue";
import App from "./App.vue";

import adalConfig from "./config/adalConfig";
import { AdalImplementation } from "./services/adal";

import axios from "axios";
import AuthenticationContext from "adal-angular";

const authorizationContext = new AuthenticationContext(adalConfig);
const adalImplementation = new AdalImplementation(authorizationContext);

axios.interceptors.request.use(
  (config) => {
    const token = adalImplementation.acquireToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

const app = createApp(App);
app.provide("$authlib", adalImplementation);
app.provide("$http", axios);
app.mount("#app");
