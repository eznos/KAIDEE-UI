<template>
  <v-app id="app">
    <v-container fill-height fill-width>
      <div class="mx-auto">
        <v-card
          color="#F4ffff"
          elevation="10"
          max-width="800px"
          max-height="600px"
          class="pa-4 rounded-xl"
        >
          <div class="style-card mx-auto">
            <!-- <v-spacer></v-spacer> -->
            <v-card-title class="justify-center" dark>
              <v-img
                src="../../assets/img/ecommerce.png"
                max-width="250px"
                max-height="290px"
              ></v-img>
            </v-card-title>
            <v-card-text :style="{ padding: 0 }">
              <v-form ref="formLogin" lazy-validation>
                <v-alert
                  v-if="!isLogin"
                  outlined
                  type="error"
                  class="alert-login"
                >
                  {{ loginFail }}
                </v-alert>
                <v-text-field
                  class="text_fields"
                  v-model="username"
                  prepend-icon="mdi-face-man"
                  name="login"
                  label="ชื่อผู้ใช้งาน"
                  type="text"
                  autofocus
                  :rules="rules.usernameRules"
                  v-on:keyup="checkEnterPressedToSubmit"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  label="รหัสผ่าน"
                  :rules="rules.Password_Format"
                  v-on:keyup="checkEnterPressedToSubmit"
                ></v-text-field>
              </v-form>
              <div class="btn-register-forget">
                <v-btn text dark color="rgb(131,49,51)" to="/forgetpass"
                  >ลืมรหัสผ่าน</v-btn
                >
                <v-btn text dark color="rgb(131,49,51)" to="/register"
                  >ลงทะเบียน</v-btn
                >
              </div>
            </v-card-text>
            <v-card-actions class="row-btn">
              <v-row>
                <v-col cols="12">
                  <v-btn block color="primary" to="/">
                    <v-icon>mdi-login</v-icon>เข้าสู่ระบบ
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </div>
        </v-card>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import { apiUrl } from "../../utils/url";
import axios from "axios";

export default {
  name: "Login",
  data: () => ({
    showPassword: false,
    username: "",
    password: "",
    loginFail: "",
    isLogin: true,
    rules: {
      usernameRules: [(value) => !!value || "กรุณากรอก ชื่อผู้ใช้"],
      Password_Format: [
        (val) =>
          (val || "").length >= 8 ||
          "กรุณาใส่รหัสผ่านอย่างน้อย 8 ตัวหรือมากกว่า",
      ],
    },
  }),
  created() {},
  methods: {
    async checkEnterPressedToSubmit(e) {
      if (e.keyCode === 13) this.submit();
    },
    async submit() {
      if (this.$refs.formLogin.validate()) {
        this.loginWithAPI(this.username, this.password);
      }
    },

    async loginWithAPI(username, password) {
      let payload = {
        username: username.trim(),
        password: password.trim(),
      };
      let headerAPI = {
        headers: {
          "x-api-key": process.env.apiKey,
          "Content-Type": "application/json",
        },
        payload: payload,
      };
      axios
        .post(apiUrl + "/v1/auth/login", payload, headerAPI)
        .then(async (response) => {
          let data = response.data;
          if (data.status === "success") {
            if (data.result.role === "user") {
              this.rank = data.result.rank;
              this.fristName = data.result.firstName;
              this.lastName = data.result.lastName;
              this.image = data.result.profileUrl;
              this.role = data.result.role;
              this.affiliation = data.result.affiliation;
              this.user_id = data.result.id;
              this.refreshToken = data.token.refresh_token;
              localStorage.setItem("rank", this.rank);
              localStorage.setItem("first_name", this.fristName);
              localStorage.setItem("last_name", this.lastName);
              localStorage.setItem("ImageURL", this.image);
              localStorage.setItem("role", this.role);
              localStorage.setItem("affiliation", this.affiliation);
              localStorage.setItem("id", this.user_id);
              sessionStorage.setItem("refreshToken", this.refreshToken);
              this.$router.push({
                name: "History_user",
              });
            } else {
              this.rank = data.result.rank;
              this.fristName = data.result.firstName;
              this.lastName = data.result.lastName;
              this.image = data.result.profileUrl;
              this.role = data.result.role;
              this.affiliation = data.result.affiliation;
              this.user_id = data.result.id;
              this.refreshToken = data.token.refresh_token;
              this.accessToken = data.token.access_token;
              localStorage.setItem("rank", this.rank);
              localStorage.setItem("first_name", this.fristName);
              localStorage.setItem("last_name", this.lastName);
              localStorage.setItem("ImageURL", this.image);
              localStorage.setItem("role", this.role);
              localStorage.setItem("affiliation", this.affiliation);
              localStorage.setItem("id", this.user_id);
              sessionStorage.setItem("refreshToken", this.refreshToken);
              sessionStorage.setItem("accessToken", this.accessToken);
              this.$router.push({
                name: "overview",
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (
            error.response.data.error_message === "invalid username or password"
          ) {
            this.loginFail = "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง";
            this.isLogin = false;
            console.log(error.response.data.error_message);
          } else {
            this.loginFail = "มีบางอย่างผิดพลาด กรุณาติดต่อ ผู้จัดทำ";
            this.isLogin = false;
            console.log(error.response.data.error_message);
          }
        });
    },
  },
};
</script>

<style scoped>
.rounded-card {
  border-radius: 15px;
  border-color: black;
}
.style-card {
  padding: 30px;
}
.row-btn {
  padding: 0;
  margin-top: 10px;
}
.btn-register-forget {
  padding: 0;
  margin-top: 30px;
  margin-bottom: 15px;
}
.alert-login {
  padding: 0;
}
.text_fields {
  margin-bottom: 30px;
}
</style>
