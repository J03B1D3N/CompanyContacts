<template>
  <div
    class="popUp px-12 py-1 h-64 w-2/6 flex flex-col items-center justify-around"
  >
    <h1 class="text-2xl"><b>Ar tikrai norite ištrinti šią struktūrą?</b></h1>
    <h1 class="text-xl break-words w-full">
      {{ structureName(popUpComponent.data.collectionName) }}
      {{ popUpComponent.data.name }}
    </h1>
    <div class="btns flex w-full justify-end">
      <md-button class="md-raised main-btn btn taip" @click="handleTaip"
        >Taip</md-button
      >
      <md-button
        class="md-raised secondary-btn btn md-secondary"
        @click="handleNe"
        >Ne</md-button
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  methods: {
    ...mapActions([
      "deleteStructure",
      "setPopUpComponent",
      "deleteOffice",
      "deleteDivision",
      "deleteDepartment",
      "deleteGroup",
    ]),
    handleNe() {
      this.setPopUpComponent({});
    },
    handleTaip() {
      if (this.popUpComponent.data.collectionName === "offices") {
        this.deleteOffice(this.popUpComponent.data.id);
      }
      if (this.popUpComponent.data.collectionName === "divisions") {
        this.deleteDivision(this.popUpComponent.data.id);
      }
      if (this.popUpComponent.data.collectionName === "departments") {
        this.deleteDepartment(this.popUpComponent.data.id);
      }
      if (this.popUpComponent.data.collectionName === "groups") {
        this.deleteGroup(this.popUpComponent.data.id);
      }
    },
    structureName(collectionName) {
      if (collectionName === "offices") {
        return "Ofisas:";
      }
      if (collectionName === "divisions") {
        return "Padalinys:";
      }
      if (collectionName === "departments") {
        return "Skyrius:";
      }
      if (collectionName === "groups") {
        return "Grupė:";
      }
    },
  },
  computed: {
    ...mapGetters(["popUpComponent"]),
  },
};
</script>

<style scoped>
.popUp {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  background-color: #ffffff !important;
}
</style>
