<template>
  <div class="display flex flex-col justify-start">
    <div class="total">iš viso rasta: {{ structureDisplay.totalItems }}</div>

    <div class="structureTabs">
      <p
        :class="{ active: chosenStructureDisplay === 'Ofisai' }"
        @click="handleTabChange"
      >
        Ofisai
      </p>

      <p
        :class="{ active: chosenStructureDisplay === 'Padaliniai' }"
        @click="handleTabChange"
      >
        Padaliniai
      </p>
      <p
        :class="{ active: chosenStructureDisplay === 'Skyriai' }"
        @click="handleTabChange"
      >
        Skyriai
      </p>
      <p
        :class="{ active: chosenStructureDisplay === 'Grupės' }"
        @click="handleTabChange"
      >
        Grupės
      </p>
    </div>
    <md-table>
      <md-table-row class="headers">
        <md-table-head>Pavadinimas</md-table-head>

        <md-table-head>Veiksmai</md-table-head>
      </md-table-row>

      <md-table-row v-for="item in structureDisplay.items" :key="item.id">
        <md-table-cell class="row">{{ item.name }}</md-table-cell>

        <md-table-cell>
          <div class="editDelete">
            <md-button
              v-if="handlePermissions(item.collectionName, 'edit_structure')"
              class="md-raised main-btn btn edit"
              @click="handleEdit(item)"
            >
              Redaguoti
            </md-button>

            <md-button
              v-if="handlePermissions(item.collectionName, 'delete_structure')"
              class="md-raised secondary-btn btn delete"
              @click="handleDelete(item)"
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
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      checkPermissions,
    };
  },

  computed: {
    ...mapGetters([
      "permissions",
      "structure",
      "offices",
      "divisions",
      "departments",
      "groups",
      "chosenStructureDisplay",
      "officesPage",
      "divisionsPage",
      "departmentsPage",
      "groupsPage",
    ]),

    structureDisplay() {
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
      "setModal",
      "setPopUpComponent",
      "setStructurePage",
      "setChosenStructureDisplay",
      "setOfficesPage",
      "setDivisionsPage",
      "setDepartmentsPage",
      "setGroupsPage",
    ]),
    ...mapMutations(["SET_CHOSEN_STRUCTURE_DISPLAY"]),
    handlePermissions(collectionName, permission) {
      if (collectionName === "offices" && permission === "edit_structure") {
        return this.checkPermissions("edit_offices");
      }
      if (collectionName === "offices" && permission === "delete_structure") {
        return this.checkPermissions("delete_offices");
      } else return this.checkPermissions(permission);
    },
    handleDelete(item) {
      this.setPopUpComponent({
        component: "structureDeleteVue",
        data: item,
      });
    },

    handleEdit(item) {
      this.setModal({
        component: "editStructureFormVue",
        data: item,
      });
    },
    handleTabChange(e) {
      this.chosenStructureDisplay !== e.target.textContent
        ? this.SET_CHOSEN_STRUCTURE_DISPLAY(e.target.textContent.trim())
        : null;
      this.groupsPage > 1 ? this.setGroupsPage(1) : null;
      this.departmentsPage > 1 ? this.setDepartmentsPage(1) : null;
      this.divisionsPage > 1 ? this.setDivisionsPage(1) : null;
      this.officesPage > 1 ? this.setOfficesPage(1) : null;
    },
  },
};
</script>

<style scoped>
th:nth-child(2) {
  text-align: center !important;
}

.structureTabs {
  display: grid;
  gap: 1px;
  grid-template-columns: repeat(4, 1fr);
  height: 2rem;
  margin-top: 0.5rem;
  color: white;
}
p {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  border-left: none;
  border-right: none;
  font-weight: 600;
  cursor: pointer;
  background-color: #1f3f77;
}
.active {
  background-color: #fff;
  color: black;
  border-bottom: none;
}
.editDelete {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
}
.delete {
  grid-column: 2/3;
}
.edit {
  grid-column: 1/2;
}
.row {
  width: 100% !important;
}
</style>
