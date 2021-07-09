<template>
  <div>
    <h1>Logon testing</h1>
    <div v-if="isLoggedOn">
      <h1>User data: {{ userData }}</h1>
      <button @click="LogOff">Log Off</button>
    </div>
    <div v-else>
      <button @click="LogOn">Log On</button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import * as msal from "@azure/msal-browser";

export default {
  async setup() {
    const isLoggedOn = ref(false);
    const userData = ref("");
    const t = ref("");

    const msconfig = {
      auth: {
        clientId: "9fd0dafb-3646-47cc-b6a8-05ca78e5fff8",
        authority:
          "https://login.microsoftonline.com/06671189-dfc0-40b6-a063-435ac5cc7b24",
      },
      system: {
        loggerOptions: {
          loggerCallback(loglevel, message, containsPii) {
            console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: msal.LogLevel.Verbose,
        },
      },
    };
    const auth = new msal.PublicClientApplication(msconfig);
    const authResponse = await auth.acquireTokenSilent({});

    isLoggedOn.value = authResponse.account.isLoggedOn;

    const LogOn = async () => {
      const authResponse = await auth.loginRedirect({});
      isLoggedOn.value = !isLoggedOn.value;
    };

    const LogOff = () => {
      isLoggedOn.value = false;
    };

    return {
      isLoggedOn,
      userData,
      LogOn,
      LogOff,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
