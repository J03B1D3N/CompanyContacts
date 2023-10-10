<template>
  <div class="structure flex-1 w-full p-5 px-20 flex flex-col justify-start">
    <StructureComponentVue />
    <StructureDiplayVue />
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import StructureComponentVue from "../components/components/StructureComponent.vue";
import StructureDiplayVue from "../components/displays/StructureDisplay.vue";

export default {
  created() {},
  beforeRouteLeave(to, from, next) {
    this.refreshFilters();
    this.SET_CHOSEN_STRUCTURE_DISPLAY("Ofisai");
    this.SET_OFFICES_PAGE(1);
    next();
  },
  components: {
    StructureComponentVue,
    StructureDiplayVue,
  },

  async created() {
    await this.getStructure();
    await this.getNameCheck();
  },

  methods: {
    ...mapActions(["getStructure", "refreshFilters", "getNameCheck"]),
    ...mapMutations([
      "SET_NAME_CHECK",
      "SET_CHOSEN_STRUCTURE_DISPLAY",
      "SET_OFFICES_PAGE",
    ]),
  },
  beforeDestroy() {
    this.SET_NAME_CHECK([]);
  },
};
</script>

<style></style>
