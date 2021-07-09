<template>
  <div v-if="isLoggedOn">
    <h1>User data: {{ userData }}</h1>
    <button @click="LogOff">Log Off</button>
  </div>
  <div v-else>
    <button @click="LogOn">Log On</button>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const isLoggedOn = ref(null);
    const userData = ref("");

    const LogOn = () => {
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

<style scoped>
a {
  color: #42b983;
}
</style>
