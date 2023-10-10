import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import AdminLogin from "../views/AdminLogin.vue";
import ContactDetail from "../views/ContactDetail.vue";
import Companies from "../views/Companies.vue";
import NotFound from "../views/notFound.vue";
import { pb } from "../lib/pocketbase.js";
import Structure from "../views/Structure.vue";
import Accounts from "../views/AccountManagement.vue";
Vue.use(VueRouter);

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/login", name: "logIn", component: AdminLogin },
  {
    path: "/employeeDetail/:id",
    name: "contactDetail",
    component: ContactDetail,
  },
  {
    path: "/companies",
    name: "companies",
    component: Companies,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/structure",
    name: "structure",
    component: Structure,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/accounts",
    name: "accounts",
    component: Accounts,
    meta: {
      requiresAuth: true,
      requiresValidation: true,
    },
  },
  { path: "/*", name: "notFound", component: NotFound },
];

export const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.requiresValidation)) {
    if (pb.authStore.model) {
      if (pb.authStore.model.expand) {
        if (pb.authStore.model.expand.permissions_id.edit_permissions) {
          next();
        } else {
          next({ name: "home" });
        }
      } else {
        next({ name: "home" });
      }
    } else {
      next({ name: "home" });
    }
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (pb.authStore.isValid) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});
