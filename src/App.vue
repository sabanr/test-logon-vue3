<template>
  <div>
    <h1>Logon testing. {{ genius }} is a genius</h1>
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
import { ref, inject } from "vue";

export default {
  setup() {
    const isLoggedOn = ref(false);
    const userData = ref("");
    const genius = ref("N/A");

    genius.value = inject("genius");

    const LogOn = async () => {
      isLoggedOn.value = !isLoggedOn.value;
    };

    const LogOff = () => {
      isLoggedOn.value = false;
    };

    return {
      genius,
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
