import { pb } from "../../lib/pocketbase";
export default {
  state: {
    users: {
      items: [],
      page: 1,
      totalPages: 1,
      totalItems: 0,
    },
    user_permissions: {},
    usersPage: 1,
    usersPerPage: 8,
    allUsers: [],
    oldData: {},
  },
  getters: {
    user_permissions: (state) => state.user_permissions,
    users: (state) => state.users,
    usersPage: (state) => state.usersPage,
    usersPerPage: (state) => state.usersPerPage,
    allUsers: (state) => state.allUsers,
    oldData: (state) => state.oldData,
  },
  actions: {
    async fetchPermissions({ commit, dispatch }, id) {
      try {
        const user_permissions = await this.fetchFirstRecord(
          "user_permissions",
          id
        );
        commit("SET_USER_PERMISSIONS", user_permissions);
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti paskyros leidimų iš duomenų bazės",
          status: "failure",
        });
      }
    },

    async getUsers({ commit, dispatch, state }) {
      try {
        const users = await this.queryPaginatedData(
          "users",
          state.usersPage,
          state.usersPerPage
        );
        commit("SET_USERS", users);
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti paskyrų duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },
    async getAllUsers({ commit }) {
      const allUsers = await this.queryPaginatedData("users", 1, 200);
      commit("SET_ALL_USERS", allUsers.items);
    },

    async updateUser({ dispatch }, userAndPermissions) {
      try {
        const user = await this.updateRecord(
          "users",
          userAndPermissions.user.id,
          userAndPermissions.user.data
        );
        await this.updateRecord(
          "user_permissions",
          userAndPermissions.permissions.id,
          userAndPermissions.permissions.data
        );

        dispatch("getUsers");
        dispatch("pushToQueue", {
          message: "Paskyros duomenys redaguoti sėkmingai",
          status: "success",
        });
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko redaguoti paskyros duomenų",
          status: "failure",
        });
      } finally {
        await dispatch("getAllUsers");
        dispatch("setModal", {});
      }
    },

    async deleteUser({ dispatch, commit, state }, user) {
      try {
        if (user.id === pb.authStore.model.id) {
          dispatch("pushToQueue", {
            message:
              "Negalima ištrinti paskyros prie kurios dabar esate prisijungę",
            status: "failure",
          });
          return;
        }
        const deleteUser = await this.deleteRecord("users", user.id);
        const deletePermissions = await this.deleteRecord(
          "user_permissions",
          user.permissions_id
        );

        if (state.users.items.length === 1) {
          if (state.users.page > 1) {
            commit("SET_USERS_PAGE", state.users.page - 1);
            dispatch("getUsers");
          } else dispatch("getUsers");
        } else dispatch("getUsers");
        dispatch("pushToQueue", {
          message: "Paskyra ištrinta sėkmingai",
          status: "success",
        });
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko ištrinti paskyros",
          status: "failure",
        });
      } finally {
        await dispatch("getAllUsers");
        dispatch("setPopUpComponent", {});
      }
    },
    async createUser({ dispatch }, user) {
      try {
        const permissions = await this.createRecord(
          "user_permissions",
          user.permissions
        );
        user.newAccount.append("permissions_id", permissions.id);
        const account = await this.createRecord("users", user.newAccount);
        dispatch("pushToQueue", {
          message: "Paskyra sukurta sėkmingai",
          status: "success",
        });
        dispatch("getUsers");
        await pb
          .collection("users")
          .requestPasswordReset(user.newAccount.get("email"));
      } catch (error) {
        console.log(error);
        dispatch("pushToQueue", {
          message: "Paskyros sukurti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getAllUsers");
        dispatch("setModal", {});
      }
    },
    setUsersPage({ commit }, page) {
      commit("SET_USERS_PAGE", page);
    },
  },

  mutations: {
    SET_OLD_DATA(state, data) {
      state.oldData = data;
    },
    SET_ALL_USERS(state, users) {
      state.allUsers = users;
    },
    SET_USERS_PAGE(state, page) {
      state.usersPage = page;
    },
    SET_USER_PERMISSIONS(state, user_permissions) {
      state.user_permissions = user_permissions;
    },

    SET_USERS(state, users) {
      state.users = users;
    },
  },
};
