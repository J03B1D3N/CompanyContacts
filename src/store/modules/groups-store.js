export default {
  state: {
    groups: {
      items: [],
      page: 1,
      totalPages: 1,
      totalItems: 0,
    },
    selectedGroup: null,
    groupsPage: 1,
    groupsPerPage: 7,
  },
  getters: {
    groups: (state) => state.groups,
    selectedGroup: (state) => state.selectedGroup,
    groupsPage: (state) => state.groupsPage,
  },
  actions: {
    async getGroups({ commit, dispatch, state }) {
      try {
        const groups = await this.queryPaginatedData(
          "groups",
          state.groupsPage,
          state.groupsPerPage
        );
        commit("SET_GROUPS", groups);
        return groups;
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti grupių duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },
    async getGroupsForOptions({ commit, dispatch, state }) {
      try {
        const groups = await this.queryPaginatedData("groups", 1, 200);
        return groups;
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti grupių duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },
    async updateGroup({ dispatch }, group) {
      try {
        const update = await this.updateRecord("groups", group.id, group.data);
        let getRelations = await this.queryPaginatedData(
          "departments_groups",
          1,
          50,
          { filter: `group_id = "${group.id}"` }
        );

        const forDeletion = getRelations.items.filter(
          (item) => !group.structureBelongsTo.includes(item.department_id)
        );

        forDeletion.forEach(
          async (item) => await this.deleteRecord("departments_groups", item.id)
        );

        const forCreation = [];

        group.structureBelongsTo.forEach((item) => {
          const found = getRelations.items.some(
            (relation) => relation.department_id === item
          );
          if (!found) {
            forCreation.push(item);
          }
        });
        forCreation.forEach(
          async (item) =>
            await this.createRecord("departments_groups", {
              department_id: item,
              group_id: group.id,
            })
        );
        dispatch("pushToQueue", {
          message: "Grupė redaguota sėkmingai",
          status: "success",
        });
        dispatch("getGroups");
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Grupės redaguoti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getNameCheck");
        dispatch("setModal", {});
      }
    },

    async deleteGroup({ dispatch, commit, state }, groupId) {
      try {
        const employees = await this.queryPaginatedData("employees", 1, 50, {
          filter: `group_id="${groupId}"`,
        });
        if (employees.items.length > 0) {
          dispatch("pushToQueue", {
            message:
              "Grupės ištrinti negalima, nes prie jo yra priskirtų darbuotojų",
            status: "failure",
          });
          return;
        }
        const deleteGroups = await this.deleteRecord("groups", groupId);
        dispatch("pushToQueue", {
          message: "Grupė ištrinta sėkmingai",
          status: "success",
        });
        if (state.groups.items.length === 1) {
          if (state.groups.page > 1) {
            commit("SET_GROUPS_PAGE", state.groups.page - 1);
            dispatch("getGroups");
          } else {
            dispatch("getGroups");
          }
        } else dispatch("getGroups");
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Grupės ištrinti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getNameCheck");
        dispatch("setPopUpComponent", {});
      }
    },
    async createGroup({ dispatch }, group) {
      try {
        const createGroup = await this.createRecord("groups", {
          name: group.name,
        });
        group.structureBelongsTo.forEach(
          async (department) =>
            await this.createRecord("departments_groups", {
              department_id: department,
              group_id: createGroup.id,
            })
        );
        dispatch("pushToQueue", {
          message: "Grupė sukurta sėkmingai",
          status: "success",
        });
        dispatch("getGroups");
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Grupės sukurti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getNameCheck");
        dispatch("setModal", {});
      }
    },
    setGroupsPage({ commit, dispatch }, page) {
      commit("SET_GROUPS_PAGE", page);
      dispatch("getGroups");
    },
  },

  mutations: {
    SET_GROUPS_PER_PAGE(state, perPage) {
      state.groupsPerPage = perPage;
    },
    SET_GROUPS_PAGE(state, page) {
      state.groupsPage = page;
    },
    SET_GROUPS(state, groups) {
      state.groups = groups;
    },
    SET_SELECTED_GROUP(state, group) {
      state.selectedGroup = group;
    },
  },
};
