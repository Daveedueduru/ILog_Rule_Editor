<template>
  <div>
    <div class="formPositionList">
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">Domain</label>
              </div>
              <select
                v-model="domain_value"
                v-validate="'required'"
                name="DomainName"
                class="custom-select form-control"
                :class="{
                  'is-invalid': formSubmitted && errors.has('DomainName')
                }"
                @change="fnFilterProject($event)"
              >
                <option disabled value>-- Select --</option>

                <option
                  v-for="domains in domainList"
                  :key="domains.domainId"
                  :value="domains.domainId"
                >{{ domains.domainName }}</option>
              </select>
              <div
                v-if="formSubmitted && errors.has('DomainName')"
                class="invalid-feedback"
              >{{ errors.first("DomainName") }}</div>
            </div>
          </div>
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">Project</label>
              </div>
              <select
                v-model="project_value"
                v-validate="'required'"
                name="ProjectName"
                class="custom-select form-control"
                :class="{
                  'is-invalid': formSubmitted && errors.has('ProjectName')
                }"
              >
                <option disabled value>-- Select --</option>

                <option
                  v-for="projects in proj"
                  :key="projects.projectId"
                  :value="projects.projectId"
                >{{ projects.projectName }}</option>
              </select>
              <div
                v-if="formSubmitted && errors.has('ProjectName')"
                class="invalid-feedback"
              >{{ errors.first("ProjectName") }}</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">Template&nbsp;Name</label>
              </div>

              <input
                type="text"
                id="id_templateName"
                v-model="templateName"
                v-validate="'required'"
                name="TemplateName"
                class="form-control"
                :class="{
                  'is-invalid': formSubmitted && errors.has('TemplateName')
                }"
              />
              <div
                v-if="formSubmitted && errors.has('TemplateName')"
                class="invalid-feedback"
              >{{ errors.first("TemplateName") }}</div>
            </div>
          </div>
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">Template&nbsp;Desc</label>
              </div>

              <input
                type="text"
                id="id_templateDesc"
                v-model="templateDesc"
                v-validate="'required'"
                name="TemplateDescription"
                class="form-control"
                :class="{
                  'is-invalid':
                    formSubmitted && errors.has('TemplateDescription')
                }"
              />
              <div
                v-if="formSubmitted && errors.has('TemplateDescription')"
                class="invalid-feedback"
              >{{ errors.first("TemplateDescription") }}</div>
            </div>
          </div>
        </div>
        <div class="selbox">
          <div>
            <h6 class="ValHead">Validation&nbsp;Attributes:</h6>
            <select id="validationsourcebox" v-model="validTempAttrSource" multiple="multiple">
              <option
                class="optionFont"
                v-for="(tempAttr, index) in validAttrList"
                v-bind:value="tempAttr.templateAttrId"
                :key="index"
              >{{ tempAttr.templateAttrName }}</option>
            </select>

            <select
              id="validationdestbox"
              v-model="validTempAttrDestination"
              multiple="multiple"
              v-validate="selectedValidTempAttr.length > 0 ? false : 'required'"
              name="ValidationAttribute"
              class="form-control"
              :class="{
                'is-invalid': formSubmitted && errors.has('ValidationAttribute')
              }"
            >
              <option
                class="optionFont"
                v-for="(tempAttr, index) in selectedValidTempAttr"
                v-bind:value="tempAttr.templateAttrId"
                :key="index"
              >{{ tempAttr.templateAttrName }}</option>

              <br />
            </select>
            <div
              id="errmsgvalid"
              v-if="formSubmitted && errors.has('ValidationAttribute')"
              class="invalid-feedback"
            >{{ errors.first("ValidationAttribute") }}</div>
            <div class="arrows">
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
            </div>
          </div>
          <div>
            <h6 class="ActHead">Action&nbsp;Attributes:</h6>
            <select id="actionsourcebox" v-model="actionTempAttrSource" multiple="multiple">
              <option
                class="optionFont"
                v-for="(actionY, index) in actionAttrList"
                v-bind:value="actionY.templateAttrId"
                :key="index"
              >{{ actionY.templateAttrName }}</option>
            </select>

            <select
              id="actiondestbox"
              v-model="actionTempAttrDestination"
              multiple="multiple"
              v-validate="
                selectedActionTempAttr.length > 0 ? false : 'required'
              "
              name="ActionAttribute"
              class="form-control"
              :class="{
                'is-invalid': formSubmitted && errors.has('ActionAttribute')
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
            <div
              id="errmsgaction"
              v-if="formSubmitted && errors.has('ActionAttribute')"
              class="invalid-feedback"
            >{{ errors.first("ActionAttribute") }}</div>
            <div class="arrows1">
              <br />
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
            </div>
          </div>
          <div id="submitbtn" class="form-group">
            <button class="btn btn-primary">Save</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import TemplateNav from "../components/TemplateNav";
