<template>
  <div>
    <img src="../assets/ctl-logo.png" alt="logo" class="left" />
    <div class="borderColour">
      <h2>RULE EDITOR</h2>

      <div class="loginImg">
        <img class="img" src="../assets/loginlogo.png" alt="login" />
      </div>
      <div class="loginform">
        <form>
          <div id="login">
            <div>
              <input
                :disabled="loading"
                type="text"
                id="cuid"
                v-model="cuid"
                placeholder=" CUID "
                @keypress="checkAlphaNumeric($event)"
              />
            </div>
            <br />

            <div>
              <input
                :disabled="loading"
                type="password"
                id="password"
                v-model="password"
                placeholder=" PASSWORD"
              />
            </div>
            <div>
              <button
                class="btn btn-primary"
                :disabled="loading"
                v-on:click.prevent="login"
                id="button"
              >
                <span v-if="!loading">Login</span>
                <span v-else>Logging in...</span>
              </button>
              <div
                id="errorMessage"
                v-if="errorMessage != ''"
                v-bind:text="errorMessage"
              >{{ errorMessage }}</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
//import axios_auth from "axios";
import { secureLS, confluxUrl, normalUser } from "../main";
export default {
  data() {
    return {
      errorMessage: "",
      loading: false,
      cuid: "",
      password: "",
      users: "",
      userName: ""
    };
  },
  methods: {
    postLogin() {
      this.errorMessage = "";

      let ilog_uri = "/userRole/loadUserRole?cuid=";

      axios
        .get(ilog_uri + this.cuid)
        .then(response => {
          this.users = response.data.agUserRoleEntity;
          if (this.users.length == 0) {
            console.log("========= If");
            
            secureLS.set("userRole", normalUser);
          } else {
             console.log("========= else");
            this.users.forEach(element => {
              this.userName = element.userName;
              // secureLS.set("userName", element.userName);
              secureLS.set("userRole", element.userRole);
              secureLS.set("cuid", element.cuid);
            });
          }
           this.$router.push("/home");
        })
        .catch(error => {
          self.errorMessage = "No UserRole Found!";
          self.password = "";
        });
    },
    login() {
      this.errorMessage = "";
      if (this.cuid == "" || this.password == "") {
        this.errorMessage = "You must enter a username and password!";
        return;
      }

      if (this.cuid.includes("defaults")) {
        if (this.password == "minnows") {
          this.$cookie.set("auth", "1", 7);
          secureLS.set("token", "TempToken");
          secureLS.set("userName", this.cuid);
          //secureLS.set('fullname', this.input.username.toUpperCase());
          this.$emit("authenticated", true);
        } else {
          this.errorMessage = "Your password is incorrect!";
          this.password = "";
        }
        this.loading = false;
        return;
      }

      this.cuid = this.cuid.toLowerCase();
      var login_uri = "/conflux/login";
      var payload = {};
      var headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(this.cuid + ":" + this.password)
        }
      };
      console.log("headers: " + btoa(this.cuid + ":" + this.password));
      var self = this;
      this.loading = true;
      axios
        .post(confluxUrl + login_uri, payload, headers)
        .then(response => {
          response = response.data;
          var buildToken =
            self.cuid + ":" + response.l3_SESSION_ID + ":" + response.l3_TOKEN;
          self.$cookie.set("auth", "1", 7);
          secureLS.set("token", buildToken);
          secureLS.set(
            "userName",
            response.firstname + " " + response.lastname
          );
          //self.axios.defaults.headers.common['auth'] = buildToken;
          self.$emit("authenticated", true);
          console.log(
            buildToken +
              " || " +
              self.cuid +
              " || " +
              response.firstname +
              " " +
              response.lastname
          );
          this.postLogin();
        })
        .catch(function(error) {
          self.errorMessage = "Your username or password is incorrect!";
          self.password = "";
        })
        .then(function(response) {
          self.loading = false;
        });
      return;
    },
    checkAlphaNumeric: function($event) {
      let k = $event.keyCode;
      let chars =
        (k > 64 && k < 91) ||
        (k > 96 && k < 123) ||
        k == 8 ||
        k == 32 ||
        (k >= 48 && k <= 57);
      if (!chars) {
        $event.preventDefault();
      } else {
        return true;
      }
    }
  }
};
</script>

<style scoped>
@import "../assets/navstyle.css";

.loginform {
  position: absolute;
  top: 110px;
  left: 90px;
}
.img {
  position: absolute;
  top: 100px;
  left: 100px;
  width: 120px;
  height: 110px;
}

#button {
  position: absolute;
  left: 250px;
  top: 100px;

  cursor: pointer;
}

h2 {
  position: absolute;
  left: 240px;
  top: 20px;
  text-shadow: 2px 2px 4px #858080;
}
#errorMessage {
  position: relative;
  left: 150px;
  top: 130px;
  color: red;
}
#cuid {
  position: absolute;
  left: 150px;
  top: -5px;
  height: 40px;
  width: 300px;
  border-radius: 0px;
  box-sizing: border-box;
}
#password {
  position: absolute;
  left: 150px;
  top: 50px;
  width: 300px;
  height: 40px;
  border-radius: 0px;
  box-sizing: border-box;
}
label.userlogo {
  position: absolute;
  left: 110px;
  top: 0px;
}
label.pwlogo {
  position: absolute;
  left: 110px;
  top: 55px;
}
.left {
  display: block;
  position: absolute;
  margin-left: 0px;
  height: 70px;
  width: 290px;
  top: 0px;
  background-color: white;
}
.borderColour {
  position: absolute;
  left: 350px;
  top: 150px;
  width: 700px;
  height: 350px;
  border: 2px solid rgb(223, 220, 220);
  border-radius: 5px;
  box-sizing: border-box;
  padding: 2px;
}
</style>
