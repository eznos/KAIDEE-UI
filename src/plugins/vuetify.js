import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);
import th from "vuetify/lib/locale/th";

Vue.component("my-component", {
  methods: {
    changeLocale() {
      this.$vuetify.lang.current = "th";
    },
  },
});
export default new Vuetify({
  lang: {
    locales: { th },
    current: "th",
  },
  icons: {
    iconfont: "md",
  },
  theme: {
    themes: {
      light: {
        primary: "#A23333",
        secondary: "#C98888",
        error: "#B72F2F",
        warning: "#FFB14F",
        agree: "#54c947",
        background: "#DFDDDD",
      },
      options: {
        customProperties: true,
      },
    },
  },
  font: {
    family: "Sarabun",
  },
});
