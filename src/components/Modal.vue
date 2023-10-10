<template>
  <div class="modal flex items-center justify-center" @click="handleClick">
    <div ref="excludeDiv" :is="modal.component"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import createCompanyFormVue from "./forms/create/createCompanyForm.vue";
import editCompanyFormVue from "./forms/edit/editCompanyForm.vue";

import createEmployeeFormVue from "./forms/create/createEmployeeForm.vue";
import editEmployeeFormVue from "./forms/edit/editEmployeeForm.vue";

import createStructureFormVue from "./forms/create/createStructureForm.vue";
import editStructureFormVue from "./forms/edit/editStructureForm.vue";

import createAccountFormVue from "./forms/create/createAccountFrom.vue";
import editAccountFormVue from "./forms/edit/editAccountForm.vue";

export default {
  computed: {
    ...mapGetters(["modal"]),
  },
  components: {
    editCompanyFormVue,
    createCompanyFormVue,

    createEmployeeFormVue,
    editEmployeeFormVue,

    createStructureFormVue,
    editStructureFormVue,

    createAccountFormVue,
    editAccountFormVue,
  },
  methods: {
    ...mapActions(["setModal"]),
  },
  methods: {
    ...mapActions(["setModal"]),

    handleClick(event) {
      if (!this.$refs.excludeDiv.$el.contains(event.target)) {
        this.setModal({});
      }
    },
  },
};
</script>

<style scoped>
.modal {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 25;
  width: 100%;
  height: 100%;
  background-color: rgb(82, 72, 72, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
