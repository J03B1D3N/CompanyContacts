<template>
  <div class="areYouSure flex-1" @click="handleClick">
    <div :is="popUpComponent.component" ref="excludeDiv"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import companyDeleteVue from "./delete/companyDelete.vue";
import employeeDeleteVue from "./delete/employeeDelete.vue";
import structureDeleteVue from "./delete/structureDelete.vue";
import userDeleteVue from "./delete/userDelete.vue";
import { pb } from "../../lib/pocketbase";
export default {
  created() {
    pb.autoCancellation(false);
  },
  methods: {
    ...mapActions(["setPopUpComponent"]),

    handleClick(event) {
      if (!this.$refs.excludeDiv.$el.contains(event.target)) {
        this.setPopUpComponent({});
      }
    },
  },

  computed: {
    ...mapGetters(["popUpComponent"]),
  },
  components: {
    companyDeleteVue,
    employeeDeleteVue,
    structureDeleteVue,
    userDeleteVue,
  },
  beforeDestroy() {
    pb.autoCancellation(true);
  },
};
</script>

<style scoped>
.areYouSure {
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
.popUp {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  background-color: #ffffff !important;
  cursor: default;
}
</style>
