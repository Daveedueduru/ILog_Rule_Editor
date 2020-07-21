<template>
  <div>
    <div class="formPositionList">
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">User Role</label>
              </div>
              <select
                v-model="userRole"
                v-validate="'required'"
                name="UserRole"
                class="custom-select form-control"
                :class="{
                  'is-invalid': formSubmitted && errors.has('UserRole')
                }"
              >
                <option disabled value>-- Select --</option>
                <option>ADMIN</option>
                <option>SUPER USER</option>
              </select>
              <div
                v-if="formSubmitted && errors.has('UserRole')"
                class="invalid-feedback"
              >{{ errors.first("UserRole") }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" id="basic-addon1">CUID</label>
              </div>
              <input
                type="text"
                v-model="cuid"
                v-validate="'required'"
                name="CUID"
                class="form-control"
                :class="{
                  'is-invalid': formSubmitted && errors.has('CUID')
                }"
                @keypress="checkAlphaNumeric($event)"
              />
              <div
                v-if="formSubmitted && errors.has('CUID')"
                class="invalid-feedback"
              >{{ errors.first("CUID") }}</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" id="basic-addon1">User Name</label>
              </div>
              <input
                type="text"
                v-model="userName"
                v-validate="'required'"
                name="UserName"
                class="form-control"
                :class="{
                  'is-invalid': formSubmitted && errors.has('UserName')
                }"
                @keypress="checkAlphaNumeric($event)"
              />
              <div
                v-if="formSubmitted && errors.has('UserName')"
                class="invalid-feedback"
              >{{ errors.first("UserName") }}</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-2">
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
import axios from "axios";
import { secureLS, epCreateUserRole, admin, superUser } from "../main";
//import UserRolePage from "../UserRoleTabs/UserRolePage";
import mixin from "../mixins/Mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      msg: null,

      createdBy: "",
      userRole: "",
      userName: "",
      updatedBy: "",
      isActive: "",
      cuid: "",
      submitted: false,
      formSubmitted: false
    };
  },
  methods: {
    createUser() {
      this.array = [];
      this.$loading.show({ delay: 0 });
      let array = [
        {
          createdBy: secureLS.get("cuid"),

          userRole: this.userRole,
          cuid: this.cuid,
          userName: this.userName,
          updatedBy: secureLS.get("cuid"),
          isActive: "Y"
        }
      ];

      axios
        .post(epCreateUserRole, array)

        .then(
          data => {
            // eslint-disable-next-line no-console
            console.log(data);

            this.$toast.open("User Added Successfully");
            this.formSubmitted = false;
            this.cuid = null;
            this.userName = null;
            this.userRole = null;
            this.$loading.hide();
          },
          error => {
            this.$toast.error("Something went wrong. Please contact Admin.");
            this.$loading.hide();
          }
        )
        .catch(data => {
          // eslint-disable-next-line no-console
          console.log(data);
        });
    },
    handleSubmit(e) {
      this.formSubmitted = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          this.createUser();
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
.buttonUser {
  position: absolute;
  left: 320px;
  top: 140px;
  background-color: black;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
.successMsgUser {
  position: absolute;
  top: 500px;
  left: 670px;
}
.dropdownuser {
  position: absolute;
  top: 2px;
  left: 200px;
  width: 300px;
  height: 45px;
}
</style>
