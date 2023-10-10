<template>
  <div
    class="popUp px-12 py-1 h-64 w-2/6 flex flex-col items-center justify-around"
  >
    <h1 class="text-2xl"><b>Ar tikrai norite ištrinti kontaktą?</b></h1>
    <h1 class="text-xl break-words w-full">
      Vardas ir pavardė: {{ popUpComponent.data.name }}
      {{ popUpComponent.data.surname }}
    </h1>
    <h1 class="text-xl break-words w-full">
      Pozicija: {{ popUpComponent.data.position }}
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
    ...mapActions(["deleteEmployee", "setPopUpComponent"]),
    handleNe() {
      this.setPopUpComponent({});
    },
    handleTaip() {
      this.deleteEmployee(this.popUpComponent.data.id);
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
