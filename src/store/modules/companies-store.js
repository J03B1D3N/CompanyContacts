export default {
  state: {
    companies: {
      items: [],
      page: 1,
      totalPages: 1,
      totalItems: 0,
    },
    selectedCompany: null,
    companiesPage: 1,
    companiesPerPage: 10,
    companiesNameCheck: [],
  },
  getters: {
    selectedCompany: (state) => state.selectedCompany,
    companies: (state) => state.companies,
    companiesPage: (state) => state.companiesPage,
    companiesPerPage: (state) => state.companiesPerPage,
    companiesNameCheck: (state) => state.companiesNameCheck,
  },
  actions: {
    async getCompanies_officesById({ commit, state, dispatch }, id) {
      try {
        const companies_offices = await this.queryPaginatedData(
          "companies_offices",
          1,
          200,
          {
            expand: "office_id",
            filter: `company_id = "${id}"`,
          }
        );
        let result = [];
        companies_offices.items.forEach((companies_office) =>
          result.push(companies_office.expand.office_id)
        );
        commit("SET_OFFICES", {
          items: result,
          page: 1,
          totalPages: 1,
          totalItems: 0,
        });
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti ofisų duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },

    async getCompanies({ commit, state, dispatch }) {
      try {
        const companies = await this.queryPaginatedData(
          "companies",
          state.companiesPage,
          state.companiesPerPage
        );
        commit("SET_COMPANIES", companies);
        return companies;
      } catch (error) {
        console.log(error);
        dispatch("pushToQueue", {
          message: "Nepavyko gauti kompanijų duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },

    async getCompaniesNameCheck({ commit }) {
      try {
        const companies = await this.queryPaginatedData("companies", 1, 200);
        commit("SET_COMPANIES_NAME_CHECK", companies);
        return companies;
      } catch (error) {}
    },

    async updateCompany({ dispatch }, company) {
      try {
        const update = await this.updateRecord(
          "companies",
          company.id,
          company.data
        );
        dispatch("getCompanies");
        dispatch("pushToQueue", {
          message: "Kompanija redaguota sėkmingai",
          status: "success",
        });
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Kompanijos redaguoti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getCompaniesNameCheck");
        dispatch("setModal", {});
      }
    },

    async deleteCompany({ dispatch, state, commit }, companyId) {
      try {
        const employees = await this.queryPaginatedData("employees", 1, 50, {
          filter: `company_id="${companyId}"`,
        });
        if (employees.items.length > 0) {
          dispatch("pushToQueue", {
            message:
              "Kompanijos ištrinti negalima, nes prie jos yra priskirtų darbuotojų",
            status: "failure",
          });
          return;
        }
        const childRelations = await this.queryPaginatedData(
          "companies_offices",
          1,
          50,
          {
            filter: `company_id="${companyId}"`,
            expand: "office_id",
          }
        );
        if (childRelations.items.length > 0) {
          const childRelationNames = [];
          childRelations.items.forEach((item) =>
            childRelationNames.push(" " + item.expand.office_id.name)
          );

          dispatch("pushToQueue", {
            message: `Kompanijos ištrinti negalima, nes prie jos priskirti ofisai: ${childRelationNames}`,
            status: "failure",
          });
          return;
        }
        const deleteCompany = await this.deleteRecord("companies", companyId);
        dispatch("pushToQueue", {
          message: "Kompanija ištrinta sėkmingai",
          status: "success",
        });
        if (state.companies.items.length === 1) {
          if (state.companies.page > 1) {
            commit("SET_COMPANIES_PAGE", state.companiesPage - 1);
            dispatch("getCompanies");
          } else {
            dispatch("getGroups");
          }
        } else dispatch("getCompanies");
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Kompanijos ištrinti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getCompaniesNameCheck");
        dispatch("setPopUpComponent", {});
      }
    },

    async createCompany({ dispatch, commit }, company) {
      try {
        const createCompany = await this.createRecord("companies", {
          name: company.name,
        });
        dispatch("getCompanies");
        dispatch("pushToQueue", {
          message: "Kompanija sukurta sėkmingai",
          status: "success",
        });
      } catch (error) {
        console.log(error);
        dispatch("pushToQueue", {
          message: "Kompanijos sukurti nepavyko",
          status: "failure",
        });
      } finally {
        await dispatch("getCompaniesNameCheck");
        dispatch("setModal", {});
      }
    },

    setCompaniesPage({ commit, dispatch }, page) {
      commit("SET_COMPANIES_PAGE", page);
    },
    setCompaniesPerPage({ commit }, page) {
      commit("SET_COMPANIES_PER_PAGE", page);
    },
  },

  mutations: {
    SET_COMPANIES_NAME_CHECK(state, nameCheck) {
      state.companiesNameCheck = nameCheck;
    },
    SET_SELECTED_COMPANY(state, company) {
      state.selectedCompany = company;
    },
    SET_COMPANIES(state, companies) {
      state.companies = companies;
    },
    SET_COMPANIES_PAGE(state, page) {
      state.companiesPage = page;
    },
    SET_COMPANIES_PER_PAGE(state, page) {
      state.companiesPerPage = page;
    },
  },
};
