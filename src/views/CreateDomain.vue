<template>
  <div id="createDomain">
    <div class="formPositionList">
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" id="basic-addon1">Domain Name</label>
              </div>
              <input
                type="text"
                v-model="m_domainName"
                v-validate="'required'"
                name="DomainName"
                class="form-control"
                :class="{
                  'is-invalid': formSubmitted && errors.has('DomainName')
                }"
                @keypress="checkAlphaNumeric($event)"
              />
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
                <label class="input-group-text" id="basic-addon1">Domain Desc</label>
              </div>
              <input
                type="text"
                v-model="m_domainDesc"
                v-validate="'required'"
                name="DomainDesc"
                class="form-control"
                :class="{
                  'is-invalid': formSubmitted && errors.has('DomainDesc')
                }"
              />
              <div
                v-if="formSubmitted && errors.has('DomainDesc')"
                class="invalid-feedback"
              >{{ errors.first("DomainDesc") }}</div>
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
//import DomainNav from "../components/DomainNav";
import { secureLS, epCreateDomain } from "../main";
import axios from "axios";
import mixin from "../mixins/Mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      msg: null,
      createdBy: "",
      m_domainDesc: "",
      m_domainName: "",
      updatedBy: "",
      isActive: "",
      formSubmitted: false,
      successFlag: false
    };
  },
  methods: {
    createDomain() {
      this.array = [];
      this.$loading.show({ delay: 0 });
      let array = [
        {
          createdBy: secureLS.get("cuid"),
          domainDesc: this.m_domainDesc,
          domainName: this.m_domainName,
          updatedBy: secureLS.get("cuid"),
          isActive: "Y"
        }
      ];
      axios
        .post(epCreateDomain, array)
        .then(
          data => {
            if (data.data.statusCode == 200) {
              this.$toast.open("Domain Created Successfully");
              this.formSubmitted = false;
              this.m_domainName = null;
              this.m_domainDesc = null;
              this.$loading.hide();
            } else {
              this.$toast.error("Failed to Create");
            }
          },
          error => {
            this.$toast.error("Failed to create Domain.");
            this.$loading.hide();
          }
        )
        .catch(data => {});
    },
    handleSubmit(e) {
      this.formSubmitted = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          this.createDomain();
        }
      });
    }
  },
  components: {}
};
</script>

<style scoped>
@import "../assets/navstyle.css";
.adjust {
  position: relative;
  left: 35px;
  top: 0px;
}
input[type="text"]:focus {
  border: 3px solid #555;
}
.mainnav li a.current {
  background-color: rgb(175, 122, 42);
  color: rgb(248, 248, 248);
}
</style>
