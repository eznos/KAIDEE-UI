<template>
  <v-app id="inspire">
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="primary"
      dark
    >
      <!--      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />-->
      <v-toolbar-title style="width: 350px">
        <a href="/" class="white--text" style="text-decoration: none"
          ><v-icon>mdi-truck</v-icon>&nbsp;Kaidee</a
        >
      </v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
        class="hidden-sm-and-down pl-10 ml-4"
      />
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon to="/store">
            <v-icon>mdi-shopping</v-icon>
          </v-btn>
        </template>
        <span>คลังสินค้า</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon to="/profile">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <span>โปรไฟล์</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" to="/cart" icon>
            <v-badge content="2" value="2" color="green" overlap>
              <v-icon>mdi-cart</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span>ตระกร้า</span>
      </v-tooltip>

      <v-dialog v-model="dialog" persistent max-width="290">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-login</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5">
            ต้องการออกจากระบบหรือไม่ ?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="warning" text @click="dialog = false"> ยกเลิก </v-btn>
            <v-btn color="green darken-1" text to="/login"> ตกลง </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>
    <v-content>
      <v-bottom-navigation :value="activeBtn" color="primary" horizontal>
        <a href="/" class="v-btn">
          <span>Home</span>
        </a>
        <v-menu open-on-hover offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on">
              <span>Shop</span>
            </v-btn>
          </template>
          <v-card class="mx-auto" max-width="344" outlined>
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              href="/shop"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-card>
        </v-menu>
        <a href="/product" class="v-btn">
          <span>Product</span>
        </a>
      </v-bottom-navigation>
    </v-content>
    <router-view />
    <v-footer :padless="true">
      <v-card flat tile width="100%" class="secondary white--text text-center">
        <v-divider></v-divider>

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} —
          <strong><v-icon color="#ffffff">mdi-truck</v-icon>&nbsp;KAIDEE</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>
<script>
export default {
  data: () => {
    return {
      data: 0,
      dialog: false,
      items: [
        { title: "T-Shirts" },
        { title: "Jackets" },
        { title: "Shirts" },
        { title: "Jeans" },
        { title: "Shoes" },
      ],
      activeBtn: 1,
    };
  },
  methods: {
    CountProduct() {
      this.data = 0;
    },
  },
};
</script>
