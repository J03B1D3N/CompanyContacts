export default {
  state: {
    departments: {
      items: [],
      page: 1,
      totalPages: 1,
      totalItems: 0,
    },
    selectedDepartment: null,
    departmentsPage: 1,
    departmentsPerPage: 7,
  },
  getters: {
    departments: (state) => state.departments,
    departmentsPage: (state) => state.departmentsPage,
    selectedDepartment: (state) => state.selectedDepartment,
  },
  actions: {
    async getDepartments({ commit, dispatch, state }) {
      try {
        const departments = await this.queryPaginatedData(
          "departments",
          state.departmentsPage,
          state.departmentsPerPage
        );
        commit("SET_DEPARTMENTS", departments);
        return departments;
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti skyrių duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },

    async getDepartmentsForOptions({ dispatch }) {
      try {
        const departments = await this.queryPaginatedData(
          "departments",
          1,
          200
        );
        return departments;
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti skyrių duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },

    async getDepartments_groupsById({ commit, dispatch }, id) {
      try {
        const departments_groups = await this.queryPaginatedData(
          "departments_groups",
          1,
          200,
          {
            expand: "group_id",
            filter: `department_id = "${id}"`,
          }
        );
        let result = [];
        departments_groups.items.forEach((department_group) =>
          result.push(department_group.expand.group_id)
        );
        commit("SET_GROUPS", {
          items: result,
          page: 1,
          totalPages: 1,
          totalItems: 0,
        });
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti grupių duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },

    async updateDepartment({ dispatch }, department) {
      try {
        const update = await this.updateRecord(
          "departments",
          department.id,
          department.data
        );
        let getRelations = await this.queryPaginatedData(
          "divisions_departments",
          1,
          50,
          { filter: `department_id = "${department.id}"` }
        );

        const forDeletion = getRelations.items.filter(
          (item) => !department.structureBelongsTo.includes(item.division_id)
        );

        forDeletion.forEach(
          async (item) =>
            await this.deleteRecord("divisions_departments", item.id)
        );

        const forCreation = [];

        department.structureBelongsTo.forEach((item) => {
          const found = getRelations.items.some(
            (relation) => relation.division_id === item
          );
          if (!found) {
            forCreation.push(item);
          }
        });
        forCreation.forEach(
          async (item) =>
            await this.createRecord("divisions_departments", {
              division_id: item,
              department_id: department.id,
            })
        );

        dispatch("pushToQueue", {
          message: "Skyrius redaguotas sėkmingai",
          status: "success",
        });
        dispatch("getDepartments");
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Skyriaus redaguoti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getNameCheck");
        dispatch("setModal", {});
      }
    },

    async deleteDepartment({ dispatch, state, commit }, departmentId) {
      try {
        const employees = await this.queryPaginatedData("employees", 1, 50, {
          filter: `department_id="${departmentId}"`,
        });
        if (employees.items.length > 0) {
          dispatch("pushToQueue", {
            message:
              "Skyriaus ištrinti negalima, nes prie jo yra priskirtų darbuotojų",
            status: "failure",
          });
          return;
        }
        const childRelations = await this.queryPaginatedData(
          "departments_groups",
          1,
          50,
          {
            filter: `department_id="${departmentId}"`,
            expand: "group_id",
          }
        );
        if (childRelations.items.length > 0) {
          const childRelationNames = [];
          childRelations.items.forEach((item) =>
            childRelationNames.push(" " + item.expand.group_id.name)
          );

          dispatch("pushToQueue", {
            message: `Skyriaus ištrinti negalima, nes prie jo priskirtos grupės: ${childRelationNames}`,
            status: "failure",
          });
          return;
        }
        const deleteDepartment = await this.deleteRecord(
          "departments",
          departmentId
        );
        dispatch("pushToQueue", {
          message: "Skyrius ištrintas sėkmingai",
          status: "success",
        });
        if (state.departments.items.length === 1) {
          if (state.departments.page > 1) {
            commit("SET_DEPARTMENTS_PAGE", state.departments.page - 1);
            dispatch("getDepartments");
          } else {
            dispatch("getDepartments");
          }
        } else dispatch("getDepartments");
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Skyriaus ištrinti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getNameCheck");
        dispatch("setPopUpComponent", {});
      }
    },
    async createDepartment({ dispatch }, department) {
      try {
        const createDepartment = await this.createRecord("departments", {
          name: department.name,
        });

        department.structureBelongsTo.forEach(
          async (division) =>
            await this.createRecord("divisions_departments", {
              division_id: division,
              department_id: createDepartment.id,
            })
        );
        dispatch("pushToQueue", {
          message: "Skyrius sukurtas sėkmingai",
          status: "success",
        });
        dispatch("getDepartments");
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Skyriaus sukurti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getNameCheck");
        dispatch("setModal", {});
      }
    },
    setDepartmentsPage({ commit, dispatch }, page) {
      commit("SET_DEPARTMENTS_PAGE", page);
      dispatch("getDepartments");
    },
  },

  mutations: {
    SET_DEPARTMENTS_PER_PAGE(state, perPage) {
      state.departmentsPerPage = perPage;
    },
    SET_DEPARTMENTS_PAGE(state, page) {
      state.departmentsPage = page;
    },
    SET_DEPARTMENTS(state, departments) {
      state.departments = departments;
    },
    SET_SELECTED_DEPARTMENT(state, department) {
      state.selectedDepartment = department;
    },
  },
};
