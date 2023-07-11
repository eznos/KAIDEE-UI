<template>
  <v-app id="app">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex class="text-xs-center" xs12 sm12 md4>
            <v-card
              color="#F4ffff"
              elevation="6"
              class="rounded-card"
              max-width="700px"
              max-height="900px"
            >
              <v-spacer></v-spacer>
              <v-card-title class="style-card-title" dark>
                <h2 class="mx-auto">ลืมรหัสผ่าน</h2>
              </v-card-title>
              <v-card-subtitle>
                กรอกรหัส Recovery Code เพื่อใช้ในการยืนยันตัวตน
              </v-card-subtitle>
              <v-card-text class="style-card-text" :style="{ padding: 0 }">
                <v-form ref="passwordForm" lazy-validation>
                  <v-container>
                    <v-row>
                      <!-- otp input -->
                      <v-col cols="12" xl="12">
                        <v-text-field
                          v-model="recoveryCode"
                          autofocus
                          required
                          prepend-icon="mdi-lock-clock"
                          :rules="rules.otp"
                          label="รหัส recovery code"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="password"
                          :append-icon="
                            showpassword ? 'mdi-eye' : 'mdi-eye-off'
                          "
                          :type="showpassword ? 'text' : 'password'"
                          required
                          name="input-10-1"
                          prepend-icon="lock"
                          label="รหัสผ่านใหม่"
                          class="form__input"
                          @click:append="showpassword = !showpassword"
                          :rules="rules.password"
                          v-on:keyup="checkEnterPressedToSubmit"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="repeatpassword"
                          :append-icon="
                            showpassword2 ? 'mdi-eye' : 'mdi-eye-off'
                          "
                          :type="showpassword2 ? 'text' : 'password'"
                          required
                          name="input-10-2"
                          prepend-icon="lock"
                          label="รหัสผ่านใหม่อีกรอบ"
                          class="form__input"
                          @click:append="showpassword2 = !showpassword2"
                          :rules="rules.confirmPasswordRule"
                          v-on:keyup="checkEnterPressedToSubmit"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
              <!-- button -->
              <v-card-actions class="justify-center">
                <v-row>
                  <v-col cols="12" md="12" lg="12">
                    <div v-if="timerCount == 0">
                      <v-btn block color="agree" @click="reSendOTP">
                        <v-icon>mdi-power-cycle</v-icon>
                        ส่ง Recovery Code อีกรอบ
                      </v-btn>
                    </div>
                    <div v-else>
                      <v-btn disabled block color="agree">
                        รอ {{ timerCount }} วินาทีเพื่อส่ง Recovery Code อีกรอบ
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6" lg="6">
                    <v-btn
                      width="100%"
                      dark
                      color="rgba(22, 222, 105, 0.91)"
                      @click="confirmPassword"
                      elevation="3"
                    >
                      <v-icon>mdi-page-next</v-icon>ยืนยัน
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6" lg="6">
                    <v-btn
                      width="100%"
                      dark
                      color="rgba(245, 173, 15, 0.9)"
                      to="/forgetpass"
                      elevation="3"
                    >
                      <v-icon>mdi-backspace</v-icon>ยกเลิก
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="2500">
        {{ text }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import { apiUrl } from "../../utils/url";
import axios from "axios";
export default {
  data() {
    return {
      timerCount: 20,
      loading: false,
      snackbar: false,
      snackbarColor: "",
      recoveryCode: "",
      text: "",
      // expectedOtp: "930823",
      showpassword: false,
      showpassword2: false,
      repeatpassword: "",
      password: "",
      email: "",
      rules: {
        otp: [(value) => !!value || "กรุณากรอกรหัส recovery"],
        password: [(value) => !!value || "กรุณากรอกรหัสผ่าน"],
        confirmPasswordRule: [
          (value) => !!value || "กรุณากรอกรหัสผ่านใหม่อีกครั้ง.",
          (value) => value === this.password || "รหัสผ่านไม่ตรงกัน",
        ],
      },
    };
  },

  watch: {
    timerCount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        }
      },
      immediate: true, // This ensures the watcher is triggered upon creation
    },
  },
  created() {
    this.getUserEmail();
  },
  methods: {
    getUserEmail() {
      var email = localStorage.getItem("userEmail");
      this.email = email;
    },
    async checkEnterPressedToSubmit(e) {
      if (e.keyCode === 13) this.submitNewPassword();
    },
    async submitNewPassword() {
      if (this.$refs.passwordForm.validate()) {
        this.confirmPassword(this.password, this.repeatpassword);
      }
    },

    async confirmPassword() {
      let payload = {
        type: "RESET",
        recovery_code: this.recoveryCode,
        password: this.repeatpassword.trim(),
      };
      let headerAPI = {
        headers: {
          "x-api-key": process.env.apiKey,
          "Content-Type": "application/json",
        },
        payload: payload,
      };
      axios
        .patch(
          apiUrl + "/v1/auth/" + this.email + "/password",
          payload,
          headerAPI
        )
        .then(() => {
          localStorage.clear();
          window.location = "/login";
        })
        .catch((error) => {
          if (error.response.data.status == "unprocessable_entity") {
            this.snackbar = true;
            this.snackbarColor = "warning";
            this.text = "เลข recovery code ไม่ถูกต้อง";
          } else {
            this.snackbar = true;
            this.snackbarColor = "red";
            this.text = "มีบางอย่างผิดพลาด กรุณาติดต่อ ผู้จัดทำ";
          }
        });
    },
    async reSendOTP() {
      this.recoveryCode = null;
      this.timerCount = 20;
      var config = {
        method: "post",
        url: apiUrl + "/v1/auth/" + this.email + "/forgot-password",
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      axios(config)
        .then(() => {})
        .catch((error) => {
          if (error.response.data.status === "unprocessable_entity") {
            this.snackbar = true;
            this.snackbarColor = "red";
            this.text = "มีบางอย่างผิดพลาด กรุณาติดต่อ ผู้จัดทำ";
          } else {
            this.snackbar = true;
            this.snackbarColor = "red";
            this.text = "มีบางอย่างผิดพลาด กรุณาติดต่อ ผู้จัดทำ";
          }
        });
    },
  },
};
</script>

<style scoped>
.position-relative {
  position: relative;
}
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
.row {
  margin: 0px;
  padding: 15px;
}
.style-card-title {
  padding: 30px;
}
.style-card-text {
  margin-bottom: -25px;
}
</style>
