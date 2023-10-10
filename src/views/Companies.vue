<template>
  <div class="companies flex-1 w-full p-5 px-20 flex flex-col justify-start">
    <CompaniesComponentVue />
    <CompanyDisplayVue />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { pb } from "../lib/pocketbase";
import CompaniesComponentVue from "../components/components/CompaniesComponent.vue";
import CompanyDisplayVue from "../components/displays/CompanyDisplay.vue";

export default {
  beforeRouteEnter(to, from, next) {
    pb.autoCancellation(false);
    next();
  },
  beforeRouteLeave(to, from, next) {
    pb.autoCancellation(true);
    this.setCompaniesPage(1);
    this.setCompaniesPerPage(200);
    next();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },

  components: {
    CompaniesComponentVue,
    CompanyDisplayVue,
  },

  async created() {
    this.setCompaniesPerPage(8);
    this.setCompaniesPage(1);
    this.getCompanies();
    this.getCompaniesNameCheck();
  },

  methods: {
    ...mapActions([
      "getCompanies",
      "setCompaniesPerPage",
      "setCompaniesPage",
      "getCompaniesNameCheck",
    ]),
  },
};
</script>

<style></style>
