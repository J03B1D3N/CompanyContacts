import PocketBase from "../../node_modules/pocketbase/dist/pocketbase.es.mjs";

const pb = new PocketBase("https://companycontacts.fly.dev/");

function checkPermissions(demand) {
  if (pb.authStore.isValid) {
    if (pb.authStore.model.expand) {
      return pb.authStore.model.expand.permissions_id.hasOwnProperty(demand)
        ? pb.authStore.model.expand.permissions_id[demand]
        : false;
    }
  } else return false;
}

export { pb, checkPermissions };
