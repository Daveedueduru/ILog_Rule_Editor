<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
//import Main from "./components/Main";
export default {
  name: "app",
  components: {}
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
html {
  max-width: 100%;
  overflow-x: hidden;
}
</style>
