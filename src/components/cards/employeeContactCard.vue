<template>
  <router-link class="card" :to="`/employeeDetail/${employee.id}`">
    <md-card>
      <md-ripple class="p-4">
        <md-card-header class="flex items-center justify-start">
          <md-avatar class="avatar" v-if="employee.photo.length > 0">
            <img
              :src="`${$CURRENT_URL}/api/files/employees/${employee.id}/${employee.photo}`"
              alt="Avatar"
            />
          </md-avatar>
          <img v-else :src="avatar" alt="avatar" class="w-10" />
          <div class="titles w-full">
            <div class="md-title name">
              {{ employee.name + " " + employee.surname }}
            </div>
            <div class="md-subhead position">
              Pozicija: {{ employee.position }}
            </div>
          </div>
        </md-card-header>
        <md-card-content>
          <p>Telefono Nr: {{ employee.phone_number }}</p>
          <p>El. paštas: {{ employee.email }}</p>
          <p>Adresas: {{ employee.expand.office_id.name }}</p>
        </md-card-content>
        <div class="editDelete flex">
          <md-button
            class="md-icon-button main-btn"
            v-if="checkPermissions('edit_employees')"
            @click.prevent="handleEdit"
          >
            <img :src="pencil" alt="pencil" />
          </md-button>
          <md-button
            class="md-icon-button secondary-btn"
            v-if="checkPermissions('delete_employees')"
            @click.prevent="handleDelete"
          >
            <img :src="bin" alt="garbage bin" />
          </md-button>
        </div>
      </md-ripple>
    </md-card>
  </router-link>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import bin from "../../assets/bin.svg";
import pencil from "../../assets/pencil.svg";
import { checkPermissions } from "../../lib/pocketbase.js";
import avatar from "../../assets/avatar.png";
export default {
  methods: {
    ...mapMutations(["CREATE_TOGGLE"]),
    ...mapActions(["setModal", "setPopUpComponent"]),

    handleDelete() {
      this.setPopUpComponent({
        component: "employeeDeleteVue",
        data: this.employee,
      });
    },

    handleEdit() {
      this.setModal({
        component: "editEmployeeFormVue",
        data: this.employee,
      });
      this.CREATE_TOGGLE();
    },
  },

  props: ["employee"],

  computed: {
    ...mapGetters(["getOfficeById", "offices", "permissions"]),
  },

  data() {
    return {
      avatar,
      bin,
      pencil,
      checkPermissions,
    };
  },
};
</script>

<style scoped>
.card {
  width: 428px !important;
}
.avatar {
  margin: 0px !important;
  margin-right: 15px !important;
}
md-button {
  z-index: 25;
}
a {
  text-decoration: none !important;
}
.name,
.position,
p {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.name {
  height: 32px !important;
  width: 308px !important;
}
.position {
  height: 20px !important;
  width: 320px !important;
}
p {
  width: 364px !important;
  height: 22px !important;
}
</style>
