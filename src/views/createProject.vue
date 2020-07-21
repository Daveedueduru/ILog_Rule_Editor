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
                v-model="domain"
                v-validate="'required'"
                name="DomainName"
                class="custom-select form-control"
                :class="{
                  'is-invalid': formSubmitted && errors.has('DomainName')
                }"
              >
                <option disabled value>-- Select --</option>

                <option
                  v-for="domains in msg"
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
        </div>
        <div class="row">
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" id="basic-addon1">Project</label>
              </div>
              <input
                type="text"
                v-model="projectName"
                v-validate="'required'"
                name="ProjectName"
                class="form-control"
                :class="{
                  'is-invalid': formSubmitted && errors.has('ProjectName')
                }"
                @keypress="checkAlphaNumeric($event)"
              />
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
                <label class="input-group-text" id="basic-addon1">Project Desc</label>
              </div>
              <input
                type="text"
                v-model="projectType"
                v-validate="'required'"
                name="ProjectDesc"
                class="form-control"
                :class="{
                  'is-invalid': formSubmitted && errors.has('ProjectDesc')
                }"
              />
              <div
                v-if="formSubmitted && errors.has('ProjectDesc')"
                class="invalid-feedback"
              >{{ errors.first("ProjectDesc") }}</div>
            </div>
          </div>
        </div>

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
import { secureLS, epCreateProject, epLoadDomain } from "../main";
import mixin from "../mixins/Mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      msg: null,
      domain: "",
      projectName: "",
      projectType: "",
      createdBy: "",
      updatedBy: "",
      isActive: "",
      submitted: false,
      formSubmitted: false
    };
  },
  methods: {
    fnCreateProject() {
      this.projectarray = [];
      this.$loading.show({ delay: 0 });
      let projectarray = [
        {
          projectName: this.projectName,
          projectType: this.projectType,
          createdBy: secureLS.get("cuid"),
          updatedBy: secureLS.get("cuid"),
          domainId: this.domain,
          isActive: "Y"
        }
      ];

      axios
        .post(epCreateProject, projectarray)
        .then(
          data => {
            if (data.data.statusCode == 200) {
              this.$toast.open("Project Created Successfully");
              this.formSubmitted = false;
              this.projectName = null;
              this.projectType = null;
              this.domain = "";
              this.$loading.hide();
            } else {
              this.$toast.error("Failed to Create");
            }
          },
          error => {
            this.$toast.error("Failed to create Project.");
            this.$loading.hide();
          }
        )
        .catch(data => {});
    },
    fnLoadDomain() {
      this.$loading.show({ delay: 0 });
      axios.get(epLoadDomain).then(
        response => {
          this.msg = response.data.agDomainRuleEntity;
          this.$loading.hide();
        },
        error => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );
    },
    handleSubmit(e) {
      this.formSubmitted = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          this.fnCreateProject();
        }
      });
    }
  },

  mounted() {
    this.fnLoadDomain();
  },

  components: {}
};
</script>

<style scoped>
@import "../assets/navstyle.css";

input[type="text"]:focus {
  border: 3px solid #555;
}

.dropdowndom {
  position: absolute;
  top: 2px;
  left: 200px;
  width: 300px;
  height: 45px;
}
</style>
