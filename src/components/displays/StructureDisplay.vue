<template>
  <div class="companies flex flex-col justify-between flex-1">
    <StructureTable />
    <PaginationVue
      :structure="computedStructure"
      @decrementPage="decrementPage"
      @incrementPage="incrementPage"
    />
  </div>
</template>

<script>
import PaginationVue from "../pagination/Pagination.vue";
import StructureTable from "../tables/structureTable.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters([
      "officesPage",
      "divisionsPage",
      "departmentsPage",
      "groupsPage",
      "offices",
      "divisions",
      "departments",
      "groups",
      "chosenStructureDisplay",
    ]),
    computedStructure() {
      if (this.chosenStructureDisplay === "Ofisai") {
        return this.offices;
      }
      if (this.chosenStructureDisplay === "Padaliniai") {
        return this.divisions;
      }
      if (this.chosenStructureDisplay === "Skyriai") {
        return this.departments;
      }
      if (this.chosenStructureDisplay === "Grupės") {
        return this.groups;
      }
    },
  },
  methods: {
    ...mapActions([
      "setOfficesPage",
      "setDivisionsPage",
      "setDepartmentsPage",
      "setGroupsPage",
    ]),
    incrementPage() {
      this.chosenStructureDisplay === "Ofisai"
        ? this.setOfficesPage(this.officesPage + 1)
        : null;
      this.chosenStructureDisplay === "Padaliniai"
        ? this.setDivisionsPage(this.divisionsPage + 1)
        : null;
      this.chosenStructureDisplay === "Skyriai"
        ? this.setDepartmentsPage(this.departmentsPage + 1)
        : null;
      this.chosenStructureDisplay === "Grupės"
        ? this.setGroupsPage(this.groupsPage + 1)
        : null;
    },
    decrementPage() {
      this.chosenStructureDisplay === "Ofisai"
        ? this.setOfficesPage(this.officesPage - 1)
        : null;
      this.chosenStructureDisplay === "Padaliniai"
        ? this.setDivisionsPage(this.divisionsPage - 1)
        : null;
      this.chosenStructureDisplay === "Skyriai"
        ? this.setDepartmentsPage(this.departmentsPage - 1)
        : null;
      this.chosenStructureDisplay === "Grupės"
        ? this.setGroupsPage(this.groupsPage - 1)
        : null;
    },
  },
  components: {
    PaginationVue,
    StructureTable,
  },
};
</script>

<style></style>
