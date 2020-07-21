<template>
  <div>
    <Main />
    <header>
      <h3>DEVICE RULE EDITOR</h3>
      <i
        id="usernamedisplay"
        class="fa fa-user-o"
        style="font-size:20px;color:black"
      >&nbsp; {{userName}}</i>
    </header>
    <div v-if="userRole == adminLocal || userRole == superUserLocal" class="domainnav">
      <router-link to="/editdevice">
        <h5>View / Update</h5>
      </router-link>
      <router-link to="/createdevice">
        <h5>Create</h5>
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import Main from "./Main";
import { secureLS, admin, superUser } from "../main";
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
