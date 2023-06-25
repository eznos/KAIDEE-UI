import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login/login.vue";
import Register from "../views/register/Register.vue";
import Forgetpassword from "../views/forgetpassword/Forgetpass.vue";
import Forgetpassword_recoverycode from "../views/forgetpassword/Forgetpass_recovery.vue";
import Overviews from "../views/overview/Overviews.vue";
import Resident from "../views/table/Resident.vue";
import Electric from "../views/table/Electric.vue";
import Water from "../views/table/Water.vue";
import Edit_user from "../views/edituser/Edituser.vue";
import Building from "../views/table/Building.vue";
import Manage_user from "../views/table/Manageuser.vue";
import Maps from "../views/map/Map.vue";
import History from "../views/table/History.vue";
import History_user from "../views/table/History_Users.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/forgetpass",
    name: "Forgetpassword",
    component: Forgetpassword,
  },
  {
    path: "/recovery",
    name: "ForgetpasswordRecoverycode",
    component: Forgetpassword_recoverycode,
  },
  {
    path: "/overview",
    name: "overview",
    component: Overviews,
    meta: {
      requiresAuthAdmin: true,
    },
  },
  {
    path: "/residents",
    name: "resident",
    component: Resident,
    meta: {
      requiresAuthAdmin: true,
    },
  },
  {
    path: "/electricbill",
    name: "Electrics",
    component: Electric,
    meta: {
      requiresAuthAdmin: true,
    },
  },
  {
    path: "/waterbill",
    name: "Water",
    component: Water,
    meta: {
      requiresAuthAdmin: true,
    },
  },
  {
    path: "/edit",
    name: "Edituser",
    component: Edit_user,
    meta: {
      requiresAuthAdmin: true,
    },
  },
  {
    path: "/building",
    name: "Builing",
    component: Building,
    meta: {
      requiresAuthAdmin: true,
    },
  },
  {
    path: "/map",
    name: "Map",
    component: Maps,
    meta: {
      requiresAuthAdmin: true,
    },
  },
  {
    path: "/manageuser",
    name: "Manage_user",
    component: Manage_user,
    meta: {
      requiresAuthAdmin: true,
    },
  },
  {
    path: "/history",
    name: "History",
    component: History,
    meta: {
      requiresAuthAdmin: true,
    },
  },
  {
    path: "/historyUser",
    name: "History_user",
    component: History_user,
    meta: {
      requiresAuthAdmin: true,
    },
  },
  {
    // catch all 404 - define at the very end
    path: "*",
    component: () => import("../components/notFound/Notfound.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  let currentUser = localStorage.getItem("role");
  let requiresAuthAdmin = to.matched.some(
    (record) => record.meta.requiresAuthAdmin
  );
  if (requiresAuthAdmin && !currentUser) {
    next("/");
  } else if (requiresAuthAdmin) {
    if (currentUser) {
      if (currentUser.role === "admin") {
        next();
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
