import Vue from "vue";
import VueRouter from "vue-router";

import DomainNav from "../components/DomainNav.vue";
import Home from "../views/Home.vue";
import CreateDomain from "../views/CreateDomain.vue";
import CreateCircuit from "../views/CreateCircuit.vue";
import createProject from "../views/createProject.vue";
import CreateTemplate from "../views/CreateTemplate.vue";
import CreateDevice from "../views/CreateDevice.vue";

import EditDevice from "../views/EditDevice.vue";
import ViewTemplate from "../views/ViewTemplate.vue";
import EditProject from "../views/EditProject.vue";
import ProjectNav from "../components/ProjectNav.vue";
import CircuitNav from "../components/CircuitNav.vue";
import DeviceNav from "../components/DeviceNav.vue";
import TemplateNav from "../components/TemplateNav.vue";
import EditDomain from "../views/EditDomain.vue";
import EditCircuit from "../views/EditCircuit.vue";

import LoginPage from "../views/LoginPage.vue";
import UserRolePage from "../UserRoleTabs/UserRolePage.vue";
import EditUser from "../UserRoleTabs/EditUser.vue";
import CreateUser from "../UserRoleTabs/CreateUser.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginPage
  },
  {
    path: "/home",
    name: "home",
    component: Home
  },

  {
    redirect: "/edit",
    name: "domainrule",
    component: DomainNav,
    path: "/gotodomain",
    children: [
      {
        path: "/createdomain",
        name: "createdomain",
        component: CreateDomain
      },
      {
        path: "/edit",
        name: "editdomain",
        component: EditDomain
      }
    ]
  },
  {
    path: "/edit",
    name: "editdomain",
    component: EditDomain
  },
  {
    path: "/gotocircuit",
    name: "circuitrule",
    component: CircuitNav,
    redirect: "/editcircuit",
    children: [
      {
        path: "/editcircuit",
        name: "editcircuit",
        component: EditCircuit
      },
      {
        path: "/createcircuit",
        name: "createcircuit",
        component: CreateCircuit
      }
    ]
  },
  {
    path: "/editcircuit",
    name: "editcircuit",
    component: EditCircuit
  },
  {
    path: "/gotoproject",
    name: "projectrule",
    component: ProjectNav,
    redirect: "/editproject",
    children: [
      {
        path: "/editproject",
        name: "editproject",
        component: EditProject
      },
      {
        path: "/createProject",
        name: "createproject",
        component: createProject
      }
    ]
  },
  {
    path: "/editproject",
    name: "editproject",
    component: EditProject
  },

  {
    path: "/gotouserrole",
    name: "userrole",
    component: UserRolePage,
    redirect: "/edituser",
    children: [
      {
        path: "/edituser",
        name: "edituser",
        component: EditUser
      },
      {
        path: "/createuser",
        name: "createuser",
        component: CreateUser
      }
    ]
  },
  {
    path: "/edituser",
    name: "edituser",
    component: EditUser
  },

  {
    path: "/gotodevice",
    name: "devicerule",
    component: DeviceNav,
    redirect: "/editdevice",
    children: [
      {
        path: "/editdevice",
        name: "editdevice",
        component: EditDevice
      },
      {
        path: "/createdevice",
        name: "createdevice",
        component: CreateDevice
      }
    ]
  },
  {
    path: "/editdevice",
    name: "editdevice",
    component: EditDevice
  },
  {
    redirect: "/viewtemplate",
    name: "templaterule",
    component: TemplateNav,
    path: "/gototemplate",
    children: [
      {
        path: "/createtemplate",
        name: "createtemplate",
        component: CreateTemplate
      },
      {
        path: "/viewtemplate",
        name: "viewtemplate",
        component: ViewTemplate
      }
    ]
  },
  {
    path: "/viewtemplate",
    name: "template",
    component: ViewTemplate
  }
];

const router = new VueRouter({
  routes,
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active"
});

export default router;
