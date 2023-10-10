<template>
  <div class="flex">
    <md-button
      class="md-raised"
      v-if="!pb.authStore.isValid"
      @click="handleClick"
      >Prisijungti</md-button
    >

    <md-menu md-size="medium" md-align-trigger v-if="pb.authStore.isValid">
      <md-button md-menu-trigger class="loginBtn">
        <md-avatar class="avatar" v-if="pb.authStore.model.avatar.length > 0">
          <img
            :src="`${$CURRENT_URL}/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`"
            alt="Avatar"
          />
        </md-avatar>
        <img v-else :src="avatar" alt="avatar" class="w-10" />
      </md-button>

      <md-menu-content>
        <md-menu-item>{{ pb.authStore.model.username }}</md-menu-item>
        <md-menu-item class="logout" @click="handleLogOut"
          >Log Out</md-menu-item
        >
      </md-menu-content>
    </md-menu>
  </div>
</template>

<script>
import { pb } from "../../lib/pocketbase.js";
import avatar from "../../assets/avatar.png";
import { mapActions } from "vuex";
export default {
  created() {
    console.log(pb.authStore);
  },
  data() {
    return {
      avatar,
      pb,
    };
  },
  methods: {
    ...mapActions(["logout", "fetchPermissions"]),

    handleClick() {
      this.$router.push("/login");
    },
    handleLogOut() {
      this.logout();
      window.location.reload();
    },
  },
};
</script>

<style>
.logout {
  cursor: pointer !important;
}
.logout:hover {
  background-color: whitesmoke;
}
.loginBtn {
  height: 3rem !important;
}
</style>
