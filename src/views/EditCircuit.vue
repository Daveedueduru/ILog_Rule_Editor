<template>
  <div>
    <div class="formPositionList">
      <div class="row">
        <div class="col-3">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" id="basic-addon1">Domain</label>
            </div>
            <input class="form-control" type="text" placeholder="Circuit" :readonly="disableFlag" />
          </div>
        </div>

        <div class="col-3">
          <div class="input-group">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Project</label>
            </div>
            <select
              class="custom-select"
              v-model="project"
              @change="fnFetchTemplateWithProjectId($event)"
            >
              <option disabled value>-- Select --</option>

              <option
                v-for="projects in projectList"
                :key="projects.projectId"
                :value="projects.projectId"
              >{{ projects.projectName }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          <div class="input-group">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Template</label>
            </div>
            <select class="custom-select" v-model="template" @change="fnFilterCircuit()">
              <option disabled value>-- Select --</option>
              <option
                v-for="templates in templateEntities"
                :key="templates.templateId"
                :value="templates.templateId"
              >{{ templates.templateName }}</option>
            </select>
          </div>
        </div>

        <div class="col-3">
          <div class="input-group">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Columns</label>
            </div>
            <select class="custom-select" @change="addHeader($event)">
              <option value>-- Select --</option>
              <option
                v-for="templates in extratemplateAttrInfo"
                :key="templates.templateAttributeId"
                :value="templates.templateAttributeId"
              >{{ templates.templateAttributeName }}</option>
            </select>
          </div>
        </div>
        <div class="col-2">
          <div class="form-group">
            <button class="btn btn-info form-control" @click="fnReSetTabHeader()">Reset</button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-10">
          <table class="table table-hover" id="tableHeaderCRule" v-if="showTable">
            <thead class="thead-dark">
              <tr>
                <th
                  v-for="attrInfo in templateAttrInfo"
                  v-bind:key="attrInfo.templateAttributeId"
                >{{ attrInfo.templateAttributeName }}</th>
                <th>View Details</th>
                <th v-if="userRole == adminLocal || userRole == superUserLocal">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="circuit in pageOfItems" v-bind:key="circuit.ruleId">
                <td
                  v-for="attrInfo in templateAttrInfo"
                  v-bind:key="attrInfo.templateAttributeId"
                >{{ circuit[attrInfo.jsonKey] }}</td>
                <td>
                  <div class="view">
                    <i
                      class="fa fa-file-text-o"
                      style="font-size:24px;color:blue;cursor:pointer;"
                      data-toggle="modal"
                      data-target="#exampleModal"
                      @click="fnLaodTeampAttrInfo(circuit.ruleId)"
                    ></i>
                  </div>
                </td>
                <td v-if="userRole == adminLocal || userRole == superUserLocal">
                  <div class="view">
                    <input
                      type="checkbox"
                      style="cursor:pointer;"
                      @click="addDeleteCircuitIndex($event, circuit.ruleId)"
                      :checked="deleteCircuitIdArr.includes(circuit.ruleId)"
                    />
                  </div>
                </td>
              </tr>
              <tr id="list-wrapper" v-if="deleteCircuitIdArr.length > 0">
                <div class="col-12" style="cursor:pointer;left:835px;">
                  <input
                    type="button"
                    value="Delete"
                    class="btn btn-danger"
                    @click="deleteCircuit()"
                  />
                </div>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-9">
          <jw-pagination
            :items="circuitList"
            :pageSize="pgSize"
            :initialPage="intPage"
            @changePage="onChangePage"
          ></jw-pagination>
        </div>
      </div>
      <!--Modal For Edit Circuit Start-->
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content modalArea">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Circuit Details</h5>
              <div class="modaleditpos">
                <i
                  v-if="userRole == adminLocal || userRole == superUserLocal"
                  class="fa fa-edit"
                  title="edit"
                  style="font-size:22px;color:green;cursor:pointer;"
                  @click="setFlagEnable"
                ></i>
              </div>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div style="overflow:scroll;" class="modal-body">
              <!-- Device Template Design Start-->
              <!-- <div v-for="(value,key,index) in deviceListEntity" :key="index">{{key}}:{{value}}</div> -->

              <form @submit.prevent="handleSubmit" class="EditCircuitForm">
                <table class="alignLeft">
                  <tr class="form-group">
                    <td>
                      <label for="TemplateName" class="strong">Domain:</label>
                    </td>
                    <td>
                      <label for="TemplateName">Circuit</label>
                    </td>
                  </tr>
                  <tr class="form-group">
                    <td>
                      <label for="TemplateName" class="strong">Project:</label>
                    </td>
                    <td>
                      <label for="TemplateName">{{ projectName }}</label>
                    </td>
                  </tr>
                  <tr class="form-group">
                    <td>
                      <label for="TemplateName" class="strong">Template:</label>
                    </td>
                    <td>
                      <label for="TemplateName">{{ selectedTemplateName }}</label>
                    </td>
                  </tr>

                  <tr class="form-group" v-for="(temp, index) in tempAttrList" v-bind:key="index">
                    <td>
                      <label>{{ temp.attrName }}</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        v-model="temp.attrValue"
                        v-validate="'required'"
                        :readonly="disableFlag"
                        :name="temp.attrName"
                        class="form-control"
                        :class="{
                          'is-invalid':
                            formSubmitted && errors.has(temp.attrName)
                        }"
                      />
                      <div
                        v-if="formSubmitted && errors.has(temp.attrName)"
                        class="invalid-feedback"
                      >{{ errors.first(temp.attrName) }}</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label class="strong">Eff.Start Time:</label>
                    </td>
                    <td>
                      <label>
                        <date-picker
                          :bootstrap-styling="true"
                          placeholder="Select Date"
                          v-model="effStart"
                          format="DD-MM-YYYY"
                          type="date"
                          use-utc="true"
                          :disabled="disableFlag"
                        ></date-picker>
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label class="strong">Eff.End Time:</label>
                    </td>
                    <td>
                      <label>
                        <date-picker
                          :bootstrap-styling="true"
                          placeholder="Select Date"
                          v-model="effEnd"
                          format="DD-MM-YYYY"
                          type="date"
                          use-utc="true"
                          :disabled="disableFlag"
                        ></date-picker>
                      </label>
                    </td>
                  </tr>
                </table>

                <br />

                <table class="timePickerstyle">
                  <tr class="alignCenter">
                    <td colspan="10">
                      <h6>
                        Active&nbsp;Time&nbsp;
                        <i class="fa fa-clock-o" aria-hidden="true"></i>
                      </h6>
                    </td>
                  </tr>
                  <tr class="alignLeft">
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

                  <tr class="alignLeft" v-for="(timing, index) in timeList" :key="index">
                    <td>
                      <input
                        type="checkbox"
                        v-model="timing.excludeTime"
                        style="cursor: pointer;"
                        :disabled="disableFlag"
                      />
                    </td>
                    <td>
                      <vue-timepicker
                        input-width="80px"
                        format="HH:mm"
                        v-model="timing.startTime"
                        :minute-interval="1"
                        :disabled="disableFlag"
                      ></vue-timepicker>
                    </td>
                    <td>
                      <vue-timepicker
                        input-width="80px"
                        format="HH:mm"
                        v-model="timing.endTime"
                        :minute-interval="1"
                        :disabled="disableFlag"
                      ></vue-timepicker>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        v-model="timing.sun"
                        style="cursor: pointer;"
                        :disabled="disableFlag"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        v-model="timing.mon"
                        style="cursor: pointer;"
                        :disabled="disableFlag"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        v-model="timing.tue"
                        style="cursor: pointer;"
                        :disabled="disableFlag"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        v-model="timing.wed"
                        style="cursor: pointer;"
                        :disabled="disableFlag"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        v-model="timing.thu"
                        style="cursor: pointer;"
                        :disabled="disableFlag"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        v-model="timing.fri"
                        style="cursor: pointer;"
                        :disabled="disableFlag"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        v-model="timing.sat"
                        style="cursor: pointer;"
                        :disabled="disableFlag"
                      />
                    </td>
                  </tr>
                  <tr class="alignLeft">
                    <td colspan="10">X : Exclude entry time</td>
                  </tr>
                  <br />
                  <tr class="form-group">
                    <td
                      v-if="
                        userRole == adminLocal || userRole == superUserLocal
                      "
                      class="alignCenter"
                      colspan="2"
                    >
                      <button class="btn btn-primary" :disabled="disableFlag">Save</button>
                    </td>
                  </tr>
                </table>
              </form>
              <!-- Device Template Design End-->
            </div>
          </div>
        </div>
      </div>
      <!--Modal For Edit Circuit End-->
    </div>
  </div>
