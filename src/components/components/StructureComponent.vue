<template>
  <div class="flex flex-col gap-5 mb-16 header">
    <h1 class="text-6xl font-thin">Struktūra</h1>
    <div
      class="createNew flex gap-5 items-center"
      v-if="
        checkPermissions('edit_structure') || checkPermissions('edit_offices')
      "
    >
      <md-button class="md-icon-button main-btn" @click="handleClick">
        <img :src="add" alt="plus sign" />
      </md-button>
      <div class="text-lg">Pridėti naują struktūrą</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import add from "../../assets/add.svg";
import { checkPermissions } from "../../lib/pocketbase.js";
export default {
  data() {
    return {
      add,
      checkPermissions,
    };
  },
  methods: {
    ...mapActions(["setModal"]),

    handleClick() {
      this.setModal({
        component: "createStructureFormVue",
        data: {},
      });
    },
  },
};
</script>

<style scoped>
.header {
  height: 120px !important;
}
</style>
