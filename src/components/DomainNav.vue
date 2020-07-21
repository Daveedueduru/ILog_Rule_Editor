<template>
  <div>
    <Main />
    <header>
      <h3>DOMAIN RULE EDITOR</h3>
      <i
        id="usernamedisplay"
        class="fa fa-user-o"
        style="font-size:20px;color:black"
      >&nbsp; {{userName}}</i>
    </header>
    <div class="domainnav">
      <router-link to="/edit">
        <h5 v-if="user_role==adminLocal || user_role==superUserLocal">View / Update</h5>
      </router-link>
      <router-link to="/createdomain">
        <h5 v-if="user_role==adminLocal || user_role==superUserLocal">Create</h5>
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import { secureLS, admin, superUser } from "../main";
import Main from "./Main";
export default {
  name: "navigation",
  components: { Main },
  data() {
    return {
      adminLocal: admin,
      superUserLocal: superUser,
      user_role: secureLS.get("userRole"),
      userName: secureLS.get("userName")
    };
  }
};
</script>

<style>
@import "../assets/navstyle.css";
.PageHeading {
  position: absolute;
  top: 0px;
  left: 300px;
}
</style>
