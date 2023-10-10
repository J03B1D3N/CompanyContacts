import { router } from "../../router";

export default {
  state: {
    permissions: {},
  },

  getters: {
    permissions: (state) => state.permissions,
  },

  actions: {
    async login({}, loginDetails) {
      try {
        await this.login(loginDetails.email, loginDetails.password);
        router.push({ name: "home" });
      } catch (ClientResponseError) {}
    },
    async logout({ dispatch }) {
      try {
        this.logout();
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Išeiti iš paskyros nepavyko",
          status: "failure",
        });
      }
    },
  },
  mutations: {
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions;
    },
  },
};
