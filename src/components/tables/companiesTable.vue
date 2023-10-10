<template>
  <div class="display flex flex-col justify-start gap-5">
    <div class="total">iš viso rasta: {{ companies.totalItems }}</div>

    <md-table>
      <md-table-row>
        <md-table-head>Įmonės pavadinimas</md-table-head>

        <md-table-head>Veiksmai</md-table-head>
      </md-table-row>

      <md-table-row v-for="company in companies.items" :key="company.id">
        <md-table-cell class="row">{{ company.name }}</md-table-cell>

        <md-table-cell>
          <div class="flex">
            <md-button
              v-if="checkPermissions('edit_companies')"
              class="md-raised main-btn btn"
              @click="handleEdit(company)"
            >
              Redaguoti
            </md-button>

            <md-button
              v-if="checkPermissions('delete_companies')"
              class="md-raised secondary-btn btn"
              @click="handleDelete(company)"
            >
              Ištrinti
            </md-button>
          </div>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import { checkPermissions } from "../../lib/pocketbase.js";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      checkPermissions,
    };
  },

  computed: {
    ...mapGetters(["permissions", "companies"]),
  },

  methods: {
    ...mapActions(["setModal", "setPopUpComponent", "setCompaniesPage"]),

    handleDelete(company) {
      this.setPopUpComponent({
        component: "companyDeleteVue",
        data: company,
      });
    },

    handleEdit(company) {
      this.setModal({
        component: "editCompanyFormVue",
        data: company,
      });
    },
  },
};
</script>

<style scoped>
th:nth-child(2) {
  text-align: center !important;
}
.row {
  width: 100% !important;
}
</style>
