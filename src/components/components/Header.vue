<template>
  <header class="p-2 pl-20 main-bg flex justify-between items-center">
    <img
      :src="logo"
      alt="teltonika logo"
      class="w-20 brightness-0 invert cursor-pointer logo"
      @click="handleClick"
    />
    <TabsVue />
    <LogInVue />
  </header>
</template>

<script>
import logo from "../../assets/logo.png";
import LogInVue from "./LogIn.vue";
import TabsVue from "../tabs/LinkTabs.vue";

export default {
  methods: {
    handleClick() {
      this.$router.push("/");
    },
  },

  components: {
    LogInVue,
    TabsVue,
  },

  data() {
    return {
      logo,
    };
  },
};
</script>

<style scoped></style>
