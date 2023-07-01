<template>
  <div id="app">
      <router-view/>
  </div>
</template>


<script>
export default {
  data: () => ({
    admin: "admin",
  }),
  name: "App",
  props: {
    source: String,
  },

  created() {
    this.getUserRole();
  },
  methods: {
    getUserRole() {
      var role = localStorage.getItem("role");
      this.role = role;
    },
  },
  computed: {
    theme() {
      return this.$vuetify.theme.light ? "dark" : "light";
    },
  },
};
</script>

<style lang="scss">
#app {
  @import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@700&display=swap");
  font-family: "Sarabun", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<style>
.rounded-card {
  border-radius: 15px;
  border-color: black;
}
</style>
<style>
#app {
  background-color: var(--v-background-base);
}
.myFont {
  font-family: "Sarabun", sans-serif;
}
.v-text-field {
  height: 40px;
  font-size: 20px;
  margin: 20px;
}
.v-select {
  height: 40px;
  font-size: 20px;
  margin: 20px;
}
</style>
