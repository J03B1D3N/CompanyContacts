<template>
  <div class="flex flex-col gap-5 mb-16">
    <h1 class="text-6xl font-thin">Sukurti admin paskyrą</h1>
    <div class="createNew flex gap-5 items-center">
      <md-button
        class="md-icon-button main-btn"
        v-if="checkPermissions('edit_permissions')"
        @click="handleClick"
      >
        <img :src="add" alt="plus sign" />
      </md-button>
      <div class="text-lg" v-if="checkPermissions('edit_permissions')">
        Sukurti naują admin paskyrą
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import add from "../../assets/add.svg";
import { checkPermissions } from "../../lib/pocketbase.js";
export default {
  data() {
    return {
      add,
      checkPermissions,
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    ...mapActions(["setModal"]),

    handleClick() {
      this.setModal({
        component: "createAccountFormVue",
        data: {},
      });
    },
  },
};
</script>

<style></style>
