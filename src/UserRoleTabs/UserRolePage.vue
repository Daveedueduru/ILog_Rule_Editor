<template>
  <div>
    <Main />
    <header>
      <h3>USER ROLE ADMIN</h3>
      <i
        id="usernamedisplay"
        class="fa fa-user-o"
        style="font-size:20px;color: black"
      >&nbsp; {{userName}}</i>
    </header>
    <div class="domainnav">
      <router-link to="/edituser">
        <h5>View / Update</h5>
      </router-link>
      <router-link to="/createuser">
        <h5>Create</h5>
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import Main from "../components/Main";
import { secureLS } from "../main";
export default {
  components: { Main },
  data() {
    return {
      userName: secureLS.get("userName")
    };
  }
};
</script>

<style>
@import "../assets/navstyle.css";
</style>

