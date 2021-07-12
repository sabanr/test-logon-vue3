<template>
  <div>
    <h1>AZURE SIGN-IN TESTING</h1>
    <div v-if="isAuthenticated">
      <h2>{{ account.name }}</h2>
      <h3>Roles:</h3>
      <ul v-for="(r, index) in account.idTokenClaims.roles" :key="index">
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
import { inject } from "vue";

export default {
  setup() {
    const authlib = inject("$authlib");

    const LogOn = async () => {
      await authlib.signIn();
    };

    const LogOff = async () => {
      await authlib.signOut();
    };

    return {
      isAuthenticated: authlib.isAuthenticated,
      account: authlib.account,
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
