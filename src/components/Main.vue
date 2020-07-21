<template>
  <div id="container">
    <img src="../assets/ctl-white.png" alt="logo" class="left" />
    <div class="full">
      <h5 class="mainnavheading">
        RULE EDITORS
        <hr />
      </h5>

      <nav class="mainnav">
        <ul>
          <li :class="{ 'router-link-active': changeNavFlag('/edit') }">
            <router-link to="/gotodomain">Domain</router-link>
          </li>

          <li :class="{ 'router-link-active': changeNavFlag('/editproject') }">
            <router-link to="/gotoproject">Project</router-link>
          </li>

          <li :class="{ 'router-link-active': changeNavFlag('/viewtemplate') }">
            <router-link to="/gototemplate">Template</router-link>
          </li>

          <li :class="{ 'router-link-active': changeNavFlag('/editdevice') }">
            <router-link to="/gotodevice">Device</router-link>
          </li>

          <li :class="{ 'router-link-active': changeNavFlag('/editcircuit') }">
            <router-link to="/gotocircuit">Circuit</router-link>
          </li>
          <li
            v-if="this.user_role == adminLocal"
            :class="{ 'router-link-active': changeNavFlag('/edituser') }"
          >
            <router-link to="/gotouserrole">User Admin</router-link>
          </li>
        </ul>
      </nav>
      <router-link to="/" class="logout">
        <i class="fa fa-sign-out" style="font-size:20px;color:white">Logout</i>
      </router-link>
    </div>
  </div>
</template>

<script>
import { secureLS, admin } from "../main";
export default {
  data() {
    return {
      user_name: "",
      user_role: "",
      cuid: "",
      selectedPage: "",
      flag: false,
      array: [],
      adminLocal: admin
    };
  },
  mounted() {
    this.user_name = secureLS.get("userName");
    this.user_role = secureLS.get("userRole");
    this.cuid = secureLS.get("cuid");
    console.log(this.user_role + "-----" + admin);
    console.log(
      "UserName: " +
        secureLS.get("userName") +
        " || UserRole: " +
        secureLS.get("userRole")
    );
    if (this.selectedPage === "domain") {
      console.log("domain");
    }
  },
  methods: {
    changeNavFlag: function(input) {
      if (this.$router.currentRoute.path == input) {
        return 1;
      }
      return 0;
    }
  }
};
</script>

<style>
@import "../assets/navstyle.css";
.mainnavheading {
  color: #ffffff;
  position: absolute;
  top: 20px;
  left: 25px;
  font-family: "Lucida Sans";
}
hr {
  width: 250px;
  color: white;
}
.logout {
  position: absolute;
  top: 500px;
  left: 110px;
}
.editingNavBar {
  background-color: rgb(175, 122, 42);
}
.left {
  display: block;
  position: absolute;
  margin-left: 0px;
  height: 70px;
  width: 280px;
  top: 0px;
  background-color: black;
}
.router-link-active {
  background: rgb(134, 130, 130);
}
.mainnav {
  font-size: 13px;
}
</style>
