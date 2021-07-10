<template>
  <div>
    <h1>AZURE SIGN-IN TESTING</h1>
    <div v-if="isLoggedOn">
      <h2>{{ userName }}</h2>
      <h3>Roles:</h3>
      <ul v-for="(r, index) in userRoles" :key="index">
        <li>{{ r }}</li>
      </ul>
      <button @click="LogOff">Log Off</button>
    </div>
    <div v-else>
      <button @click="LogOn">Log On</button>
    </div>
  </div>
</template>

<script>
import { ref, inject } from "vue";

export default {
  setup() {
    const isLoggedOn = ref(false);
    const userName = ref("");
    const userRoles = ref([]);

    const msalClientApp = inject("msalClientApp");

    msalClientApp
      .handleRedirectResponse()
      .then((resp) => {
        console.log("Handling redirect response!");
        if (resp !== null) {
          console.log("resp is not null");

          if (resp.accessToken) {
            console.log("got an access token!");
          }
          userName.value = resp.account.name;
          userRoles.value.push(...resp.account.idTokenClaims.roles);
          isLoggedOn.value = true;
        } else {
          console.log("getting all accounts!");
          const currentAccounts = msalClientApp.getAllAccounts();
          if (!currentAccounts || currentAccounts.length < 1) {
            console.log("no accounts found!");
            return;
          } else if (currentAccounts.length > 1) {
            console.log("mas de una cuenta!");
          } else if (currentAccounts.length === 1) {
            console.log("Una sola cuenta!");
            const account = currentAccounts[0];
            userName.value = account.name;
            userRoles.value.push(...account.idTokenClaims.roles);
            isLoggedOn.value = true;
          }
        }
      })
      .catch((error) => {
        console.log(`Error de autorización: ${error}`);
      });

    const LogOn = async () => {
      var loginRequest = {
        scopes: ["user.read"],
      };

      try {
        await msalClientApp.loginRedirect(loginRequest);
      } catch (error) {
        console.log(`Error de autorización: ${error}`);
      }
    };

    const LogOff = async () => {
      try {
        await msalClientApp.logoutRedirect();
      } catch (error) {
        console.log(`Error de logout: ${error}`);
      } finally {
        isLoggedOn.value = false;
      }
    };

    return {
      isLoggedOn,
      userName,
      userRoles,
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
