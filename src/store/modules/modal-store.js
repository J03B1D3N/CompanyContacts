import uniqid from "uniqid";
export default {
  state: {
    modal: {},
    popUpComponent: {},
    notifications: [],
    queue: [],
  },

  getters: {
    modal: (state) => state.modal,
    popUpComponent: (state) => state.popUpComponent,
    notifications: (state) => state.notifications,
    queue: (state) => state.queue,
  },

  actions: {
    async pushToQueue({ commit, state }, notification) {
      notification["id"] = uniqid();

      if (state.notifications.length >= 4) {
        commit("PUSH_QUEUE", notification);
      } else {
        commit("PUSH_NOTIFICATION", notification);
      }
    },

    setPopUpComponent({ commit }, component) {
      commit("SET_POP_UP_COMPONENT", component);
    },

    setModal({ commit }, component) {
      commit("SET_MODAL", component);
    },
  },

  mutations: {
    CLOSE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter(
        (item) => item.id !== id
      );
    },
    SET_POP_UP_COMPONENT(state, component) {
      state.popUpComponent = component;
    },
    SET_MODAL(state, component) {
      state.modal = component;
    },
    PUSH_NOTIFICATION(state, notification) {
      state.notifications.push(notification);
    },
    PUSH_QUEUE(state, notification) {
      state.queue.push(notification);
    },
    SHIFT_QUEUE(state) {
      state.notifications.push(state.queue.shift());
    },
  },
};
