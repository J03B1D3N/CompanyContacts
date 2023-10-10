<template>
  <div class="tabs w-3/6 flex justify-around" v-if="pb.authStore.isValid">
    <router-link
      :to="{ name: 'home' }"
      class="kontaktai"
      :class="{ active: this.$route.path === '/' }"
      ><b>Kontaktai</b></router-link
    >
    <router-link
      :to="{ name: 'companies' }"
      class="imones"
      :class="{ active: this.$route.path === '/companies' }"
      ><b>Įmonės</b></router-link
    >
    <router-link
      :to="{ name: 'structure' }"
      class="struktura"
      :class="{ active: this.$route.path === '/structure' }"
      ><b>Struktūra</b></router-link
    >
    <router-link
      v-if="checkPermissions('edit_permissions')"
      :to="{ name: 'accounts' }"
      class="paskyros"
      :class="{ active: this.$route.path === '/accounts' }"
      ><b>Paskyros</b></router-link
    >
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { pb, checkPermissions } from "../../lib/pocketbase.js";
export default {
  computed: {
    ...mapGetters(["permissions"]),
  },

  methods: {
    ...mapActions(["getCompanies"]),
  },

  data() {
    return {
      pb,
      checkPermissions,
    };
  },
};
</script>

<style scoped>
a {
  color: white !important;
  text-decoration: none !important;
}
a {
  padding: 0.5rem;
  border-radius: 15px;
  transition: 0.5s;
}
.active {
  color: black !important;
  background-color: white !important;
}
</style>
