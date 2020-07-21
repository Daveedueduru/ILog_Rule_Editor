<template>
  <div>
    <TemplateNav />
    <div class="formPositionList">
      <div class="row">
        <div class="col-3">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Domain</label>
            </div>
            <select class="custom-select" v-model="domain" @change="fnFilterProject($event)">
              <option disabled value>-- Select --</option>

              <option
                v-for="domains in domainList"
                :key="domains.domainId"
                :value="domains.domainId"
              >{{ domains.domainName }}</option>
            </select>
          </div>
        </div>
        <div class="col-3">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Project</label>
            </div>
            <select
              class="custom-select"
              v-model="project"
              @change="fnFilterTemplate(), fnLoadTempAttr()"
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

      <!--Template Table Start-->

      <div class="row">
        <div class="col-9">
          <table
            class="table table-hover"
            style=" word-wrap: break-word;table-layout: fixed;"
            v-if="showTable"
          >
            <thead class="thead-dark">
              <tr>
                <th>Template Name</th>
                <th>Template Description</th>
                <th>Created By</th>
                <th>Updated By</th>
                <th>View Details</th>
                <th v-if="userRole == adminLocal || userRole === superUserLocal">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tempObj in pageOfTemplates" v-bind:key="tempObj.templateId">
                <td>{{ tempObj.templateName }}</td>
                <td>{{ tempObj.templateDesc }}</td>
                <td>{{ tempObj.createdBy }}</td>
                <td>{{ tempObj.updatedBy }}</td>
                <td>
                  <div class="view">
                    <i
                      class="fa fa-file-text-o"
                      style="font-size:24px;color:blue;cursor:pointer;"
                      data-toggle="modal"
                      data-target="#exampleModal"
                      @click="setTempVal2Modal(tempObj.templateId)"
                    ></i>
                  </div>
                </td>
                <td v-if="userRole == adminLocal || userRole === superUserLocal">
                  <div class="view">
                    <input
                      type="checkbox"
                      style="cursor:pointer;"
                      @click="addDeleteTemplateIndex($event, tempObj.templateId)"
                      :checked="deleteTemplateIdArr.includes(tempObj.templateId)"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="5"></td>
                <td>
                  <div id="list-wrapper" v-if="deleteTemplateIdArr.length > 0">
                    <input
                      type="button"
                      value="Delete"
                      class="btn btn-danger"
                      @click="deleteTemplate()"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="row">
        <div class="col-9">
          <jw-pagination
            :items="templateList"
            :pageSize="pgSize"
            :initialPage="intPage"
            @changePage="onChangePage"
          ></jw-pagination>
        </div>
      </div>
    </div>

    <!-- Template Table End-->
    <!--Modal For Edit Template Start-->
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
            <h5 class="modal-title" id="exampleModalLabel">Template Details</h5>
            <div class="modaleditpos">
              <i
                v-if="userRole == adminLocal || userRole === superUserLocal"
                class="fa fa-edit"
                style="font-size:24px;color:green"
                title="edit"
                @click="setFlagEnable"
              ></i>
            </div>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- Template Design Start-->
            <form @submit.prevent="handleSubmit">
              <table class="tablefont">
                <tr class="form-group">
                  <td class="alignLeft">
                    <label for="TemplateName" class="strong">Template&nbsp;Name:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      v-model="templateName"
                      :readonly="disableFlag"
                      v-validate="'required'"
                      name="TemplateName"
                      class="form-control"
                      :class="{
                        'is-invalid':
                          formSubmitted && errors.has('TemplateName')
                      }"
                      @keypress="checkAlphaNumeric($event)"
                    />
                    <div
                      id="errmsgname"
                      v-if="formSubmitted && errors.has('TemplateName')"
                      class="invalid-feedback"
                    >{{ errors.first("TemplateName") }}</div>
                  </td>
                  <td colspan="2">&nbsp;&nbsp;</td>
                  <td class="alignLeft">
                    <label for="TemplateDesc" class="strong">Template&nbsp;Description:</label>
                  </td>
                  <td class="leftalign">
                    <input
                      type="text"
                      id="id_templateDesc"
                      v-model="templateDesc"
                      :readonly="disableFlag"
                      v-validate="'required'"
                      name="TemplateDesc"
                      class="form-control"
                      :class="{
                        'is-invalid':
                          formSubmitted && errors.has('TemplateDesc')
                      }"
                    />
                    <div
                      id="errmsgdesc"
                      v-if="formSubmitted && errors.has('TemplateDesc')"
                      class="invalid-feedback"
                    >{{ errors.first("TemplateDesc") }}</div>
                  </td>
                </tr>
                <tr>
                  <br />
                  <br />
                </tr>
                <tr>
                  <div class="centerheading">Validation&nbsp;Attributes</div>
                </tr>
                <tr class="form-group">
                  <td id="centeralign" colspan="2">
                    <select
                      id="validationbox1"
                      v-model="validTempAttrSource"
                      multiple="multiple"
                      :disabled="disableFlag"
                    >
                      <option
                        class="optionFont"
                        v-for="(tempAttr, index) in validAttrList"
                        v-bind:value="tempAttr.templateAttrId"
                        :key="index"
                      >{{ tempAttr.templateAttrName }}</option>
                    </select>
                  </td>
                  <td id="alignCenter" colspan="2">
                    <br />
                    <input
                      type="button"
                      value=">"
                      @click.prevent="addValidTempAttribute"
                      :disabled="isEnableValidAttrPush"
                    />
                    <br />
                    <input
                      type="button"
                      value="<"
                      @click.prevent="removeValidTempAttribute"
                      :disabled="isEnableValidAttrPop"
                    />
                  </td>
                  <td id="alignCenter" colspan="2">
                    <div class="box1">
                      <select
                        id="validationbox2"
                        v-model="validTempAttrDestination"
                        multiple="multiple"
                        :disabled="disableFlag"
                        v-validate="
                          selectedValidTempAttr.length > 0 ? false : 'required'
                        "
                        name="ValidationAttribute"
                        class="form-control"
                        :class="{
                          'is-invalid':
                            formSubmitted && errors.has('ValidationAttribute')
                        }"
                      >
                        <option
                          class="optionFont"
                          v-for="(tempAttr, index) in selectedValidTempAttr"
                          v-bind:value="tempAttr.templateAttrId"
                          :key="index"
                        >{{ tempAttr.templateAttrName }}</option>
                      </select>
                    </div>
                    <div
                      v-if="formSubmitted && errors.has('ValidationAttribute')"
                      class="invalid-feedback"
                    >{{ errors.first("ValidationAttribute") }}</div>
                  </td>
                </tr>
                <tr>
                  <br />
                  <br />
                </tr>
                <tr>
                  <div class="centerheading">Action &nbsp;Attributes</div>
                </tr>
                <tr>
                  <td id="alignCenter" colspan="2">
                    <select
                      id="validationbox1"
                      v-model="actionTempAttrSource"
                      multiple="multiple"
                      :disabled="disableFlag"
                    >
                      <option
                        class="optionFont"
                        v-for="(actionY, index) in actionAttrList"
                        v-bind:value="actionY.templateAttrId"
                        :key="index"
                      >{{ actionY.templateAttrName }}</option>
                    </select>
                  </td>
                  <td id="alignCenter" colspan="2">
                    <input
                      type="button"
                      value=">"
                      @click.prevent="addActionTempAttribute"
                      :disabled="isEnableActionAttrPush"
                    />
                    <br />
                    <input
                      type="button"
                      value="<"
                      @click.prevent="removeActionTempAttribute"
                      :disabled="isEnableActionAttrPop"
                    />
                  </td>
                  <td id="alignCenter" colspan="2">
                    <div class="box2">
                      <select
                        id="validationbox2"
                        v-model="actionTempAttrDestination"
                        multiple="multiple"
                        :disabled="disableFlag"
                        v-validate="
                          selectedActionTempAttr.length > 0 ? false : 'required'
                        "
                        name="ActionAttribute"
                        class="form-control"
                        :class="{
                          'is-invalid':
                            formSubmitted && errors.has('ActionAttribute')
                        }"
                      >
                        <option
                          class="optionFont"
                          v-for="(action, index) in selectedActionTempAttr"
                          v-bind:value="action.templateAttrId"
                          :key="index"
                        >{{ action.templateAttrName }}</option>

                        <br />
                      </select>
                    </div>
                    <div
                      v-if="formSubmitted && errors.has('ActionAttribute')"
                      class="invalid-feedback"
                    >{{ errors.first("ActionAttribute") }}</div>
                  </td>
                </tr>
                <tr v-if="userRole == adminLocal || userRole === superUserLocal" class="form-group">
                  <button class="btn btn-primary" id="buttonpos" :disabled="disableFlag">Save</button>
                </tr>
              </table>
            </form>

            <!-- Template Design End-->
          </div>
          <!-- <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <div class="form-group">
              <button type="button" class="btn btn-primary" >Save</button>
            </div>
          </div>-->
        </div>
      </div>
    </div>
    <!--Modal For Edit Template End-->
  </div>
