<template>
  <div class="home flex flex-col flex-1">
    <main class="p-5 px-20 flex-1 flex flex-col justify-between">
      <div class="flex flex-col gap-1 flex-1 justify-start">
        <SearchVue />
        <EmployeesDisplayVue />
      </div>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SearchVue from "../components/components/Search.vue";
import EmployeesDisplayVue from "../components/displays/EmployeesDisplay.vue";

export default {
  beforeRouteLeave(to, from, next) {
    if (to.name !== "contactDetail") {
      this.refreshFilters();
      this.setEmployeesPage(1);
    }
    next();
  },

  computed: {
    ...mapGetters(["employees", "filter"]),
  },
  components: {
    SearchVue,
    EmployeesDisplayVue,
  },
  methods: {
    ...mapActions(["getEmployees", "refreshFilters", "setEmployeesPage"]),

    incrementPage() {
      this.setPage(this.page + 1);
    },
    decrementPage() {
      this.setPage(this.page - 1);
    },
  },
  async created() {
    this.getEmployees();
  },
};
</script>

<style scoped></style>
