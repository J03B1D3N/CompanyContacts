import Vue from "vue";
import App from "./App.vue";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import { router } from "./router/index";
import { store } from "./store/index";
import vueDebounce from "vue-debounce";

Vue.use(VueMaterial);
Vue.use(vueDebounce);
Vue.prototype.$CURRENT_URL = "https://companycontacts.fly.dev";

new Vue({
  router: router,
  store: store,
  render: (h) => h(App),
}).$mount("#app");
