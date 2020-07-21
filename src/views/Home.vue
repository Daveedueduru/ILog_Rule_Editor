<template>
  <div class="home">
    <Main />
    <header>
      <h3>RULE EDITOR</h3>
      <i
        id="usernamedisplay"
        class="fa fa-user-o"
        style="font-size:20px;color:black"
      >&nbsp; {{userName}}</i>
    </header>
  </div>
</template>

<script>
import Main from "../components/Main";
import { secureLS } from "../main";
export default {
  components: { Main },
  data() {
    return {
      userName: secureLS.get("userName"),
      user_role: secureLS.get("userRole")
    };
  },
  mounted() {
    this.user_name = secureLS.get("userName");
    this.user_role = secureLS.get("userRole");
    console.log(
      "UserName: " +
        secureLS.get("userName") +
        " || UserRole: " +
        secureLS.get("userRole")
    );
  }
};
</script>
<style scoped>
@import "../assets/navstyle.css";
#usernamedisplay {
  text-shadow: none;
  position: absolute;
  top: 30px;
  left: 900px;
}
</style>
