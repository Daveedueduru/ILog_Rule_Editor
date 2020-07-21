
<template>
  <div>
    <Main />
    <header>
      <h3>TEMPLATE EDITOR</h3>
      <i
        id="usernamedisplay"
        class="fa fa-user-o"
        style="font-size:20px;color:black"
      >&nbsp; {{userName}}</i>
    </header>
    <div class="domainnav">
      <router-link to="/viewtemplate">
        <h5 v-if="user_role==adminLocal || user_role==superUserLocal">View / Update</h5>
      </router-link>
      <router-link to="/createtemplate">
        <h5 v-if="user_role==adminLocal || user_role==superUserLocal">Create</h5>
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import Main from "./Main";
import { secureLS, admin, superUser } from "../main";
export default {
  name: "nav1",
  components: { Main },

  data() {
    return {
      adminLocal: admin,
      superUserLocal: superUser,
      userName: secureLS.get("userName"),
      user_role: secureLS.get("userRole")
    };
  }
};
</script>

<style>
@import "../assets/navstyle.css";
</style>
