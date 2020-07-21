"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");
//process.env.PORT =  5000
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CONFLUX_URL: '"http://10.206.156.153:8080"',
  // ILOG_RULE_URL: '"http://aammidc01-test:8080/aamm"',
  ILOG_RULE_URL: '"http://localhost:8080/aamm"',

  EP_LOAD_TEMPLATE: '"/rules/template/view?projectId="',
  EP_LOAD_TEMPLATE_BY_ID: '"/rules/template/view?templateId="',
  EP_CREATE_TEMPLATE: '"/rules/template/create"',
  EP_UPDATE_TEMPLATE: '"/rules/template/update"',
  EP_DELETE_TEMPLATE: '"/rules/template/delete"',
  EP_LOAD_TEMP_ATTR: '"/rules/template/attributes/view"',
  EP_LOAD_TEMP_ATTR_INFO: '"/rules/template/attributeinfo/view?templateId="',

  EP_LOAD_DOMAIN: '"/DomainRules/loaddomain"',
  EP_CREATE_DOMAIN: '"/DomainRules/createdomain"',
  EP_UPDATE_DOMAIN: '"/DomainRules/updatedomain"',
  EP_DELETE_DOMAIN: '"/DomainRules/deletedomain"',

  EP_LOAD_PROJECT: '"/agruleproject/viewproject"',
  EP_CREATE_PROJECT: '"/agruleproject/createproject"',
  EP_UPDATE_PROJECT: '"/agruleproject/updateproject"',
  EP_DELETE_PROJECT: '"/agruleproject/deleteproject"',

  EP_CREATE_DEVICE_RULE: '"/AGRules/device/createrules"',
  EP_LOAD_DEVICE_RULE: '"/AGRules/device/loadrules"',
  EP_UPDATE_DEVICE_RULE: '"/AGRules/device/updaterules"',
  EP_DELETE_DEVICE_RULE: '"/AGRules/device/deleterules"',

  EP_CREATE_CIRCUIT_RULE: '"/AGRules/circuit/createrules"',
  EP_LOAD_CIRCUIT_RULE: '"/AGRules/circuit/viewrules"',
  EP_UPDATE_CIRCUIT_RULE: '"/AGRules/circuit/updaterules"',
  EP_DELETE_CIRCUIT_RULE: '"/AGRules/circuit/deleterules"',

  EP_CREATE_USER_ROLE: '"/userRole/createUserRole"',
  EP_LOAD_USER_ROLE: '"/userRole/loadUserRole"',
  EP_UPDATE_USER_ROLE: '"/userRole/updateUserRole"',
  EP_DELETE_USER_ROLE: '"/userRole/deleteUserRole"',

  EP_CREATE_TIME_RANGE: '"rules/timerange/create"',
  EP_UPDATE_TIME_RANGE: '"/rules/timerange/update"',
  EP_LOAD_TIME_RANGE: '"rules/timerange/view?ruleId="'
});
