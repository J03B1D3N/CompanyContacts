import { pb } from "../../lib/pocketbase.js";

let authAPI = (store) => {
  (store.login = async function (email, password) {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password, {
          expand: "permissions_id",
        });
      return authData;
    } catch (ClientResponseError) {
      ClientResponseError.status === 400
        ? store.dispatch("pushToQueue", {
            message: "Prisijungti nepavyko, patikrinkite prisijungimo duomenis",
            status: "failure",
          })
        : null;
      ClientResponseError.status === 0
        ? store.dispatch("pushToQueue", {
            message: "Prisijungti nepavyko, nėra ryšio su serveriu",
            status: "failure",
          })
        : null;
      throw new Error(ClientResponseError);
    }
  }),
    (store.logout = function () {
      try {
        pb.authStore.clear();
      } catch (error) {
        throw new Error(error);
      }
    });
};
export default authAPI;
