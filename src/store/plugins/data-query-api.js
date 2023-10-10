import { pb } from "../../lib/pocketbase.js";

let dataQueryApi = (store) => {
  (store.queryPaginatedData = async function (
    collection,
    page,
    perPage,
    filterParams
  ) {
    try {
      const resultList = await pb
        .collection(collection)
        .getList(page, perPage, filterParams);
      return resultList;
    } catch (error) {
      throw new Error(error);
    }
  }),
    (store.fetchFirstRecord = async function (collection, id, params) {
      try {
        const record = await pb
          .collection(collection)
          .getFirstListItem(`id="${id}"`, params);
        return record;
      } catch (error) {
        throw new Error(error);
      }
    }),
    (store.updateRecord = async function (collection, recordId, data) {
      try {
        const result = await pb
          .collection(collection)
          .update(`${recordId}`, data);
        return result;
      } catch (error) {
        throw new Error(error);
      }
    }),
    (store.deleteRecord = async function (collection, recordId) {
      try {
        const result = await pb.collection(collection).delete(`${recordId}`);
        return result;
      } catch (error) {
        throw new Error(error);
      }
    });

  store.createRecord = async function (collection, record) {
    try {
      const result = await pb.collection(collection).create(record);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  };
};
export default dataQueryApi;
