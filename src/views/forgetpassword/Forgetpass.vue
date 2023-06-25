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
                กรอกอีเมลเพื่อรับ Recovery Code ที่ใช้ในการยืนยันการลืมรหัส
              </v-card-subtitle>
              <v-card-text :style="{ padding: 0 }">
                <v-alert
                  v-if="!isChangePassword"
                  outlined
                  type="error"
                  class="alert-login"
                >
                  {{ changePasswordFail }}
                </v-alert>
                <v-form
                  ref="emailform"
                  lazy-validation
                  @submit.prevent="submitEmail"
                >
                  <v-container>
                    <v-row>
                      <v-col cols="12" xl="12">
                        <v-text-field
                          v-model="email"
                          prepend-icon="email"
                          :rules="[rules.emailrule.regex]"
                          label="อีเมล"
                          type="email"
                          required
                          autofocus
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-row>
                  <v-col cols="12" md="6" lg="6">
                    <v-btn
                      width="100%"
                      dark
                      color="rgba(22, 222, 105, 0.51)"
                      elevation="3"
                      @click="submitEmail"
                    >
                      <v-icon>mdi-page-next</v-icon>ถัดไป
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6" lg="6">
                    <v-btn
                      width="100%"
                      dark
                      color="rgba(245, 173, 15, 0.7)"
                      elevation="3"
                      to="/login"
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
    </v-main>
  </v-app>
</template>

<script>
// import { apiUrl } from "../../utils/url";
import axios from "axios";
import { apiUrl } from "../../utils/url";
export default {
  data() {
    return {
      email: "",
      changePasswordFail: "",
      isChangePassword: true,
      rules: {
        emailrule: {
          required: (v) => !!v || "กรุณาใส่อีเมล",
          regex: (v) =>
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v
            ) || "อีเมลไม่ถูกต้อง",
        },
      },
    };
  },
  computed: {},
  methods: {
    async submitEmail() {
      if (this.$refs.emailform.validate()) {
        this.sendEmailtoForget(this.email);
      }
    },
    async sendEmailtoForget() {
      var config = {
        method: "post",
        url: apiUrl + "/v1/auth/" + this.email + "/forgot-password",
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      axios(config)
        .then(() => {
          localStorage.setItem("userEmail", this.email);
          this.$router.push({
            name: "ForgetpasswordRecoverycode",
          });
        })
        .catch((error) => {
          // console.log(error);
          if (error.response.data.status === "unprocessable_entity") {
            this.changePasswordFail = "ไม่พบอีเมลดังกล่าว กรุณากรองใหม่";
            this.isChangePassword = false;
            console.log("invalid email");
          } else {
            this.changePasswordFail = "มีบางอย่างผิดพลาด กรุณาติดต่อ ผู้จัดทำ";
            this.isChangePassword = false;
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
.row {
  margin: 0px;
  padding: 10px;
}
.style-card-title {
  padding: 30px;
}
</style>
