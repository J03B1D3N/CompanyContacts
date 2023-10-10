export default {
  state: {
    offices: {
      items: [],
      page: 1,
      totalPages: 1,
      totalItems: 0,
    },
    selectedOffice: null,
    officesPage: 1,
    officesPerPage: 7,
    officesForOptions: [],
  },
  getters: {
    selectedOffice: (state) => state.selectedOffice,
    offices: (state) => state.offices,
    offices_divisions: (state) => state.offices_divisions,
    officesPage: (state) => state.officesPage,
  },
  actions: {
    async getOffices({ commit, dispatch, state }) {
      try {
        const offices = await this.queryPaginatedData(
          "offices",
          state.officesPage,
          state.officesPerPage
        );
        commit("SET_OFFICES", offices);
        return offices;
      } catch (error) {
        console.log(error);
        dispatch("pushToQueue", {
          message: "Nepavyko gauti ofisų duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },

    async getOfficesForOptions({ dispatch }) {
      try {
        const offices = await this.queryPaginatedData("offices", 1, 200);
        return offices;
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti ofisų duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },

    async getOffices_divisionsById({ commit, dispatch }, id) {
      try {
        const offices_divisions = await this.queryPaginatedData(
          "offices_divisions",
          1,
          200,
          {
            expand: "division_id",
            filter: `office_id = "${id}"`,
          }
        );
        let result = [];
        offices_divisions.items.forEach((office_division) =>
          result.push(office_division.expand.division_id)
        );
        commit("SET_DIVISIONS", {
          items: result,
          page: 1,
          totalPages: 1,
          totalItems: 0,
        });
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti divizijų duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },
    async updateOffice({ dispatch }, office) {
      try {
        const update = await this.updateRecord(
          "offices",
          office.id,
          office.data
        );
        let getRelations = await this.queryPaginatedData(
          "companies_offices",
          1,
          50,
          { filter: `office_id = "${office.id}"` }
        );

        const forDeletion = getRelations.items.filter(
          (item) => !office.structureBelongsTo.includes(item.company_id)
        );
        forDeletion.forEach(
          async (item) => await this.deleteRecord("companies_offices", item.id)
        );

        const forCreation = [];

        office.structureBelongsTo.forEach((item) => {
          const found = getRelations.items.some(
            (relation) => relation.company_id === item
          );
          if (!found) {
            forCreation.push(item);
          }
        });

        forCreation.forEach(
          async (item) =>
            await this.createRecord("companies_offices", {
              company_id: item,
              office_id: office.id,
            })
        );
        dispatch("pushToQueue", {
          message: "Ofisas redaguotas sėkmingai",
          status: "success",
        });
        dispatch("getOffices");
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Ofiso redaguoti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getNameCheck");
        dispatch("setModal", {});
      }
    },

    async deleteOffice({ dispatch, commit, state }, officeId) {
      try {
        const employees = await this.queryPaginatedData("employees", 1, 50, {
          filter: `office_id="${officeId}"`,
        });
        if (employees.items.length > 0) {
          dispatch("pushToQueue", {
            message:
              "Ofiso ištrinti negalima, nes prie jo yra priskirtų darbuotojų",
            status: "failure",
          });
          return;
        }
        const childRelations = await this.queryPaginatedData(
          "offices_divisions",
          1,
          50,
          {
            filter: `office_id="${officeId}"`,
            expand: "division_id",
          }
        );
        if (childRelations.items.length > 0) {
          const childRelationNames = [];
          childRelations.items.forEach((item) =>
            childRelationNames.push(" " + item.expand.division_id.name)
          );

          dispatch("pushToQueue", {
            message: `Ofiso ištrinti negalima, nes prie jo priskirti padaliniai: ${childRelationNames}`,
            status: "failure",
          });
          return;
        }
        const deleteOffice = await this.deleteRecord("offices", officeId);
        dispatch("pushToQueue", {
          message: "Ofisas ištrintas sėkmingai",
          status: "success",
        });

        if (state.offices.items.length === 1) {
          if (state.offices.page > 1) {
            commit("SET_OFFICES_PAGE", state.officesPage - 1);
            dispatch("getOffices");
          } else {
            dispatch("getOffices");
          }
        } else dispatch("getOffices");
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Ofiso ištrinti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getNameCheck");
        dispatch("setPopUpComponent", {});
      }
    },
    async createOffice({ dispatch }, office) {
      try {
        const createOffice = await this.createRecord("offices", {
          name: office.name,
          street: office.street,
          street_number: office.street_number,
          city: office.city,
          country: office.country,
        });
        office.structureBelongsTo.forEach(
          async (company) =>
            await this.createRecord("companies_offices", {
              company_id: company,
              office_id: createOffice.id,
            })
        );
        dispatch("pushToQueue", {
          message: "Ofisas sukurtas sėkmingai",
          status: "success",
        });
        dispatch("getOffices");
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Ofiso sukurti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getNameCheck");
        dispatch("setModal", {});
      }
    },
    setOfficesPage({ commit, dispatch }, page) {
      commit("SET_OFFICES_PAGE", page);
      dispatch("getOffices");
    },
  },

  mutations: {
    SET_OFFICES_PER_PAGE(state, perPage) {
      state.officesPerPage = perPage;
    },
    SET_OFFICES_PAGE(state, page) {
      state.officesPage = page;
    },
    SET_SELECTED_OFFICE(state, office) {
      state.selectedOffice = office;
    },
    SET_OFFICES(state, offices) {
      state.offices = offices;
    },
  },
};
