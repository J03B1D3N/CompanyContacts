export default {
  state: {
    employees: {
      page: 0,
      totalPages: 0,
      items: [],
    },
    employeesPage: 1,
    employeesPerPage: 8,

    filter: {
      search: "",
      company: null,
      office: null,
      division: null,
      department: null,
      group: null,
    },

    table: false,
    create: false,
    employeeDetail: {},
    oldEmployeeData: {},
  },
  getters: {
    employeeDetail: (state) => state.employeeDetail,
    search: (state) => state.search,
    table: (state) => state.table,
    filter: (state) => state.filter,
    employees: (state) => state.employees,
    employeesPage: (state) => state.employeesPage,
    employeesPerPage: (state) => state.employeesPerPage,
    create: (state) => state.create,
    oldEmployeeData: (state) => state.oldEmployeeData,
  },

  actions: {
    async getEmployees({ commit, state, dispatch }) {
      try {
        let filter = `(name ~ "${state.filter.search}" || surname ~ "${state.filter.search}" || email ~ "${state.filter.search}" 
                    || phone_number ~ "${state.filter.search}" || position ~ "${state.filter.search}")`;

        state.filter.company
          ? (filter += `&& (company_id = "${state.filter.company}")`)
          : null;

        state.filter.office
          ? (filter += `&& (office_id = "${state.filter.office}")`)
          : null;

        state.filter.division
          ? (filter += `&& (division_id = "${state.filter.division}")`)
          : null;

        state.filter.department
          ? (filter += `&& (department_id = "${state.filter.department}")`)
          : null;

        state.filter.group
          ? (filter += `&& (group_id = "${state.filter.group}")`)
          : null;
        const data = await this.queryPaginatedData(
          "employees",
          state.employeesPage,
          state.employeesPerPage,
          {
            expand: "office_id",
            filter: filter,
          }
        );
        data.totalPages === 0 ? (data.totalPages = 1) : null;
        commit("SET_EMPLOYEES", data);
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti darbuotojų duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },

    async getSingleEmployee({ commit, dispatch }, id) {
      try {
        const data = await this.fetchFirstRecord("employees", id, {
          expand: "company_id, office_id, division_id, department_id, group_id",
        });
        commit("SET_EMPLOYEE_DETAIL", data);
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Nepavyko gauti darbuotojo duomenų iš duomenų bazės",
          status: "failure",
        });
      }
    },

    async updateEmployee({ dispatch }, employee) {
      try {
        const update = await this.updateRecord(
          "employees",
          employee.id,
          employee.data
        );
        dispatch("getEmployees");
        dispatch("setModal", {});
        dispatch("pushToQueue", {
          message: "Kontakto duomenys redaguoti sėkmingai",
          status: "success",
        });
      } catch (error) {
        dispatch("setModal", {});
        dispatch("pushToQueue", {
          message: "Kontakto duomenų redaguoti nepavyko",
          status: "failure",
        });
      }
    },

    async createEmployee({ dispatch }, employee) {
      try {
        const create = await this.createRecord("employees", employee);
        dispatch("getEmployees");
        dispatch("setModal", {});
        dispatch("pushToQueue", {
          message: "Kontaktas sukurtas sėkmingai",
          status: "success",
        });
      } catch (error) {
        dispatch("pushToQueue", {
          message: "Sukurti kontakto nepavyko",
          status: "failure",
        }),
          dispatch("setModal", {});
      }
    },

    async deleteEmployee({ dispatch, state, commit }, employeeId) {
      try {
        const update = await this.deleteRecord("employees", employeeId);

        if (state.employees.items.length === 1) {
          if (state.employees.page > 1) {
            commit("SET_EMPLOYEES_PAGE", state.employeesPage - 1);
            dispatch("getEmployees");
          } else {
            dispatch("getEmployees");
          }
        } else dispatch("getEmployees");
        dispatch("setPopUpComponent", {});
        dispatch("pushToQueue", {
          message: "Kontaktas ištrintas sėkmingai",
          status: "success",
        });
      } catch (error) {
        dispatch("setPopUpComponent", {});
        dispatch("pushToQueue", {
          message: "Kontakto ištrinti nepavyko",
          status: "failure",
        });
      }
    },

    async setFilter({ commit, dispatch }, filter) {
      commit("SET_FILTER", filter);
      await dispatch("getEmployees");
    },

    refreshFilters({ commit }) {
      const defaultState = {
        items: [],
        page: 1,
        totalPages: 1,
        totalItems: 0,
      };
      commit("SET_COMPANIES", defaultState);
      commit("SET_SELECTED_COMPANY", null);
      commit("SET_OFFICES", defaultState);
      commit("SET_SELECTED_OFFICE", null);
      commit("SET_DIVISIONS", defaultState);
      commit("SET_SELECTED_DIVISION", null);
      commit("SET_DEPARTMENTS", defaultState);
      commit("SET_SELECTED_DEPARTMENT", null);
      commit("SET_GROUPS", defaultState);
      commit("SET_SELECTED_GROUP", null);
      commit("SET_FILTER", {
        search: "",
        company: "",
        office: "",
        division: "",
        department: "",
        group: "",
      });
    },

    toggleTable({ commit }) {
      commit("TABLE_TOGGLE");
    },
    setEmployeesPerPage({ commit }, number) {
      commit("SET_EMPLOYEES_PER_PAGE", number);
    },
    setEmployeesPage({ commit }, page) {
      commit("SET_EMPLOYEES_PAGE", page);
    },
  },

  mutations: {
    SET_OLD_EMPLOYEE_DATA(state, data) {
      state.oldEmployeeData = data;
    },
    CREATE_TOGGLE(state) {
      state.create = !state.create;
    },
    SET_EMPLOYEE_DETAIL(state, data) {
      state.employeeDetail = data;
    },
    SET_FILTER(state, filter) {
      state.filter = filter;
    },
    SET_EMPLOYEES_PAGE(state, page) {
      state.employeesPage = page;
    },
    SET_EMPLOYEES(state, employees) {
      state.employees = employees;
    },
    SET_EMPLOYEES_PER_PAGE(state, number) {
      state.employeesPerPage = number;
    },
    TABLE_TOGGLE(state) {
      state.table = !state.table;
    },
  },
};
