<template>
  <div>
    <Main />
    <header>
      <h3>CIRCUIT RULE EDITOR</h3>
      <i
        id="usernamedisplay"
        class="fa fa-user-o"
        style="font-size:20px;color:black"
      >&nbsp; {{ userName }}</i>
    </header>
    <div v-if="userRole == adminLocal || userRole == superUserLocal" class="domainnav">
      <router-link to="/editcircuit">
        <h5>View / Update</h5>
      </router-link>
      <router-link to="/createcircuit">
        <h5>Create</h5>
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import Main from "./Main";
import { secureLS, admin, superUser } from "../main";
//import Timeselector from "vue-timeselector";
export default {
  name: "navigation",
  components: { Main },

  data() {
    return {
      adminLocal: admin,
      superUserLocal: superUser,
      userRole: secureLS.get("userRole"),
      userName: secureLS.get("userName")
    };
  }
};
</script>

<style>
@import "../assets/navstyle.css";
</style>