</template>

<script>
import TemplateNav from "../components/TemplateNav";
import axios from "axios";
import {
  secureLS,
  epLoadTemplate,
  epUpdateTemplate,
  epLoadTempAttr,
  epLoadDomain,
  epLoadProject,
  epDeleteTemplate,
  superUser,
  admin
} from "../main";
import mixin from "../mixins/Mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      adminLocal: admin,
      superUserLocal: superUser,
      userRole: secureLS.get("userRole"),
      seen: false,
      projectList: null,
      templateList: [],
      domainList: null,
      project: "",
      domain: "",
      showModal: false,
      templateName: null,
      templateDesc: null,
      templateAttrName: null,
      templateAttrId: null,
      templateAttrList: [],
      actionAttributes: [],
      selectedValidTempAttr: [],
      selectedActionTempAttr: [],
      validTempAttrSource: [],
      validTempAttrDestination: [],
      actionTempAttrSource: [],
      actionTempAttrDestination: [],
      actions: null,
      domain_value: "",
      project_value: "",
      actionAttrList: [],
      validAttrList: [],
      actionAttrListTemp: [],
      validAttrListTemp: [],
      validAttrLen: 0,
      actionAttrLen: 0,
      isEnableActionAttrPush: false,
      isEnableActionAttrPop: false,
      isEnableValidAttrPush: false,
      isEnableValidAttrPop: false,
      arrTemplateInfoMain: [],
      templateRequest: [],
      disableFlag: true,
      selProjectId: null,
      selTempId: null,
      pageOfTemplates: [],
      intPage: 1,
      pgSize: 5,
      cuid: "",
      updatedBy: "",
      deleteTemplateIdArr: [],
      deleteRecordArr: [],
      formSubmitted: false,
      showTable: false
    };
  },

  components: {
    TemplateNav
  },

  mounted() {
    this.domain = "";
    this.project = "";
    this.fnLoadDomain();
  },

  methods: {
    fnLoadDomain() {
      this.$loading.show({ delay: 0 });
      axios.get(epLoadDomain).then(
        response => {
          this.domainList = response.data.agDomainRuleEntity;
          this.$loading.hide();
        },
        error => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );
    },
    fnFilterProject(event) {
      this.$loading.show({ delay: 0 });
      this.project = "";
      this.templateList = [];
      var url_project = epLoadProject + "?domainId=" + event.target.value;
      axios.get(url_project).then(
        response => {
          this.projectList = response.data.agRuleProjectEntity;

          this.$loading.hide();
        },
        error => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );
    },

    fnFilterTemplate() {
      this.$loading.show({ delay: 0 });
      this.deleteTemplateIdArr = [];
      axios.get(epLoadTemplate + this.project).then(
        response => {
          this.templateList = response.data.ruleTemplates;
          if (this.templateList.length > 0) {
            this.showTable = true;
            this.$loading.hide();
          } else {
            this.$toast.error("No data found");
          }
          this.$loading.hide();
        },
        error => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );
    },
    onChangePage(pageOfTemplates) {
      this.pageOfTemplates = pageOfTemplates;
    },
    setTempVal2Modal(tempId) {
      this.validAttrList = [];
      this.actionAttrList = [];
      this.selectedValidTempAttr = [];
      this.selectedActionTempAttr = [];

      this.fnSetTempAttr(this.validAttrListTemp, this.validAttrList);
      this.fnSetTempAttr(this.actionAttrListTemp, this.actionAttrList);

      let tempObject = this.templateList.find(i => i.templateId == tempId);
      this.templateName = tempObject.templateName;
      this.templateDesc = tempObject.templateDesc;
      this.selProjectId = tempObject.projectId;
      this.selTempId = tempId;
      let tempInfoObj = tempObject.templateInfo;

      tempInfoObj.forEach(obj => {
        let tempFlag = this.validAttrList.find(
          i => i.templateAttrId == obj.templateAttributeId
        );
        if (tempFlag) {
          this.move(
            obj.templateAttributeId,
            this.validAttrList,
            this.selectedValidTempAttr
          );
        } else {
          this.move(
            obj.templateAttributeId,
            this.actionAttrList,
            this.selectedActionTempAttr
          );
        }
      });

      if (this.selectedValidTempAttr.length == 0) {
        this.isEnableValidAttrPop = true;
      }
      if (this.selectedActionTempAttr.length == 0) {
        this.isEnableActionAttrPop = true;
      }
      if (this.validAttrList.length == 0) {
        this.isEnableValidAttrPush = true;
      }
      if (this.actionAttrList.length == 0) {
        this.isEnableActionAttrPush = true;
      }
      this.setFlagDisable();
      //this.validAttrList = [];
      //this.actionAttrList = [];
    },
    setFlagEnable() {
      this.disableFlag = false;
    },
    setFlagDisable() {
      this.disableFlag = true;
    },
    fnLoadTempAttr() {
      this.$loading.show({ delay: 0 });
      axios.get(epLoadTempAttr).then(
        response => {
          this.templateAttrList = response.data.templateAttributes;
          this.templateAttrList.forEach(element => {
            this.isAction = element.isAction;
            this.templateAttrName = element.templateAttrName;
            this.templateAttrId = element.templateAttrId;
            let tempAttrObj = [];
            tempAttrObj.templateAttrName = this.templateAttrName;
            tempAttrObj.templateAttrId = this.templateAttrId;
            if (this.isAction == "Y") {
              this.actionAttrListTemp.push(tempAttrObj);
            } else {
              this.validAttrListTemp.push(tempAttrObj);
            }
          });
          this.validAttrLen = this.validAttrListTemp.length;
          this.actionAttrLen = this.actionAttrListTemp.length;
          this.$loading.hide();
        },
        error => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );
    },
    addValidTempAttribute(event) {
      var selected = this.validTempAttrSource.slice(0);
      for (var i = 0; i < selected.length; ++i) {
        this.move(selected[i], this.validAttrList, this.selectedValidTempAttr);
      }
      if (this.selectedValidTempAttr.length == this.validAttrLen) {
        this.isEnableValidAttrPush = true;
      }

      if (this.isEnableValidAttrPop == true) {
        this.isEnableValidAttrPop = false;
      }
    },

    addActionTempAttribute(event) {
      var selected = this.actionTempAttrSource.slice(0);

      for (var i = 0; i < selected.length; ++i) {
        this.move(
          selected[i],
          this.actionAttrList,
          this.selectedActionTempAttr
        );
      }
      if (this.selectedActionTempAttr.length == this.actionAttrLen) {
        this.isEnableActionAttrPush = true;
      }

      if (this.isEnableActionAttrPop == true) {
        this.isEnableActionAttrPop = false;
      }
    },

    removeValidTempAttribute() {
      var selected = this.validTempAttrDestination.slice(0);

      for (var i = 0; i < selected.length; ++i) {
        this.move(selected[i], this.selectedValidTempAttr, this.validAttrList);
      }
      if (this.validAttrList.length == this.validAttrLen) {
        this.isEnableValidAttrPop = true;
      }

      if (this.isEnableValidAttrPush == true) {
        this.isEnableValidAttrPush = false;
      }
      if (this.selectedValidTempAttr.length < 1) {
        this.validTempAttrDestination = [];
      }
    },
    removeActionTempAttribute() {
      var selected = this.actionTempAttrDestination.slice(0);
      for (var i = 0; i < selected.length; ++i) {
        this.move(
          selected[i],
          this.selectedActionTempAttr,
          this.actionAttrList
        );
      }
      if (this.actionAttrList.length == this.actionAttrLen) {
        this.isEnableActionAttrPop = true;
      }
      if (this.isEnableActionAttrPush == true) {
        this.isEnableActionAttrPush = false;
      }
      if (this.selectedActionTempAttr.length < 1) {
        this.actionTempAttrDestination = [];
      }
    },
    move(tempAttr, arrFrom, arrTo) {
      arrFrom.forEach(element => {});
      var index = arrFrom.findIndex(el => {
        return el.templateAttrId == tempAttr;
      });
      var item = arrFrom[index];
      arrFrom.splice(index, 1);
      arrTo.push(item);
    },
    fnUpdateTemplate() {
      this.templateRequest = [];
      this.arrTemplateInfoMain = [];

      this.$loading.show({ delay: 0 });
      // let validFlag = this.fnUpdateTempValidation();
      // if (!validFlag) {
      //   return validFlag;
      // }
      this.selectedValidTempAttr.forEach(obj => {
        let arrTemplateInfo = {
          isActive: "Y",
          templateAttributeId: obj.templateAttrId
        };

        this.arrTemplateInfoMain.push(arrTemplateInfo);
      });

      this.selectedActionTempAttr.forEach(obj => {
        let arrTemplateInfo = {
          isActive: "Y",
          templateAttributeId: obj.templateAttrId
        };

        this.arrTemplateInfoMain.push(arrTemplateInfo);
      });

      let arrTempRequest = {
        templateId: this.selTempId,
        isActive: "Y",
        projectId: this.project_value,
        templateDesc: this.templateDesc,
        templateName: this.templateName,
        templateInfo: this.arrTemplateInfoMain,
        projectId: this.selProjectId,
        updatedBy: secureLS.get("cuid")
      };
      this.templateRequest.push(arrTempRequest);
      axios
        .put(epUpdateTemplate, this.templateRequest)
        .then(
          data => {
            if (data.data.statusCode == 200) {
              this.submitted = true;
              this.$loading.hide();
              this.$toast.open("Template Updated Successfully");

              this.fnFilterTemplate();
            } else {
              this.$toast.error("Failed to update");
            }
          },
          error => {
            this.$toast.error("Something went wrong. Please contact Admin.");
            this.$loading.hide();
          }
        )
        .catch(data => {});
    },
    // fnUpdateTempValidation() {
    //   if (this.templateName == "" || this.templateName == undefined) {
    //     alert("Kindly provide Template Name !");
    //     return false;
    //   }
    //   if (this.templateDesc == "" || this.templateDesc == undefined) {
    //     alert("Kindly provide Templatre Description !");
    //     return false;
    //   }
    //   if (
    //     this.selectedValidTempAttr.length < 1 &&
    //     this.selectedActionTempAttr.length < 1
    //   ) {
    //     alert("Kindly select any Template Attribute..!");
    //     return false;
    //   }
    //   return true;
    // },
    fnSetTempAttr(srcAttrList, destAttrList) {
      srcAttrList.forEach(element => {
        let tempAttrObj = [];
        tempAttrObj.templateAttrName = element.templateAttrName;
        tempAttrObj.templateAttrId = element.templateAttrId;
        destAttrList.push(tempAttrObj);
      });
    },

    deleteTemplate: function(event) {
      this.deleteRecordArr = [];
      this.$loading.show({ delay: 0 });
      this.deleteTemplateIdArr.forEach(val => {
        let templateData = this.templateList.find(i => i.templateId == val);

        templateData.updatedBy = secureLS.get("cuid");
        this.deleteRecordArr.push(templateData);
      });

      axios
        .delete(epDeleteTemplate, {
          data: this.deleteRecordArr
        })
        .then(
          data => {
            if (data.data.statusCode == 200) {
              this.$loading.hide();
              this.$toast.open("Template Deleted Successfully");
              this.fnFilterTemplate();
            } else {
              this.$toast.error("Failed to Delete");
            }
          },
          error => {
            this.$toast.error("Something went wrong. Please contact Admin.");
            this.$loading.hide();
          }
        )
        .catch(function(error) {
          console.log(error);
        });
    },
    addDeleteTemplateIndex: function(event, templateId) {
      if (event.target.checked) {
        if (!this.deleteTemplateIdArr.includes(templateId)) {
          this.deleteTemplateIdArr.push(templateId);
        }
      } else {
        this.deleteTemplateIdArr.splice(
          this.deleteTemplateIdArr.indexOf(templateId),
          1
        );
      }
    },
    handleSubmit(e) {
      this.formSubmitted = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          this.fnUpdateTemplate();
        }
      });
    }
  }
};
</script>

<style scoped>
@import "../assets/navstyle.css";
.modalArea {
  width: 750px;
  height: 600px;
  left: 10px;
}
.tablefont {
  font-size: 15px;
}

#validationbox1 {
  width: 180px;
  height: 150px;
}
#validationbox2 {
  width: 180px;
  height: 150px;
}
.box2 {
  position: absolute;
  width: 180px;
  height: 150px;
  top: 300px;
  left: 450px;
}
.box1 {
  position: absolute;
  width: 180px;
  height: 150px;
  left: 450px;
  top: 100px;
}

.modaleditpos {
  position: absolute;
  left: 660px;
  top: 18px;
  cursor: pointer;
}
.centerheading {
  position: absolute;
  left: 300px;
}
#buttonpos {
  position: absolute;
  left: 325px;
}
#errmsgdesc {
  position: absolute;
  left: 250px;
}
#errmsgname {
  position: absolute;
  left: -115px;
}
</style>
