<template>
  <nav>
    <v-app-bar class="background" dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase">
        <span class="font-weight-light"
          >ระบบจัดการค่าน้ำประปาอาคารบ้านพักตำรวจภูธรภาค 3 (ส่วนกลาง)</span
        >
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <v-list flat>
          <v-list-item
            v-for="link in links"
            :key="link.text"
            router
            :to="link.route"
            active-class="border"
          >
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!-- แถบเมนู logout -->
      <v-menu bottom left class="background2" v-if="role == 'admin'">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-logout-variant</v-icon>
          </v-btn>
        </template>
        <v-card color="red">
          <v-list v-if="role === 'admin'">
            <v-list-item>
              <v-list-item-avatar>
                <img v-bind:src="imageSrc" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ first_name }} {{ last_name }}</v-list-item-title
                >
                <v-list-item-subtitle>{{ role }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list>
            <v-btn
              v-if="role === 'admin'"
              class="button-menu"
              to="/edit"
              tile
              block
              dark
              color="agree"
            >
              แก้ไขข้อมูลส่วนตัว <v-icon right>mdi-account-edit</v-icon>
            </v-btn>
            <!-- <v-btn tile block @click="logout" color="red"> ออกจากระบบ </v-btn> -->
            <v-dialog v-model="dialog" width="500" persistent>
              <template v-slot:activator="{ on, attrs }">
                <v-btn block tile color="error" v-bind="attrs" v-on="on" ma-2>
                  ออกจากระบบ <v-icon right>mdi-logout</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title> ต้องการออกจากระบบหรือไม่ ? </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="agree" text @click="logout"> ยืนยัน </v-btn>
                  <v-btn color="primary" text @click="dialog = false">
                    ยกเลิก
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list>
        </v-card>
      </v-menu>
      <!-- <v-btn icon @click="logout" v-if="role == 'user'">
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn> -->
      <v-dialog v-model="dialog" width="500" persistent>
        <template v-slot:activator="{ on: dialog }">
          <v-tooltip>
            <template #activator="{ on: tooltip }">
              <v-btn
                icon
                color="red"
                v-on="{ ...tooltip, ...dialog }"
                ma-2
                v-if="role == 'user'"
              >
                <v-icon right>mdi-logout</v-icon>
              </v-btn>
            </template>
            <span>ออกจากระบบ</span>
          </v-tooltip>
        </template>
        <v-card>
          <v-card-title> ต้องการออกจากระบบหรือไม่ ? </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="agree" text @click="logout"> ยืนยัน </v-btn>
            <v-btn color="primary" text @click="dialog = false"> ยกเลิก </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>
    <!-- จบ -->
    <v-navigation-drawer v-model="drawer" dark app class="background2">
      <!-- avatar  -->
      <v-layout v-if="role === 'admin'" column align-center>
        <v-flex class="mt-5">
          <router-link to="/edit">
            <v-avatar v-if="!profileImage" size="100" color="#DFDDDD">
              <h2>
                {{ first_name != null ? first_name.substring(0, 1) : null }}
                {{ last_name != null ? last_name.substring(0, 1) : null }}
              </h2>
            </v-avatar>
            <v-avatar v-if="profileImage" size="100">
              <img v-bind:src="imageSrc" alt="" />
            </v-avatar>
          </router-link>
        </v-flex>
        <v-flex class="mt-3">
          <p class="white--text subheading mt-1 text-center">ผู้เข้าใช้งาน</p>
          <p class="white--text subheading mt-1 text-center">
            {{ rank }} {{ first_name }} {{ last_name }}
          </p>
        </v-flex>
      </v-layout>
      <v-layout v-if="role === 'user'" column align-center>
        <v-flex class="mt-5">
          <router-link to="/edit">
            <v-avatar v-if="!profileImage" size="100" color="#DFDDDD">
              <h2>
                {{ first_name != null ? first_name.substring(0, 1) : null }}
                {{ last_name != null ? last_name.substring(0, 1) : null }}
              </h2>
            </v-avatar>
            <v-avatar v-if="profileImage" size="100">
              <img v-bind:src="imageSrc" alt="" />
            </v-avatar>
          </router-link>
        </v-flex>
        <v-flex class="mt-3">
          <p class="white--text subheading mt-1 text-center">ผู้เข้าใช้งาน</p>
          <p class="white--text subheading mt-1 text-center">
            {{ rank }} {{ first_name }} {{ last_name }}
          </p>
        </v-flex>
      </v-layout>
      <!-- แถบเมนูด้านข้าง -->
      <!-- for admin -->
      <v-list v-if="role === 'admin'">
        <v-list-item
          v-for="link in links"
          color="#669DF6"
          :key="link.text"
          router
          :to="link.route"
          active-class="border"
        >
          <v-list-item-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- for user -->
      <v-list v-if="role === 'user'">
        <v-list-item
          v-for="link in linksUser"
          color="#669DF6"
          :key="link.text"
          router
          :to="link.route"
          active-class="border"
        >
          <v-list-item-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            href="https://forms.gle/kBqXn6jiQiAtiQHY8"
            target="_blank"
            color="#262A56"
            block
          >
            แบบสอบถาม
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { apiUrl } from "../../utils/url";
export default {
  name: "Toolbar",
  data: () => ({
    drawer: true,
    dialog: false,
    profileImage: "",
    first_name: "",
    last_name: "",
    rank: "",
    role: "",
    scr: "",
    goDark: false,
    // แถบเมนู
    links: [
      {
        icon: "mdi-chart-arc",
        text: "ภาพรวม",
        route: "/overview",
      },
      {
        icon: "mdi-water",
        text: "จัดการบิล",
        route: "/waterbill",
      },
      {
        icon: " mdi-home-circle",
        text: "สถานะหอพัก",
        route: "/building",
      },
      {
        icon: "person",
        text: "ผู้อยู่อาศัย",
        route: "/residents",
      },
      {
        icon: "mdi-account-edit",
        text: "แก้ไขผู้ใช้งาน",
        route: "/manageuser",
      },
      {
        icon: "mdi-clipboard-text-clock",
        text: "ภาพรวมการใช้น้ำประปา",
        route: "/history",
      },
    ],
    items: [
      {
        icon: " mdi-logout",
        text: "ออกจากระบบ",
        route: "/login",
        click: "logout",
      },
      {
        icon: " mdi-clipboard-edit",
        text: "แก้ไขข้อมูลผู้ใช้",
        route: "/edit",
      },
    ],
    linksUser: [
      {
        icon: "mdi-history",
        text: "ประวัติค่าใช้จ่าย",
        route: "/historyUser",
      },
    ],
    itemsUser: [
      {
        icon: " mdi-logout",
        text: "ออกจากระบบ",
        route: "/login",
        click: "logout",
      },
    ],
  }),
  computed: {
    imageSrc() {
      return this.profileImage;
    },
  },
  components: {},
  created() {
    this.getUserData();
    this.getImageURL();
    this.gettoken();
  },
  methods: {
    gettoken() {
      var token = sessionStorage.getItem("refreshToken");
      this.token = token;
    },
    logout() {
      var axios = require("axios");
      var config = {
        method: "post",
        url: apiUrl + "/v1/auth/logout",
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      axios(config)
        .then(function () {
          localStorage.clear();
          sessionStorage.clear();
          window.location = "login";
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getUserData() {
      var rank = localStorage.getItem("rank");
      var first_name = localStorage.getItem("first_name");
      var last_name = localStorage.getItem("last_name");
      var role = localStorage.getItem("role");
      this.role = role;
      this.rank = rank;
      this.first_name = first_name;
      this.last_name = last_name;
    },
    getImageURL() {
      var ImageURL = localStorage.getItem("ImageURL");
      this.profileImage = ImageURL;
    },
  },
};
</script>

<style scoped>
.border {
  border-left: 5px solid #110f0f;
}
.background {
  background: linear-gradient(
    90deg,
    rgba(12, 71, 98, 1) 21%,
    rgba(12, 71, 98, 1) 78%
  );
}
.background2 {
  background: linear-gradient(
    90deg,
    rgba(12, 71, 98, 1) 21%,
    rgba(12, 71, 98, 1) 78%
  );
}
.button-menu {
  margin-bottom: 10px;
}
.user-card {
  background-image: linear-gradient(
    90deg,
    rgba(12, 71, 98, 1) 21%,
    rgba(244, 238, 238, 1) 78%
  );
}
.active_list .v-list-group .v-list-item--active {
  color: #110f0f !important;
}
</style>
