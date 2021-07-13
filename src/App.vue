<template>
  <div class="container">
    <h1>AZURE SIGN-IN TESTING</h1>
    <div v-if="isAuthenticated">
      <h2>Hello {{ account.profile.name }}</h2>
      <h5>{{ account.profile.roles }}</h5>
      <button @click="executeQuery">QUERY!</button>
      <button @click="logOff">Log Off</button>
      <p v-if="isQuerying">Executing query ...</p>
      <p v-else>Product Data: {{ productData }}</p>
    </div>
    <div v-else>
      <button @click="logOn">Log On</button>
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";

export default {
  setup() {
    const authlib = inject("$authlib");
    const http = inject("$http");

    const isQuerying = ref(false);
    const productData = ref("");

    if (authlib.account.value) {
      console.log(authlib.account.value.profile);
    }
    const logOn = () => {
      authlib.signIn();
    };

    const logOff = () => {
      authlib.signOut();
    };

    const executeQuery = async () => {
      isQuerying.value = true;

      try {
        const busqueda =
          "https://puntodegestion-api.azurewebsites.net/api/producto/porcodigo?codigo=121076";
        const resp = await http.get(busqueda);

        console.log(`${resp.data}`);
        productData.value = JSON.stringify(resp.data);
      } catch (error) {
        console.error(error.errorMessage);
      } finally {
        isQuerying.value = false;
      }
    };

    return {
      isQuerying,
      isAuthenticated: authlib.isAuthenticated,
      account: authlib.account,
      productData,
      logOn,
      logOff,
      executeQuery,
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
