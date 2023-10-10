export default {
  state: {
    divisions: {
      items: [],
      page: 1,
      totalPages: 1,
      totalItems: 0,
    },
    selectedDivision: null,
    divisionsPage: 1,
    divisionsPerPage: 7,
  },
  getters: {
    divisions: (state) => state.divisions,
    selectedDivision: (state) => state.selectedDivision,
    divisionsPage: (state) => state.divisionsPage,
  },
  actions: {
    async getDivisions({ commit, dispatch, state }) {
      try {
        const divisions = await this.queryPaginatedData(
          "divisions",
          state.divisionsPage,
          state.divisionsPerPage
        );
        commit("SET_DIVISIONS", divisions);
        return divisions;
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti padalinų duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },
    async getDivisionsForOptions({ dispatch }) {
      try {
        const divisions = await this.queryPaginatedData("divisions", 1, 200);
        return divisions;
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti padalinų duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },

    async getDivisions_departmentsById({ commit, dispatch }, id) {
      try {
        const division_departments = await this.queryPaginatedData(
          "divisions_departments",
          1,
          200,
          {
            expand: "department_id",
            filter: `division_id = "${id}"`,
          }
        );
        let result = [];
        division_departments.items.forEach((division_department) =>
          result.push(division_department.expand.department_id)
        );
        commit("SET_DEPARTMENTS", {
          items: result,
          page: 1,
          totalPages: 1,
          totalItems: 0,
        });
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti padalinių duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },

    async updateDivision({ dispatch }, division) {
      try {
        const update = await this.updateRecord(
          "divisions",
          division.id,
          division.data
        );
        let getRelations = await this.queryPaginatedData(
          "offices_divisions",
          1,
          50,
          { filter: `division_id = "${division.id}"` }
        );

        const forDeletion = getRelations.items.filter(
          (item) => !division.structureBelongsTo.includes(item.office_id)
        );

        forDeletion.forEach(
          async (item) => await this.deleteRecord("offices_divisions", item.id)
        );

        const forCreation = [];

        division.structureBelongsTo.forEach((item) => {
          const found = getRelations.items.some(
            (relation) => relation.office_id === item
          );
          if (!found) {
            forCreation.push(item);
          }
        });
        forCreation.forEach(
          async (item) =>
            await this.createRecord("offices_divisions", {
              office_id: item,
              division_id: division.id,
            })
        );

        dispatch("pushToQueue", {
          message: "Padalinys redaguotas sėkmingai",
          status: "success",
        });
        dispatch("getDivisions");
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Padalinio redaguoti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getNameCheck");
        dispatch("setModal", {});
      }
    },
    async deleteDivision({ dispatch, state, commit }, divisionId) {
      try {
        const employees = await this.queryPaginatedData("employees", 1, 50, {
          filter: `division_id="${divisionId}"`,
        });
        if (employees.items.length > 0) {
          dispatch("pushToQueue", {
            message:
              "Padalinio ištrinti negalima, nes prie jo yra priskirtų darbuotojų",
            status: "failure",
          });
          return;
        }
        const childRelations = await this.queryPaginatedData(
          "divisions_departments",
          1,
          50,
          {
            filter: `division_id="${divisionId}"`,
            expand: "department_id",
          }
        );
        if (childRelations.items.length > 0) {
          const childRelationNames = [];
          childRelations.items.forEach((item) =>
            childRelationNames.push(" " + item.expand.department_id.name)
          );

          dispatch("pushToQueue", {
            message: `Padalinio ištrinti negalima, nes prie jo priskirti skyriai: ${childRelationNames}`,
            status: "failure",
          });
          return;
        }
        const deleteDivision = await this.deleteRecord("divisions", divisionId);
        dispatch("pushToQueue", {
          message: "Padalinys ištrintas sėkmingai",
          status: "success",
        });
        if (state.divisions.items.length === 1) {
          if (state.divisions.page > 1) {
            commit("SET_DIVISIONS_PAGE", state.divisions.page - 1);
            dispatch("getDivisions");
            return;
          } else {
            dispatch("getDivisions");
          }
        } else dispatch("getDivisions");
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Padalinio ištrinti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getNameCheck");
        dispatch("setPopUpComponent", {});
      }
    },
    async createDivision({ dispatch }, division) {
      try {
        const createDivision = await this.createRecord("divisions", {
          name: division.name,
        });
        division.structureBelongsTo.forEach(
          async (office) =>
            await this.createRecord("offices_divisions", {
              office_id: office,
              division_id: createDivision.id,
            })
        );

        dispatch("pushToQueue", {
          message: "Padalinys sukurtas sėkmingai",
          status: "success",
        });
        dispatch("getDivisions");
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Padalinio sukurti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getNameCheck");
        dispatch("setModal", {});
      }
    },
    setDivisionsPage({ commit, dispatch }, page) {
      commit("SET_DIVISIONS_PAGE", page);
      dispatch("getDivisions");
    },
  },

  mutations: {
    SET_DIVISIONS_PER_PAGE(state, perPage) {
      state.divisionsPerPage = perPage;
    },
    SET_DIVISIONS_PAGE(state, page) {
      state.divisionsPage = page;
    },
    SET_SELECTED_DIVISION(state, division) {
      state.selectedDivision = division;
    },
    SET_DIVISIONS(state, divisions) {
      state.divisions = divisions;
    },
  },
};
