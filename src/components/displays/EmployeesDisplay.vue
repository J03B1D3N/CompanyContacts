<template>
  <div class="flex-1 employees flex flex-col justify-between">
    <h1 class="text-2xl" v-if="employees.items.length === 0">Kontaktų nėra</h1>

    <EmployeeContactTableVue v-if="table && employees.items.length > 0" />

    <div class="display flex-1" v-if="!table && employees.items.length > 0">
      <EmployeeContactCardVue
        v-for="employee in employees.items"
        :key="employee.id"
        :employee="employee"
      />
    </div>

    <Pagination
      :structure="employees"
      @incrementPage="incrementPage"
      @decrementPage="decrementPage"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import EmployeeContactCardVue from "../cards/employeeContactCard.vue";
import EmployeeContactTableVue from "../tables/employeeContactTable.vue";
import Pagination from "../pagination/Pagination.vue";

export default {
  methods: {
    ...mapActions(["setEmployeesPage", "getEmployees"]),
    incrementPage() {
      this.setEmployeesPage(this.employees.page + 1);
      this.getEmployees();
    },
    decrementPage() {
      this.setEmployeesPage(this.employees.page - 1);
      this.getEmployees();
    },
  },
  components: {
    EmployeeContactTableVue,
    EmployeeContactCardVue,
    Pagination,
  },

  computed: {
    ...mapGetters(["table", "employees"]),
  },
};
</script>

<style scoped>
.display {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
}
</style>
