<template>
  <div class="display flex flex-col justify-start gap-5">
    <div class="total">
      iš viso rasta:
      {{ users.totalItems === 0 ? users.totalItems : users.totalItems - 1 }}
    </div>

    <md-table>
      <md-table-row>
        <md-table-head>Vardas</md-table-head>

        <md-table-head>El. Paštas</md-table-head>
        <md-table-head>Veiksmai</md-table-head>
      </md-table-row>

      <md-table-row
        v-for="user in users.items"
        :key="user.id"
        v-if="user.username !== 'admin'"
      >
        <md-table-cell class="row">{{
          user.username ? user.username : "Vardo nėra"
        }}</md-table-cell>
        <md-table-cell class="row">{{
          user.email
            ? user.email
            : "El. Pašto matomumas šiai paskyrai yra išjungtas"
        }}</md-table-cell>

        <md-table-cell>
          <div class="flex">
            <md-button
              v-if="checkPermissions('edit_permissions')"
              class="md-raised main-btn btn"
              @click="handleEdit(user)"
            >
              Redaguoti
            </md-button>

            <md-button
              v-if="checkPermissions('delete_permissions')"
              class="md-raised secondary-btn btn"
              @click="handleDelete(user)"
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
    ...mapGetters(["permissions", "users"]),
  },

  methods: {
    ...mapActions(["setModal", "setPopUpComponent"]),

    handleDelete(user) {
      this.setPopUpComponent({
        component: "userDeleteVue",
        data: user,
      });
    },

    handleEdit(user) {
      this.setModal({
        component: "editAccountFormVue",
        data: user,
      });
    },
  },
};
</script>

<style scoped>
button:disabled {
  background-color: grey !important;
}
th:nth-child(2) {
  text-align: center;
  width: 100% !important;
}
th:nth-child(3) {
  text-align: center;
  width: 100% !important;
}
td:nth-child(2) {
  text-align: center;
}
</style>
