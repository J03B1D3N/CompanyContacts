export default {
  state: {
    nameCheck: [],
    choiceOptionsForStructure: [],
    structureBelongsTo: [],
    chosenStructureDisplay: "Ofisai",
    oldStructureData: {},
  },
  getters: {
    nameCheck: (state) => state.nameCheck,
    choiceOptionsForStructure: (state) => state.choiceOptionsForStructure,
    structureBelongsTo: (state) => state.structureBelongsTo,
    chosenStructureDisplay: (state) => state.chosenStructureDisplay,
    oldStructureData: (state) => state.oldStructureData,
  },
  actions: {
    async fetchOptionsForStructure({ commit, dispatch }, structureUnit) {
      try {
        const parentStructure = await dispatch(structureUnit.parentStructure);
        commit("SET_CHOICE_OPTIONS_FOR_STRUCTURE", parentStructure.items);
        if (structureUnit.id) {
          const parentStructureRelation = await this.queryPaginatedData(
            structureUnit.parentStructureRelation,
            1,
            200,
            { expand: `${structureUnit.expand[0]}, ${structureUnit.expand[1]}` }
          );
          let parrentStructureBelongingToChild =
            parentStructureRelation.items.filter(
              (item) => item[structureUnit.expand[1]] === structureUnit.id
            );
          parrentStructureBelongingToChild =
            parrentStructureBelongingToChild.map(
              (item) => item[structureUnit.expand[0]]
            );
          commit("SET_STRUCTURE_BELONGS_TO", parrentStructureBelongingToChild);
        }
      } catch (error) {
        console.log(error);
        dispatch("pushToQueue", {
          message: "Nepavyko gauti informacijos iš duomenų bazės",
          status: "failure",
        });
      }
    },

    async getStructure({ dispatch }) {
      const offices = await dispatch("getOffices");
      const divisions = await dispatch("getDivisions");
      const departments = await dispatch("getDepartments");
      const groups = await dispatch("getGroups");
    },
    async getNameCheck({ commit, dispatch }) {
      try {
        const offices = await dispatch("getOfficesForOptions");
        const divisions = await dispatch("getDivisionsForOptions");
        const departments = await dispatch("getDepartmentsForOptions");
        const groups = await dispatch("getGroupsForOptions");
        commit("SET_NAME_CHECK", [
          ...offices.items,
          ...divisions.items,
          ...departments.items,
          ...groups.items,
        ]);
        console.log("namecheck fetched and commited");
      } catch (error) {
        console.log(error);
        dispatch("pushToQueue", {
          message: "failed to fetch nameCheck",
          status: "failure",
        });
      }
    },
  },

  mutations: {
    SET_OLD_STRUCTURE_DATA(state, data) {
      state.oldStructureData = data;
    },
    SET_CHOSEN_STRUCTURE_DISPLAY(state, structure) {
      state.chosenStructureDisplay = structure;
    },
    SET_STRUCTURE_BELONGS_TO(state, structure) {
      state.structureBelongsTo = structure;
    },
    SET_NAME_CHECK(state, array) {
      state.nameCheck = array;
    },
    SET_CHOICE_OPTIONS_FOR_STRUCTURE(state, structureOptions) {
      state.choiceOptionsForStructure = structureOptions;
    },
  },
};
