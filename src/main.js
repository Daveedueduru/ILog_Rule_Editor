// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import JwPagination from "jw-vue-pagination";
import * as SecureLS from "secure-ls";
import axios from "axios";
import VueAxios from "vue-axios";
import VueCookie from "vue-cookie"; // https://www.npmjs.com/package/vue-cookie
import VeeValidate from "vee-validate";
import Dialog from "vue-dialog-loading";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";

import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";

import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export let secretKey = "i!ogru!e";
export let secureLS = new SecureLS({
  encodingType: "aes",
  encryptionSecret: secretKey
});
export let userName = "userName";
export let confluxUrl = process.env.CONFLUX_URL;

export let epLoadTemplate = process.env.EP_LOAD_TEMPLATE;
export let epLoadTemplateById = process.env.EP_LOAD_TEMPLATE_BY_ID;
export let epCreateTemplate = process.env.EP_CREATE_TEMPLATE;
export let epUpdateTemplate = process.env.EP_UPDATE_TEMPLATE;
export let epDeleteTemplate = process.env.EP_DELETE_TEMPLATE;
export let epLoadTempAttr = process.env.EP_LOAD_TEMP_ATTR;
export let epLoadTempAttrInfo = process.env.EP_LOAD_TEMP_ATTR_INFO;

export let epCreateDeviceRule = process.env.EP_CREATE_DEVICE_RULE;
export let epLoadDeviceRule = process.env.EP_LOAD_DEVICE_RULE;
export let epUpdateDeviceRule = process.env.EP_UPDATE_DEVICE_RULE;
export let epDeleteDeviceRule = process.env.EP_DELETE_DEVICE_RULE;

export let epCreateCircuitRule = process.env.EP_CREATE_CIRCUIT_RULE;
export let epLoadCircuitRule = process.env.EP_LOAD_CIRCUIT_RULE;
export let epUpdateCircuitRule = process.env.EP_UPDATE_CIRCUIT_RULE;
export let epDeleteCircuitRule = process.env.EP_DELETE_CIRCUIT_RULE;

export let epLoadDomain = process.env.EP_LOAD_DOMAIN;
export let epCreateDomain = process.env.EP_CREATE_DOMAIN;
export let epUpdateDomain = process.env.EP_UPDATE_DOMAIN;
export let epDeleteDomain = process.env.EP_DELETE_DOMAIN;

export let epLoadProject = process.env.EP_LOAD_PROJECT;
export let epCreateProject = process.env.EP_CREATE_PROJECT;
export let epUpdateProject = process.env.EP_UPDATE_PROJECT;
export let epDeleteProject = process.env.EP_DELETE_PROJECT;

export let epCreateUserRole = process.env.EP_CREATE_USER_ROLE;
export let epLoadUserRole = process.env.EP_LOAD_USER_ROLE;
export let epUpdateUserRole = process.env.EP_UPDATE_USER_ROLE;
export let epDeleteUserRole = process.env.EP_DELETE_USER_ROLE;

export let epCreateTimeRange = process.env.EP_CREATE_TIME_RANGE;
export let epUpdateTimeRange = process.env.EP_UPDATE_TIME_RANGE;
export let epLoadTimeRange = process.env.EP_LOAD_TIME_RANGE;

export let tabFlag = 0;
export let admin = "ADMIN";
export let superUser = "SUPER USER";
export let normalUser = "NORMAL USER";
axios.defaults.baseURL = process.env.ILOG_RULE_URL; // Set the default base API url to whatever is in the config
axios.defaults.timeout = 100000;
//axios.defaults.headers.common['auth'] = null;
//axios_rule.defaults.headers.re
axios.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

Vue.use(VeeValidate);
Vue.use(VueCookie);
Vue.use(Dialog, {
  dialogBtnColor: "#0f0"
});
Vue.use(VueToast, {
  position: "top",
  duration: 5000
});

Vue.component("jw-pagination", JwPagination);

Vue.component("vue-timepicker", VueTimepicker);
Vue.component("date-picker", DatePicker);

//Timeselector
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