</template>

<script>
import CircuitNav from "../components/CircuitNav";
import "font-awesome/css/font-awesome.css";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import axios from "axios";
import {
  secureLS,
  epLoadDomain,
  epLoadProject,
  epLoadTempAttrInfo,
  epLoadTemplate,
  epLoadCircuitRule,
  epDeleteCircuitRule,
  epUpdateCircuitRule,
  admin,
  superUser,
  epLoadTimeRange,
  epUpdateTimeRange,
} from "../main";
import mixin from "../mixins/Mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      timeList: [],
      adminLocal: admin,
      superUserLocal: superUser,
      userRole: secureLS.get("userRole"),
      domainList: null,
      projectList: null,
      templateEntities: null,
      circuitList: [],
      circuitListEntity: [],
      domain: "",
      project: "",
      template: "",
      pageOfItems: [],
      intPage: 1,
      pgSize: 5,
      disableFlag: true,
      deleteCircuitIdArr: [],
      deleteRecordArr: [],
      isActive: "",
      templateAttrInfo: [],
      tempAttrList: [],
      selectedRule: [],
      validFlag: true,
      selectedRuleId: null,
      selectedTemplateName: null,
      domainName: null,
      projectName: null,
      formSubmitted: false,
      maintemplateAttrInfo: [],
      extratemplateAttrInfo: [],
      showTable: false,
      //pagignationCnt: 0,
      date: new Date(),
      timeRangeDetails: [],
      testTime: "02:30",
      effStart: "",
      effEnd: "",
      tmRangeFlag: 1,
      shiftCountTemp: 0,
      shiftCount: 0,
      endTime: 0,
    };
  },
  components: {
    CircuitNav,
  },
  mounted() {
    this.domain = "";
    this.project = "";
    this.fnFilterProject();
    if (this.timeList.length > 0) this.dynamicTimeRangeModel();
  },

  methods: {
    onChangePage(pageOfItems) {
      this.pageOfItems = pageOfItems;
    },

    fnFilterProject() {
      this.$loading.show({ delay: 0 });
      this.project = "";
      this.circuitList = [];
      var url_project = epLoadProject + "?domainId=22";
      axios.get(url_project).then(
        (response) => {
          this.projectList = response.data.agRuleProjectEntity;
          this.$loading.hide();
        },
        (error) => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );
    },
    fnFetchTemplateWithProjectId(event) {
      this.$loading.show({ delay: 0 });
      this.showTable = false;
      this.template = "";
      this.circuitList = [];
      var url_template = epLoadTemplate + event.target.value;
      axios.get(url_template).then(
        (response) => {
          this.templateEntities = response.data.ruleTemplates;
          this.$loading.hide();
        },
        (error) => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );
    },
    fnFilterCircuit() {
      this.$loading.show({ delay: 0 });
      this.showTable = false;
      axios.get(epLoadTempAttrInfo + this.template).then((response) => {
        this.maintemplateAttrInfo = response.data.templateAttributeDtls;
        this.extratemplateAttrInfo = this.maintemplateAttrInfo.filter(
          (word, key) => key > 4
        );
        this.templateAttrInfo = this.maintemplateAttrInfo.filter(
          (word, key) => key < 5
        );
        this.deleteCircuitIdArr = [];
        this.circuitList = [];
        axios.get(epLoadCircuitRule + "?templateId=" + this.template).then(
          (response) => {
            let dataArr = response.data.circuitRuleInfoEntity;

            if (dataArr.length > 0) {
              dataArr.forEach((val) => {
                let obj = {};
                this.maintemplateAttrInfo.forEach((element) => {
                  obj[element.jsonKey] = val[element.jsonKey];
                });
                obj["ruleId"] = val.ruleId;
                obj["projectId"] = val.projectId;
                obj["effStartTime"] = val.effStartTime;
                obj["effEndTime"] = val.effEndTime;
                this.circuitList.push(obj);
              });

              this.showTable = true;
              this.$loading.hide();
            } else {
              this.showTable = false;
              this.extratemplateAttrInfo = [];
              this.$loading.hide();
              this.$toast.error("No data found");
            }
            this.$loading.hide();
          },
          (error) => {
            this.$toast.error("Something went wrong. Please contact Admin.");
            this.$loading.hide();
          }
        );
      });
    },
    // openDeviceModal() {},

    setFlagEnable() {
      this.disableFlag = false;
    },
    setFlagDisable() {
      this.disableFlag = true;
    },
    deleteCircuit: function (event) {
      this.deleteRecordArr = [];
      this.$loading.show({ delay: 0 });
      this.deleteCircuitIdArr.forEach((val) => {
        let circuitData = this.circuitList.find((i) => i.ruleId == val);

        circuitData.updatedBy = secureLS.get("cuid");

        circuitData.effStartTime = this.effStart;
        circuitData.effEndTime = this.effEnd;
        this.deleteRecordArr.push(circuitData);
      });

      console.log(this.deleteRecordArr);
      axios
        .delete(epDeleteCircuitRule, {
          data: this.deleteRecordArr,
        })
        .then(
          (data) => {
            if (data.data.statusCode == 200) {
              this.$toast.open("Circuit Rule Deleted Successfully");
              this.fnFilterCircuit();
              this.$loading.hide();
            } else {
              this.$toast.error("Failed to Delete");
              this.$loading.hide();
            }
          },
          (error) => {
            this.$toast.error("Circuit delete failed.");
            this.$loading.hide();
          }
        )
        .catch(function (error) {
          this.$loading.hide();
        });
    },
    addDeleteCircuitIndex: function (event, ruleId) {
      if (event.target.checked) {
        if (!this.deleteCircuitIdArr.includes(ruleId)) {
          this.deleteCircuitIdArr.push(ruleId);
        }
      } else {
        this.deleteCircuitIdArr.splice(
          this.deleteCircuitIdArr.indexOf(ruleId),
          1
        );
      }
    },
    fnLaodTeampAttrInfo(circuitRuleId) {
      this.setFlagDisable();
      let projectObj = this.projectList.find(
        (i) => i.projectId == this.project
      );
      this.projectName = projectObj.projectName;
      this.tempAttrList = [];
      this.selectedRule = this.circuitList.find(
        (i) => i.ruleId == circuitRuleId
      );
      if (
        this.selectedRule.effStartTime != undefined &&
        this.selectedRule.effStartTime != ""
      ) {
        var startDt = this.selectedRule.effStartTime.split("-"); //2020-06-25
        this.effStart = new Date(
          startDt[1] + "/" + startDt[2] + "/" + startDt[0]
        );
      }
      if (
        this.selectedRule.effEndTime != undefined &&
        this.selectedRule.effEndTime != ""
      ) {
        var endDt = this.selectedRule.effEndTime.split("-"); //2020-06-25
        this.effEnd = new Date(endDt[1] + "/" + endDt[2] + "/" + endDt[0]);
      }

      this.selectedRuleId = circuitRuleId;

      this.maintemplateAttrInfo.forEach((element) => {
        let obj = {};
        if (this.selectedRule[element.jsonKey]) {
          obj["attrName"] = element.templateAttributeName;
          obj["attrInfoId"] = element.templateAttributeId;
          obj["attrId"] = element.templateAttributeId;
          obj["isAction"] = element.isAction;
          obj["attrOrder"] = element.attributeOrder;
          obj["attrJsonKey"] = element.jsonKey;
          obj["attrIsSelect"] = element.isSelect;
          obj["attrValue"] = this.selectedRule[element.jsonKey];
          if (!this.selectedTemplateName) {
            this.selectedTemplateName = element.templateName;
          }

          this.tempAttrList.push(obj);
        }
      });
      axios.get(epLoadTimeRange + circuitRuleId).then((response) => {
        this.timeList = response.data.ruleTimeRangeList;

        this.timeList.forEach((item) => {
          let shour = (item.startTime / 60).toFixed(0);
          let smin = (item.startTime % 60).toFixed(0);
          if (shour < 10) {
            shour = "0" + shour;
          }
          if (smin < 10) {
            smin = "0" + smin;
          }
          let ehour = (item.endTime / 60).toFixed(0);
          let emin = (item.endTime % 60).toFixed(0);
          if (ehour < 10) {
            ehour = "0" + ehour;
          }
          if (emin < 10) {
            emin = "0" + emin;
          }
          item.startTime = {
            HH: shour,
            mm: smin,
          };
          item.endTime = {
            HH: ehour,
            mm: emin,
          };
        });

        let len = 5 - this.timeList.length;
        for (let k = 0; k < len; k++) {
          let item = {
            excludeTime: false,
            startTime: null,
            endTime: null,
            sun: false,
            mon: false,
            tue: false,
            wed: false,
            thu: false,
            fri: false,
            sat: false,
          };
          this.timeList.push(item);
        }

        this.$loading.hide();
      });
      //this.timeRangeDetails.forEach(element => {});
    },

    dynamicTimeRangeModel() {
      var i;

      for (i = 0; i < 4; i++) {
        let obj = {
          excludeTime: false,
          startTime: { HH: "", mm: "" },
          endTime: { HH: "", mm: "" },
          sun: false,
          mon: false,
          tue: false,
          wed: false,
          thu: false,
          fri: false,
          sat: false,
        };

        this.timeList.push(obj);
      }
    },

    fnUpdateCircuitRule() {
      this.$loading.show({ delay: 0 });
      this.circuitRuleReq = [];
      //this.tmRangeFlag = 1;
      let x = true;
      let flag = this.datePickerValidation();
      if (flag == false) {
        this.$loading.hide();
        return flag;
      }
      let circuitRuleArr = {
        isActive: "Y",
        projectId: this.project,
        templateId: this.template,
        ruleId: this.selectedRuleId,
        createdBy: secureLS.get("cuid"),
        updatedBy: secureLS.get("cuid"),
        effStartTime: this.effStart,
        effEndTime: this.effEnd,
      };
      Array.from(this.tempAttrList).forEach((obj) => {
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
        this.updateTimeRange();
        if (this.tmRangeFlag == 0) {
          this.$toast.error(this.errTmRngMsg);
          return false;
        }
        let circuitRuleReq = [];
        circuitRuleReq.push(circuitRuleArr);

        axios
          .put(epUpdateCircuitRule, circuitRuleReq)
          .then(
            (data) => {
              if (data.data.statusCode == 200) {
                if (this.apiReq.length == 0) {
                  this.$toast.error("Kindly provide Active Time");
                  this.$loading.hide();
                  return false;
                }
                if (this.tmRangeFlag == 1) {
                  this.setRuleIdForEffTime(this.selectedRuleId);
                }
                this.$loading.hide();
              } else {
                this.$toast.error("Failed to Update.");
                this.$loading.hide();
              }
            },
            (error) => {
              this.$toast.error("Something went wrong. Please contact Admin.");
              this.$loading.hide();
            }
          )
          .catch((data) => {});
      }
    },
    updateTimeRange() {
      this.$loading.hide();
      this.apiReq = [];
      this.endTime = 0;
      this.shiftCountTemp = this.shiftCount = 0;
      this.timeList.forEach((element) => {
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
    },
    createTimeRangeRequest(dayNum, element) {
      if (
        element.startTime == null ||
        element.endTime == null ||
        element.startTime.HH == "" ||
        element.endTime.HH == "" ||
        element.startTime.mm == "" ||
        element.endTime.mm == ""
      ) {
        this.errTmRngMsg = "Kindly provide Active Time For Day selected";
        this.tmRangeFlag = 0;
      } else {
        var fromTimeinH = Number.parseInt(element.startTime.HH);
        var fromTimeinM = Number.parseInt(element.startTime.mm);
        var min_fromTime = fromTimeinH * 60 + fromTimeinM;

        var toTimeinH = Number.parseInt(element.endTime.HH);
        var toTimeinM = Number.parseInt(element.endTime.mm);
        var min_toTime = toTimeinH * 60 + toTimeinM;

        let start_time = dayNum * 1440 + min_fromTime;
        let end_time = dayNum * 1440 + min_toTime;
        if (start_time >= end_time) {
          this.errTmRngMsg = "Active StartTime cannot be greater than EndTime.";
          this.tmRangeFlag = 0;
        }
        ++this.shiftCount;
        console.log(
          "Before else: " + this.shiftCountTemp + "|" + this.shiftCount
        );
        if (this.endTime == 0 || this.endTime < start_time) {
          this.endTime = end_time;
          console.log("if: " + start_time + "|" + this.endTime);
        } else if (
          this.shiftCountTemp != this.shiftCount &&
          this.endTime < this.end_time
        ) {
          console.log("else: " + this.shiftCountTemp + "|" + this.shiftCount);
          this.errTmRngMsg = "Shifts are overlapping";
          this.tmRangeFlag = 0;
        }

        let obj = {
          ruleId: "",
          startTime: start_time,
          endTime: end_time,
        };
        this.apiReq.push(obj);
      }
    },
    setRuleIdForEffTime(ruleId) {
      this.apiReq.forEach((element) => {
        element.ruleId = this.selectedRuleId;
      });
      //--------------------------------------------------
      console.log("FinalReq>>>>: " + JSON.stringify(this.apiReq));
      axios
        .put(epUpdateTimeRange, this.apiReq)
        .then(
          (data) => {
            if (data.data.statusCode == 200) {
              this.$loading.hide();
              this.$toast.open("Circuit Rule updated Successfully.");

              this.formSubmitted = false;
              this.tempAttrList = [];
              //this.setDefault();
              this.fnFilterCircuit();
              this.$loading.hide();
            } else {
              this.$loading.hide();
              this.$toast.error("Failed to set active time");
            }
          },
          (error) => {
            this.$toast.error("Unable to set active time.");
            this.$loading.hide();
          }
        )
        .catch((data) => {});
    },

    addHeader(event) {
      let nwhead = this.extratemplateAttrInfo.find(
        (word) => word.templateAttributeId == event.target.value
      );
      this.extratemplateAttrInfo = this.extratemplateAttrInfo.filter(function (
        el
      ) {
        return el.templateAttributeId != event.target.value;
      });
      this.templateAttrInfo.push(nwhead);
    },
    setTabHeader() {
      this.extratemplateAttrInfo = this.maintemplateAttrInfo.filter(
        (word, key) => key > 4
      );
      this.templateAttrInfo = this.maintemplateAttrInfo.filter(
        (word, key) => key < 5
      );
    },
    handleSubmit(e) {
      this.formSubmitted = true;
      this.$validator.validate().then((valid) => {
        if (valid) {
          this.fnUpdateCircuitRule();
        }
      });
    },
    datePickerValidation() {
      if (
        this.effStart == "" ||
        this.effStart == null ||
        this.effEnd == "" ||
        this.effEnd == null
      ) {
        this.$toast.error("Select Effective Date.");
        return false;
      } else if (this.effStart > this.effEnd) {
        this.$toast.error("Start Date must be less than End Date");
        return false;
      }
      return true;
    },
  },
};
</script>
<style scoped>
@import "../assets/navstyle.css";
.modalArea {
  width: 650px;
  height: 570px;
  left: 10px;
}
.modaleditpos {
  position: absolute;
  left: 530px;
  top: 18px;
}
.EditCircuitForm {
  position: absolute;
  left: 100px;
}
.timePickerstyle {
  position: absolute;
  left: -10px;
  border-collapse: separate;
  border-spacing: 6px 0;
}
.timePickerstyle th {
  height: 40px;
  vertical-align: middle;
}
</style>
