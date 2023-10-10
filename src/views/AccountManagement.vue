<template>
  <div class="structure flex-1 w-full p-5 px-20 flex flex-col justify-start">
    <AccountsComponentVue />
    <AccountsDisplayVue />
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import AccountsComponentVue from "../components/components/AccountsComponent.vue";
import AccountsDisplayVue from "../components/displays/AccountsDisplay.vue";
export default {
  components: {
    AccountsComponentVue,
    AccountsDisplayVue,
  },

  async created() {
    this.getUsers();
  },

  methods: {
    ...mapActions(["getUsers"]),
  },
};
</script>

<style></style>
