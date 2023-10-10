<template>
  <div class="flex-1 flex flex-col justify-start">
    <md-table>
      <md-table-row>
        <md-table-head>Vardas ir Pavardė</md-table-head>
        <md-table-head>Pozicija</md-table-head>
        <md-table-head>Telefono numeris</md-table-head>
        <md-table-head>Elektroninis paštas</md-table-head>
        <md-table-head>Adresas</md-table-head>
        <md-table-head>Veiksmai</md-table-head>
      </md-table-row>

      <md-table-row
        class="cursor-pointer"
        v-for="employee in employees.items"
        :key="employee.id"
        @click="handleClick(employee.id)"
      >
        <md-table-cell>{{
          employee.name + " " + employee.surname
        }}</md-table-cell>
        <md-table-cell>{{ employee.position }}</md-table-cell>
        <md-table-cell>{{ employee.phone_number }}</md-table-cell>
        <md-table-cell>{{ employee.email }}</md-table-cell>
        <md-table-cell>{{ employee.expand.office_id.name }}</md-table-cell>
        <md-table-cell>
          <div class="flex justify-center">
            <md-button
              class="md-icon-button main-btn"
              ref="excludeDiv"
              v-if="checkPermissions('edit_employees')"
              @click.stop="handleEdit(employee)"
            >
              <img :src="pencil" alt="pencil" />
            </md-button>
            <md-button
              class="md-icon-button secondary-btn"
              ref="excludeDiv"
              v-if="checkPermissions('delete_employees')"
              @click.stop="handleDelete(employee)"
            >
              <img :src="bin" alt="garbage bin" />
            </md-button>
          </div>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import anonymous from "../../assets/avatar.png";
import pencil from "../../assets/pencil.svg";
import bin from "../../assets/bin.svg";
import { checkPermissions } from "../../lib/pocketbase.js";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters(["permissions", "employees"]),
  },
  methods: {
    ...mapActions(["setModal", "setPopUpComponent"]),
    ...mapMutations(["CREATE_TOGGLE"]),

    handleEdit(employee) {
      this.setModal({
        component: "editEmployeeFormVue",
        data: employee,
      });
      this.CREATE_TOGGLE();
    },

    handleDelete(employee) {
      this.setPopUpComponent({
        component: "employeeDeleteVue",
        data: employee,
      });
    },

    handleClick(id) {
      this.$router.push(`/employeeDetail/${id}`);
    },
  },
  data() {
    return {
      anonymous,
      pencil,
      bin,
      checkPermissions,
    };
  },
};
</script>

<style scoped>
th:nth-child(1) {
  text-align: start !important;
}
th {
  text-align: center !important;
}
td {
  text-align: center !important;
}
td:nth-child(1) {
  text-align: start !important;
}
</style>
