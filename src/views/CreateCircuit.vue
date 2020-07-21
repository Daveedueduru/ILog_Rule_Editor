<template>
  <div id="app">
    <div class="formPositionList">
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" id="basic-addon1">Domain</label>
              </div>
              <input class="form-control" type="text" placeholder="Circuit" :readonly="true" />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">Project</label>
              </div>
              <select
                class="custom-select form-control"
                v-model="project"
                name="ProjectName"
                @change="fnFetchTemplateWithProjectId($event)"
                v-validate="'required'"
                :class="{
                  'is-invalid': formSubmitted && errors.has('ProjectName')
                }"
              >
                <option disabled value>-- Select --</option>
                <option
                  v-for="projects in projectEntity"
                  :key="projects.projectId"
                  :value="projects.projectId"
                >{{ projects.projectName }}</option>
              </select>
              <div
                v-if="formSubmitted && errors.has('ProjectName')"
                class="invalid-feedback"
              >{{ errors.first("ProjectName") }}</div>
              <div
                v-if="formSubmitted && errors.has('DomainName')"
                class="invalid-feedback"
              >{{ errors.first("DomainName") }}</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">Template</label>
              </div>
              <select
                class="custom-select form-control"
                v-model="template"
                name="TemplateName"
                @change="fnFetchTemplateWithTemplateId($event)"
                v-validate="'required'"
                :class="{
                  'is-invalid': formSubmitted && errors.has('TemplateName')
                }"
              >
                <option disabled value>-- Select --</option>
                <option
                  v-for="templates in templateEntities"
                  :key="templates.templateId"
                  :value="templates.templateId"
                >{{ templates.templateName }}</option>
              </select>
              <div
                v-if="formSubmitted && errors.has('TemplateName')"
                class="invalid-feedback"
              >{{ errors.first("TemplateName") }}</div>
              <div
                v-if="formSubmitted && errors.has('DomainName')"
                class="invalid-feedback"
              >{{ errors.first("DomainName") }}</div>
            </div>
          </div>
        </div>

        <div class="row" v-for="(temp, index) in tempAttrList" v-bind:key="index">
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" id="basic-addon1">
                  {{
                  temp.attrName
                  }}
                </label>
              </div>
              <input
                type="text"
                v-model="temp.attrValue"
                v-validate="'required'"
                :name="temp.attrName"
                class="form-control"
                :class="{
                  'is-invalid': formSubmitted && errors.has(temp.attrName)
                }"
              />
              <div
                v-if="formSubmitted && errors.has(temp.attrName)"
                class="invalid-feedback"
              >{{ errors.first(temp.attrName) }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">Eff.Start Time</label>
              </div>

              <date-picker
                :bootstrap-styling="true"
                placeholder="Select Date"
                v-model="effStart"
                format="DD-MM-YYYY"
                type="date"
                use-utc="true"
                class="startDate"
              ></date-picker>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">Eff.End Time</label>
              </div>

              <date-picker
                :bootstrap-styling="true"
                placeholder="Select Date"
                v-model="effEnd"
                format="DD-MM-YYYY"
                type="date"
                use-utc="true"
                class="endDate"
              ></date-picker>
            </div>
          </div>
        </div>

        <br />
        <div class="row">
          <div class="col-10">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" id="basic-addon1">
                  Active Time &nbsp;
                  <i class="fa fa-clock-o" aria-hidden="true"></i>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <table class="timePickerstyle">
              <thead>
                <tr>
                  <th>X</th>
                  <th>Start Time</th>
                  <th>End Time</th>

                  <th>S</th>
                  <th>M</th>
                  <th>T</th>
                  <th>W</th>
                  <th>T</th>
                  <th>F</th>
                  <th>S</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(timing, index) in timeList" :key="index">
                  <td>
                    <input type="checkbox" v-model="timing.excludeTime" style="cursor: pointer;" />
                  </td>
                  <td>
                    <vue-timepicker
                      input-width="80px"
                      format="HH:mm"
                      v-model="timing.timeModelFrom"
                      :minute-interval="1"
                    ></vue-timepicker>
                  </td>
                  <td>
                    <vue-timepicker
                      input-width="80px"
                      format="HH:mm"
                      v-model="timing.timeModelTo"
                      :minute-interval="1"
                    ></vue-timepicker>
                  </td>
                  <td>
                    <input type="checkbox" v-model="timing.sun" style="cursor: pointer;" />
                  </td>
                  <td>
                    <input type="checkbox" v-model="timing.mon" style="cursor: pointer;" />
                  </td>
                  <td>
                    <input type="checkbox" v-model="timing.tue" style="cursor: pointer;" />
                  </td>
                  <td>
                    <input type="checkbox" v-model="timing.wed" style="cursor: pointer;" />
                  </td>
                  <td>
                    <input type="checkbox" v-model="timing.thu" style="cursor: pointer;" />
                  </td>
                  <td>
                    <input type="checkbox" v-model="timing.fri" style="cursor: pointer;" />
                  </td>
                  <td>
                    <input type="checkbox" v-model="timing.sat" style="cursor: pointer;" />
                  </td>
                </tr>

                <tr class="alignLeft">
                  <td colspan="10">X : Exclude entry time</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-2 alignRight">
            <div class="form-group">
              <button class="btn btn-primary form-control">Save</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CircuitNav from "../components/CircuitNav";

import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";

import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

import {
  secureLS,
  epLoadTemplateById,
  epCreateCircuitRule,
  epCreateTimeRange,
  epLoadProject,
  epLoadTemplate,
  epLoadTempAttrInfo
} from "../main";
import mixin from "../mixins/Mixins";

export default {
  name: "App",
  mixins: [mixin],
  data() {
    return {
      timeList: [
        {
          excludeTime: "",
          timeModelFrom: {
            HH: "",
            mm: ""
          },
          timeModelTo: {
            HH: "",
            mm: ""
          },
          sun: "",
          mon: "",
          tue: "",
          wed: "",
          thu: "",
          fri: "",
          sat: ""
        }
      ],
      formSubmitted: false,
      projectEntity: null,
      templateEntities: null,
      templateList: null,
      //temp: null,
      tempAttrList: [],
      vm_attr: {},
      domain: "",
      template: "",
      project: "",
      createdBy: "",
      attrList: [],
      updatedBy: "",
      array: {},
      submitted: false,
      templateAttrInfo: [],
      formSubmitted: false,
      //date: new Date(),
      validFlag: true,
      selectedWeekDays: [],
      createTimeArray: [],
      timeArray: [],
      arrShiftGap: [],
      mainTimeArray: [],
      createArray: [],
      apiReq: [],
      effStart: "",
      effEnd: "",
      tmRangeFlag: 1,
      endTime: 0,
      shiftCount: 0,
      shiftCountTemp: 0
    };
  },
  components: {
    DatePicker
  },
  mounted() {
    this.fnFetchProject();

    if (this.timeList.length > 0) this.dynamicTimeRangeModel();
  },
  methods: {
    fnFetchTemplateWithTemplateId(event) {
      this.$loading.show({ delay: 0 });
      this.fnClearAttributes();
      axios.get(epLoadTemplateById + event.target.value).then(
        response => {
          this.templateList = response.data.ruleTemplates;
          if (this.templateList.length > 0) {
            this.fnLaodTeampAttrInfo();
            this.$loading.hide();
          } else {
            this.$toast.error("No Template Found.");
            this.$loading.hide();
          }
        },
        error => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );
    },
    fnLaodTeampAttrInfo() {
      this.$loading.show({ delay: 0 });
      axios.get(epLoadTempAttrInfo + this.template).then(
        response => {
          this.templateAttrInfo = response.data.templateAttributeDtls;
          this.templateAttrInfo.forEach(element => {
            let obj = {
              attrName: element.templateAttributeName,
              attrValue: "",
              attrInfoId: element.templateInfoId,
              attrId: element.templateAttributeId,
              isAction: element.isAction,
              attrOrder: element.attributeOrder,
              attrJsonKey: element.jsonKey,
              attrIsSelect: element.isSelect
            };
            this.tempAttrList.push(obj);
          });
          this.$loading.hide();
        },
        error => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );
    },
    fnCreateCircuitRule() {
      console.log("in");

      this.$loading.show({ delay: 0 });
      console.log("passed");

      this.circuitRuleArr = [];
      this.circuitRuleReq = [];
      this.tmRangeFlag = 1;
      let x = true;
      let flag = this.datePickerValidation();
      if (flag == false) {
        return flag;
      }
      let circuitRuleArr = {
        isActive: "Y",
        projectId: this.project,
        templateId: this.template,
        createdBy: secureLS.get("cuid"),
        updatedBy: secureLS.get("cuid"),
        effStartTime: this.effStart,
        effEndTime: this.effEnd
      };

      Array.from(this.tempAttrList).forEach(obj => {
        if (
          obj.attrJsonKey == "clearTime" ||
          obj.attrJsonKey == "networkId" ||
          obj.attrJsonKey == "priority" ||
          obj.attrJsonKey == "severity" ||
          obj.attrJsonKey == "frequencyCount" ||
          obj.attrJsonKey == "frequencyTime"
        ) {
          x = this.fnCheckNumeric(obj.attrValue, obj.attrName);
          if (x == false) {
            this.validFlag = false;
          }
        }

        circuitRuleArr[obj.attrJsonKey] = obj.attrValue;
      });

      if (!this.validFlag) {
        this.$loading.hide();
        this.validFlag = true;
        return false;
      } else {
        this.createTimeRange("");
        if (this.tmRangeFlag == 0) {
          this.$toast.error(this.errTmRngMsg);
          return false;
        }
        let circuitRuleReq = [];
        circuitRuleReq.push(circuitRuleArr);
        let rule_ids = [];

        axios
          .post(epCreateCircuitRule, circuitRuleReq)
          .then(
            data => {
              if (data.data.statusCode == 200) {
                rule_ids = data.data.ruleId;
                if (this.apiReq.length == 0) {
                  this.$toast.error("Kindly provide Active Time");

                  return false;
                }
                if (this.tmRangeFlag == 1) {
                  this.setRuleIdForEffTime(rule_ids[0].value);
                }
              } else {
                this.$loading.hide();
                this.$toast.error("Failed to create rule.");
              }
            },
            error => {
              this.$toast.error("Unable to create rule.");
              this.$loading.hide();
            }
          )
          .catch(data => {});
      }
    },
    createTimeRange() {
      this.$loading.hide();
      this.apiReq = [];
      this.endTime = 0;
      this.shiftCountTemp = this.shiftCount = 0;
      this.timeList.forEach(element => {
        this.shiftCountTemp = this.shiftCount;

        if (
          (element.sun == true && element.excludeTime != true) ||
          (element.sun != true && element.excludeTime == true)
        ) {
          this.createTimeRangeRequest(0, element);
        }
        if (
          (element.mon == true && element.excludeTime != true) ||
          (element.mon != true && element.excludeTime == true)
        ) {
          this.createTimeRangeRequest(1, element);
        }
        if (
          (element.tue == true && element.excludeTime != true) ||
          (element.tue != true && element.excludeTime == true)
        ) {
          this.createTimeRangeRequest(2, element);
        }
        if (
          (element.wed == true && element.excludeTime != true) ||
          (element.wed != true && element.excludeTime == true)
        ) {
          this.createTimeRangeRequest(3, element);
        }
        if (
          (element.thu == true && element.excludeTime != true) ||
          (element.thu != true && element.excludeTime == true)
        ) {
          this.createTimeRangeRequest(4, element);
        }
        if (
          (element.fri == true && element.excludeTime != true) ||
          (element.fri != true && element.excludeTime == true)
        ) {
          this.createTimeRangeRequest(5, element);
        }
        if (
          (element.sat == true && element.excludeTime != true) ||
          (element.sat != true && element.excludeTime == true)
        ) {
          this.createTimeRangeRequest(6, element);
        }
      });

      //--------------------------------------------------
    },
    createTimeRangeRequest(dayNum, element) {
      if (
        element.timeModelFrom.HH == "" ||
        element.timeModelTo.HH == "" ||
        element.timeModelFrom.mm == "" ||
        element.timeModelTo.mm == "" ||
        element.timeModelFrom == null ||
        element.timeModelTo == null
      ) {
        this.errTmRngMsg = "Kindly provide Active Time For Day selected";
        this.tmRangeFlag = 0;
      } else {
        var fromTimeinH = Number.parseInt(element.timeModelFrom.HH);
        var fromTimeinM = Number.parseInt(element.timeModelFrom.mm);
        var min_fromTime = fromTimeinH * 60 + fromTimeinM;

        var toTimeinH = Number.parseInt(element.timeModelTo.HH);
        var toTimeinM = Number.parseInt(element.timeModelTo.mm);
        var min_toTime = toTimeinH * 60 + toTimeinM;

        let start_time = dayNum * 1440 + min_fromTime;
        let end_time = dayNum * 1440 + min_toTime;

        if (start_time >= end_time) {
          this.errTmRngMsg = "Active StartTime cannot be greater than EndTime.";
          this.tmRangeFlag = 0;
        }
        ++this.shiftCount;
        if (this.endTime == 0 || this.endTime < start_time) {
          this.endTime = end_time;
          console.log("if: " + start_time + "|" + this.endTime);
        } else if (this.shiftCountTemp != this.shiftCount) {
          console.log("else: " + start_time + "|" + this.endTime);
          this.errTmRngMsg = "Shifts are overlapping";
          this.tmRangeFlag = 0;
        }

        let obj = {
          ruleId: "",
          startTime: start_time,
          endTime: end_time
        };
        this.apiReq.push(obj);
      }
    },
    setRuleIdForEffTime(ruleId) {
      this.apiReq.forEach(element => {
        element.ruleId = ruleId;
      });
      console.log("FinalReq>>>>: " + JSON.stringify(this.apiReq));
      axios
        .post(epCreateTimeRange, this.apiReq)
        .then(
          data => {
            if (data.data.statusCode == 200) {
              this.$toast.open("Circuit Rule Created Successfully.");
              this.formSubmitted = false;
              this.tempAttrList = [];
              this.setDefault();
              this.$loading.hide();
            } else {
              this.$loading.hide();
              this.$toast.error("Failed to set active time");
            }
          },
          error => {
            this.$toast.error("Unable to set active time.");
            this.$loading.hide();
          }
        )
        .catch(data => {});
    },

    dynamicTimeRangeModel() {
      var i;

      for (i = 0; i < 4; i++) {
        let obj = {
          excludeTime: "",
          timeModelFrom: {
            HH: "",
            mm: ""
          },
          timeModelTo: {
            HH: "",
            mm: ""
          },
          sun: "",
          mon: "",
          tue: "",
          wed: "",
          thu: "",
          fri: "",
          sat: ""
        };

        this.timeList.push(obj);
      }
    },
    fnFetchProject() {
      this.$loading.show({ delay: 0 });
      this.fnClearProject();
      var url_project = epLoadProject + "?domainId=22";
      axios.get(url_project).then(
        response => {
          this.projectEntity = response.data.agRuleProjectEntity;
          this.$loading.hide();
        },
        error => {
          this.$toast.error("Something went wrong.Please contact admin");
          this.$loading.hide();
        }
      );
    },

    fnFetchTemplateWithProjectId(event) {
      this.$loading.show({ delay: 0 });
      this.fnClearTemplate();
      var url_template = epLoadTemplate + event.target.value;

      axios.get(url_template).then(
        response => {
          this.templateEntities = response.data.ruleTemplates;
          this.$loading.hide();
        },
        error => {
          this.$toast.error("Something went wrong. Please contact admin");
          this.$loading.hide();
        }
      );
    },
    fnClearProject() {
      this.project = "";
      this.projectEntity = [];
      this.fnClearTemplate();
    },
    fnClearTemplate() {
      this.template = "";
      this.templateEntities = [];
      this.fnClearAttributes();
    },
    fnClearAttributes() {
      this.tempAttrList = [];
    },
    setDefault() {
      this.domain = "";
      this.project = "";
      this.template = "";
      this.effStart = "";
      this.effEnd = "";
      //this.clearTimeList();
    },
    handleSubmit(e) {
      this.formSubmitted = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          this.fnCreateCircuitRule();
        }
      });
    },
    datePickerValidation() {
      if (this.effStart == "" && this.effEnd == "") {
        this.$toast.error("Select Start Date and End Date");
        return false;
      } else if (this.effStart > this.effEnd) {
        this.$toast.error("Start Date must be less than End Date");
        return false;
      }
      return true;
    },
    clearTimeList() {
      this.timeList.forEach(element => {
        (element.excludeTime = ""),
          (element.timeModelFrom.HH = ""),
          (element.timeModelTo.HH = ""),
          (element.timeModelFrom.mm = ""),
          (element.timeModelTo.mm = ""),
          (element.sun = ""),
          (element.mon = ""),
          (element.tue = ""),
          (element.wed = ""),
          (element.thu = ""),
          (element.fri = ""),
          (element.sat = "");
      });
    }
  },

  components: {
    CircuitNav
  }
};
</script>

<style scoped>
@import "../assets/navstyle.css";

.dynamicFormPosition {
  position: absolute;
  top: -100px;
  left: -340px;
  height: 300px;
  width: 300px;
}

.dropdowndom {
  position: absolute;
  top: 2px;
  left: 200px;
  width: 300px;
  height: 45px;
}
.form-control:focus {
  border-color: #ff80ff;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.075) inset,
    0px 0px 8px rgba(255, 100, 255, 0.5);
}
.timePickerstyle {
  border-collapse: separate;
  border-spacing: 10px 0;
}
.timePickerstyle th {
  height: 40px;
  vertical-align: middle;
}
.endDate,
.startDate {
  width: 280px;
}
</style>