import axios from "axios";
import {
  secureLS,
  epCreateTemplate,
  epLoadTempAttr,
  epLoadDomain,
  epLoadProject
} from "../main";
export default {
  data() {
    return {
      proj: null,
      domainList: null,
      templateName: "",
      templateDesc: "",
      templateAttrList: [],
      actionAttributes: [],
      selectedValidTempAttr: [],
      selectedActionTempAttr: [],
      validTempAttrSource: [], // Facility values, selected in first control
      validTempAttrDestination: [],
      actionTempAttrSource: [],
      actionTempAttrDestination: [],
      actions: null,
      domain_value: "",
      project_value: "",
      actionAttrList: [],
      validAttrList: [],
      validAttrLen: 0,
      actionAttrLen: 0,
      isEnableActionAttrPush: false,
      isEnableActionAttrPop: false,
      isEnableValidAttrPush: false,
      isEnableValidAttrPop: false,
      arrTemplateInfoMain: [],
      templateRequest: [],
      submitted: false,
      formSubmitted: false
    };
  },
  components: {
    TemplateNav
  },
  mounted() {
    this.loadPage();
  },
  methods: {
    loadPage() {
      this.$loading.show({ delay: 0 });
      axios
        .get(epLoadDomain)
        .then(response => (this.domainList = response.data.agDomainRuleEntity));
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
              this.actionAttrList.push(tempAttrObj);
            } else {
              this.validAttrList.push(tempAttrObj);
            }
          });
          this.validAttrLen = this.validAttrList.length;
          this.actionAttrLen = this.actionAttrList.length;
          this.$loading.hide();
        },
        error => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );

      if (this.selectedValidTempAttr.length == 0) {
        this.isEnableValidAttrPop = true;
      }
      if (this.selectedActionTempAttr.length == 0) {
        this.isEnableActionAttrPop = true;
      }
    },

    fnFilterProject(event) {
      this.$loading.show({ delay: 0 });
      this.project_value = "";
      var url_project = epLoadProject + "?domainId=" + event.target.value;
      axios.get(url_project).then(
        response => {
          this.proj = response.data.agRuleProjectEntity;
          this.$loading.hide();
        },
        error => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );
    },

    move(tempAttr, arrFrom, arrTo) {
      var index = arrFrom.findIndex(el => {
        return el.templateAttrId == tempAttr;
      });
      var item = arrFrom[index];
      arrFrom.splice(index, 1);
      arrTo.push(item);
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
    fnCreateTemplate() {
      this.templateRequest = [];
      this.arrTemplateInfoMain = [];
      this.$loading.show({ delay: 0 });
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
        isActive: "Y",
        projectId: this.project_value,
        templateDesc: this.templateDesc,
        templateName: this.templateName,
        templateInfo: this.arrTemplateInfoMain,
        createdBy: secureLS.get("cuid"),
        updatedBy: secureLS.get("cuid")
      };
      this.templateRequest.push(arrTempRequest);
      axios
        .post(epCreateTemplate, this.templateRequest)
        .then(
          data => {
            if (data.data.statusCode == 200) {
              this.$toast.open("Template Created Successfully");
              this.formSubmitted = false;
              this.domain_value = "";
              this.templateName = "";
              this.templateDesc = "";
              this.project_value = "";
              // this.domainList = [];
              this.proj = [];
              this.validAttrList = [];
              this.actionAttrList = [];
              this.selectedActionTempAttr = [];
              this.selectedValidTempAttr = [];
              this.loadPage();
              this.$loading.hide();
            } else {
              this.$toast.error("Failed to Create");
            }
          },
          error => {
            this.$toast.error("Something went wrong. Please contact Admin.");
            this.$loading.hide();
          }
        )
        .catch(data => {});
    },
    handleSubmit(e) {
      console.log(": " + this.validTempAttrDestination);
      this.formSubmitted = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          this.fnCreateTemplate();
        }
      });
    }
  }
};
</script>

