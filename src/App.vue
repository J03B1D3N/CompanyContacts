<template>
  <div class="app w-full min-h-screen flex flex-col justify-start relative">
    <HeaderVue v-if="this.$route.path !== '/login'" />
    <router-view />
    <ModalVue v-if="Object.keys(modal).length > 0" />
    <PopUpVue v-if="Object.keys(popUpComponent).length > 0" />
    <NotificationDisplayVue />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderVue from "./components/components/Header.vue";
import ModalVue from "./components/Modal.vue";
import PopUpVue from "./components/notifications/popUp.vue";
import "./index.css";
import NotificationDisplayVue from "./components/notifications/notificationDisplay.vue";

export default {
  components: {
    HeaderVue,
    ModalVue,
    PopUpVue,
    NotificationDisplayVue,
  },
  computed: {
    ...mapGetters(["modal", "popUpComponent", "notifications"]),
  },
};
</script>

<style scoped>
.app {
  display: relative;
}
body {
  height: 100vh;
  width: 100vw;
}
</style>
