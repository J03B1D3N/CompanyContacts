<template>
  <div class="companies flex flex-col justify-between flex-1">
    <CompaniesTableVue />
    <PaginationVue
      :structure="companies"
      @incrementPage="incrementPage"
      @decrementPage="decrementPage"
    />
  </div>
</template>

<script>
import CompaniesTableVue from "../tables/companiesTable.vue";
import PaginationVue from "../pagination/Pagination.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  methods: {
    ...mapActions(["setCompaniesPage", "getCompanies"]),
    incrementPage() {
      this.setCompaniesPage(this.companies.page + 1);
      this.getCompanies();
    },
    decrementPage() {
      this.setCompaniesPage(this.companies.page - 1);
      this.getCompanies();
    },
  },
  computed: {
    ...mapGetters(["companies"]),
  },
  components: {
    CompaniesTableVue,
    PaginationVue,
  },
};
</script>

<style></style>