<style scoped>
.label {
  position: absolute;
  left: -30px;
  top: -100px;
}
.label1 {
  position: absolute;
  left: 400px;
  top: -100px;
}
.label2 {
  position: absolute;
  left: -35px;
  top: -30px;
}
.label3 {
  position: absolute;
  left: 390px;
  top: -30px;
}

#validationsourcebox {
  background-color: rgb(231, 229, 229);

  position: absolute;
  top: 370px;
  left: 530px;
  height: 200px;
  width: 200px;
}

#validationdestbox {
  background-color: rgb(231, 229, 229);

  position: absolute;
  top: 370px;
  left: 870px;
  height: 200px;
  width: 200px;
}

#actionsourcebox {
  background-color: rgb(231, 229, 229);
  position: absolute;
  top: 640px;
  left: 530px;
  height: 200px;
  width: 200px;
}
#actiondestbox {
  background-color: rgb(231, 229, 229);
  position: absolute;
  top: 640px;
  left: 870px;
  height: 200px;
  width: 200px;
}

.arrows {
  position: absolute;
  top: 420px;
  left: 788px;
}
.arrows1 {
  position: absolute;
  top: 700px;
  left: 788px;
}
#submitbtn {
  position: absolute;
  top: 870px;
  left: 765px;

  cursor: pointer;
}
.optionFont {
  font-size: 14px;
  padding: 5px;
}
#domaindropdown {
  position: absolute;
  top: -95px;
  left: 90px;
  width: 250px;
  height: 35px;
  resize: vertical;
}
#projectdropdown {
  position: absolute;
  top: -95px;
  left: 540px;
  width: 250px;
  height: 35px;
  resize: vertical;
}
#tempnameInput input[type="text"] {
  position: absolute;
  left: 90px;
  top: -30px;
  width: 250px;
  height: 40px;
  resize: vertical;

  text-align: left;
}
.ValHead {
  position: absolute;
  top: 330px;
  left: 730px;
}
.ActHead {
  position: absolute;
  top: 600px;
  left: 740px;
}

#tempdescInput input[type="text"] {
  position: absolute;
  left: 540px;
  top: -30px;
  width: 250px;
  height: 40px;
  resize: vertical;

  text-align: left;
}

#createForm {
  font-size: 15px;
}

#errmsgname {
  position: absolute;
  left: 80px;
  top: 10px;
  width: 250px;
}
#errmsgdesc {
  position: absolute;
  left: 540px;
  top: 10px;
  width: 250px;
}
#errmsgdom {
  position: absolute;
  left: 80px;
  top: -60px;
  width: 250px;
}
#errmsgproj {
  position: absolute;
  left: 540px;
  top: -60px;
  width: 250px;
}
#errmsgvalid {
  position: absolute;
  left: 845px;
  top: 570px;
  width: 250px;
}
.selbox {
  position: absolute;
  left: -400px;
  top: -250px;
}
#errmsgaction {
  position: absolute;
  left: 845px;
  top: 840px;
  width: 250px;
}
</style>
