<template>
  <div>
    <div class="search flex flex-col items-start gap-14">
      <h1 class="text-6xl font-thin w-full">Kontaktų sistema</h1>

      <div class="flex">
        <button style="background-color: #f1f2f4" class="px-4 searchBtn h-9">
          <img :src="searchBtn" alt="search" />
        </button>
        <input
          type="text"
          id="search"
          class="h-9 w-96 outline-none mr-5"
          name="search"
          placeholder="Ieškoti kontakto..."
          style="background-color: #f1f2f4"
          v-model="search"
          v-debounce:400="handleSearchParameters"
        />
        <md-button
          class="md-icon-button main-btn"
          v-if="!table"
          @click="toggleTable"
        >
          <img :src="tables" alt="tables" />
        </md-button>
        <md-button
          class="md-icon-button main-btn"
          v-if="table"
          @click="toggleTable"
        >
          <img :src="card" alt="card" />
        </md-button>
        <md-button
          class="md-icon-button main-btn"
          v-if="checkPermissions('edit_employees')"
          @click="handleCreate"
        >
          <img :src="add" alt="plus sign" />
        </md-button>
      </div>
    </div>

    <div v-if="employees.totalItems > 0" class="totalFound">
      Iš viso rasta: <b>{{ employees.totalItems }} kontaktai</b>
    </div>
    <div v-else class="totalFound">Iš viso rasta: <b>0 kontaktų</b></div>
    <div class="flex">
      <div class="md-layout md-gutter">
        <FilterVue
          :items="companies.items"
          :filter_name="{
            placeholder: 'Pasirinkite kompaniją...',
            name: 'Kompanija',
          }"
          :val="selectedCompany"
          :edit="false"
          @structureChange="handleCompanyChange"
        />

        <FilterVue
          :items="offices.items"
          :filter_name="{
            placeholder: 'Pasirinkite ofisą...',
            name: 'Ofisas',
          }"
          :val="selectedOffice"
          :edit="false"
          @structureChange="handleOfficeChange"
        />

        <FilterVue
          :items="divisions.items"
          :filter_name="{
            placeholder: 'Pasirinkite padalinį...',
            name: 'Padalinys',
          }"
          :val="selectedDivision"
          :edit="false"
          @structureChange="handleDivisionChange"
        />

        <FilterVue
          :items="departments.items"
          :filter_name="{
            placeholder: 'Pasirinkite skyrių...',
            name: 'Skyrius',
          }"
          :val="selectedDepartment"
          :edit="false"
          @structureChange="handleDepartmentChange"
        />

        <FilterVue
          :items="groups.items"
          :filter_name="{
            placeholder: 'Pasirinkite grupę...',
            name: 'Grupė',
          }"
          :val="selectedGroup"
          :edit="false"
          @structureChange="handleGroupChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import searchBtn from "../../assets/search.svg";
import tables from "../../assets/table.svg";
import add from "../../assets/add.svg";
import card from "../../assets/card.svg";
import { checkPermissions } from "../../lib/pocketbase.js";

import FilterVue from "../components/filter.vue";

export default {
  components: {
    FilterVue,
  },

  computed: {
    ...mapGetters([
      "employees",
      "companies",
      "departments",
      "groups",
      "divisions",
      "offices",
      "permissions",
      "table",
      "modal",
      "filter",
      "filterCache",
      "selectedCompany",
      "selectedOffice",
      "selectedDivision",
      "selectedDepartment",
      "selectedGroup",
      "create",
      "employees",
    ]),
  },

  async created() {
    this.setCompaniesPage(1);
    this.setCompaniesPerPage(200);
    this.getCompanies();
    this.filter.search ? (this.search = this.filter.search) : null;
  },

  methods: {
    handleCompanyChange(value) {
      if (!this.create) {
        this.SET_OFFICES([]);
        this.SET_SELECTED_COMPANY(value);
        this.SET_SELECTED_OFFICE(null);

        if (value !== null) {
          this.setEmployeesPage(1);
          this.setFilter({
            ...this.filter,
            company: value,
            office: "",
            division: "",
            department: "",
            group: "",
          });
          this.getCompanies_officesById(value);
        }
      }
    },
    handleOfficeChange(value) {
      if (!this.create) {
        this.SET_DIVISIONS([]);
        this.SET_SELECTED_OFFICE(value);
        this.SET_SELECTED_DIVISION(null);

        if (value !== null) {
          this.setEmployeesPage(1);
          this.setFilter({
            ...this.filter,
            office: value,
            division: "",
            department: "",
            group: "",
          });
          this.getOffices_divisionsById(value);
        }
      }
    },
    handleDivisionChange(value) {
      if (!this.create) {
        this.SET_DEPARTMENTS([]);
        this.SET_SELECTED_DIVISION(value);
        this.SET_SELECTED_DEPARTMENT(null);

        if (value !== null) {
          this.setEmployeesPage(1);
          this.setFilter({
            ...this.filter,
            division: value,
            department: "",
            group: "",
          });
          this.getDivisions_departmentsById(value);
        }
      }
    },
    handleDepartmentChange(value) {
      if (!this.create) {
        this.SET_GROUPS([]);
        this.SET_SELECTED_DEPARTMENT(value);
        this.SET_SELECTED_GROUP(null);
        if (value !== null) {
          this.setEmployeesPage(1);

          this.setFilter({ ...this.filter, department: value, group: "" });
          this.getDepartments_groupsById(value);
        }
      }
    },
    handleGroupChange(value) {
      if (!this.create) {
        this.SET_SELECTED_GROUP(value);
        if (value !== null) {
          this.setEmployeesPage(1);
          this.setFilter({ ...this.filter, group: value });
        }
      }
    },

    ...mapMutations([
      "SET_SELECTED_COMPANY",
      "SET_SELECTED_OFFICE",
      "SET_SELECTED_DIVISION",
      "SET_SELECTED_DEPARTMENT",
      "SET_SELECTED_GROUP",
      "SET_OFFICES",
      "SET_DIVISIONS",
      "SET_DEPARTMENTS",
      "SET_GROUPS",
      "EDIT_TOGGLE",
      "CREATE_TOGGLE",
    ]),

    ...mapActions([
      "getCompanies",
      "setFilter",
      "toggleTable",
      "getCompanies_officesById",
      "getOffices_divisionsById",
      "getDivisions_departmentsById",
      "getDepartments_groupsById",
      "setCompaniesPerPage",
      "setCompaniesPage",
      "setModal",
      "setEmployeesPage",
      "refreshFilters",
      "setFilterCache",
      "getEmployees",
    ]),

    handleSearchParameters() {
      this.setEmployeesPage(1);
      this.setFilter({ ...this.filter, search: this.search });
    },

    handleCreate() {
      this.setModal({
        component: "createEmployeeFormVue",
        data: {},
      });
      this.CREATE_TOGGLE();
    },
  },

  data() {
    return {
      card: card,
      add: add,
      search: "",
      searchBtn: searchBtn,
      tables: tables,
      checkPermissions,
    };
  },
};
</script>

<style scoped>
.searchBtn {
  cursor: default;
}
</style>
