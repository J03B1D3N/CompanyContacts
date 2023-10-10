<template>
  <div
    class="popUp px-12 py-1 h-64 w-2/6 flex flex-col items-center justify-around"
  >
    <h1 class="text-2xl"><b>Ar tikrai norite ištrinti paskyrą?</b></h1>
    <h1 class="text-xl break-words w-full">
      Vardas: {{ popUpComponent.data.username }}
    </h1>
    <h1 class="text-xl break-words w-full">
      El. paštas: {{ popUpComponent.data.email }}
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
    ...mapActions(["deleteUser", "setPopUpComponent"]),
    handleNe() {
      this.setPopUpComponent({});
    },
    handleTaip() {
      this.deleteUser(this.popUpComponent.data);
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
