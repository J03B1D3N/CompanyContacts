<template>
  <div class="login flex-1 main-bg flex items-center justify-center">
    <Login></Login>
    <md-button
      class="md-icon-button back-btn"
      style="background-color: white"
      @click="back"
    >
      <div class="svg">
        <img :src="returnSvg" alt="arrow pointing left" />
      </div>
    </md-button>
  </div>
</template>

<script>
import Login from "../components/forms/logInForm.vue";
import returnSvg from "../assets/return.svg";
import { pb } from "../lib/pocketbase.js";
export default {
  beforeRouteEnter(to, from, next) {
    if (pb.authStore.isValid) {
      next("/");
    } else next();
  },

  methods: {
    back() {
      this.$router.push("/");
    },
  },

  components: {
    Login,
  },

  data() {
    return {
      returnSvg,
    };
  },
};
</script>

<style scoped>
.login {
  position: relative;
}
.back-btn {
  position: absolute;
  left: 4rem;
  top: 4rem;
  z-index: 27;
}
</style>
