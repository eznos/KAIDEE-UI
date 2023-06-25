import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import * as dayjs from "dayjs";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
  installComponents: true,
  load: {
    key: "AIzaSyBzlLYISGjL_ovJwAehh6ydhB56fCCpPQw",
    libraries: "places",
    region: "TH",
    language: "th",
  },
});

new Vue({
  vuetify,
  router,
  dayjs,
  render: (h) => h(App),
}).$mount("#app");
