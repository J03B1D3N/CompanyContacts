<template>
  <div class="companies flex flex-col justify-between flex-1">
    <AccountsTable />
    <PaginationVue
      :structure="users"
      @incrementPage="incrementPage"
      @decrementPage="decrementPage"
    />
  </div>
</template>

<script>
import PaginationVue from "../pagination/Pagination.vue";
import AccountsTable from "../tables/AccountsTable.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["setUsersPage", "getUsers"]),
    incrementPage() {
      this.setUsersPage(this.users.page + 1);
      this.getUsers();
    },
    decrementPage() {
      this.setUsersPage(this.users.page - 1);
      this.getUsers();
    },
  },
  computed: {
    ...mapGetters(["users"]),
  },
  components: {
    PaginationVue,
    AccountsTable,
  },
};
</script>

<style></style>
