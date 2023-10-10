<template>
  <div class="notFound flex-1 flex flex-col justify-around items-center">
    <h1 class="text-5xl">Puslapis kurio ieškote neegzistuoja</h1>
    <md-button class="md-raised md-primary" @click="handleClick"
      >eiti į pradinį puslapį</md-button
    >
  </div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped></style>
