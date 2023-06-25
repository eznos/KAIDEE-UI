<template>
  <v-app id="app">
    <v-container fill-height fill-width>
      <v-layout align-center justify-center>
        <v-card
          class="mx-auto"
          color="#F4ffff"
          elevation="10"
          max-height="90%"
          max-width="100%"
        >
          <v-card-title>
            <div class="content background-main">
              <v-row justify="space-between" class="px-3">
                <!-- title -->
                <div class="mb-4">
                  <v-row style="align-items: center">
                    <div class="ml-3 mt-9">
                      <h2>
                        <v-icon size="40" color="green"
                          >mdi-account-plus</v-icon
                        >
                        ลงทะเบียน
                      </h2>
                    </div>
                  </v-row>
                </div>
              </v-row>
            </div>
          </v-card-title>
          <v-card-text class="card-text-register">
            <v-form ref="formRegister" v-model="valid" lazy-validation>
              <v-row align="center" justify="center">
                <v-container>
                  <v-row>
                    <!-- rank -->
                    <v-col cols="12" md="6" lg="6">
                      <v-select
                        item-text="name"
                        item-value="value"
                        v-model="rank"
                        :items="ranks"
                        :rules="rules.zonesBuildingsRoom"
                        label="ยศ"
                        required
                      ></v-select>
                    </v-col>
                    <!-- affiliation -->
                    <v-col cols="12" md="6" lg="6">
                      <v-select
                        item-text="name"
                        item-value="name"
                        v-model="affiliation"
                        :items="affiliations"
                        :rules="rules.zonesBuildingsRoom"
                        label="สังกัด"
                        required
                      ></v-select>
                    </v-col>
                    <!-- firstNane-->
                    <v-col cols="12" md="6" lg="6">
                      <v-text-field
                        v-model="firstName"
                        label="ชื่อ"
                        required
                        :rules="rules.zonesBuildingsRoom"
                      ></v-text-field
                    ></v-col>
                    <!-- lastName -->
                    <v-col cols="12" md="6" lg="6">
                      <v-text-field
                        v-model="lastName"
                        label="นามสกุล"
                        required
                        :rules="rules.zonesBuildingsRoom"
                      ></v-text-field
                    ></v-col>
                    <!-- email -->
                    <v-col cols="12" md="6" lg="6">
                      <v-text-field
                        label="อีเมล"
                        :rules="[rules.email.regex]"
                        v-model="email"
                        type="email"
                        required
                      ></v-text-field>
                    </v-col>
                    <!-- phoneNumber -->
                    <v-col cols="12" md="6" lg="6">
                      <v-text-field
                        :rules="[rules.phoneNumber.regex]"
                        v-model="phoneNumber"
                        :counter="10"
                        label="เบอร์โทร"
                        required
                      ></v-text-field
                    ></v-col>
                    <!-- gender -->
                    <v-col cols="12" md="6" lg="6">
                      <v-select
                        label="เพศ"
                        :items="genders"
                        item-text="name"
                        item-value="value"
                        v-model="gender"
                        required
                        :rules="rules.zonesBuildingsRoom"
                      >
                      </v-select>
                    </v-col>
                    <!-- user -->
                    <v-col cols="12" md="6" lg="6">
                      <v-text-field
                        :rules="rules.username"
                        v-model="username"
                        label="ชื่อผู้ใช้งาน"
                        required
                      ></v-text-field>
                    </v-col>
                    <!-- password -->
                    <v-col cols="12" md="6" lg="6">
                      <v-text-field
                        v-model="password"
                        :append-icon="showpassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showpassword ? 'text' : 'password'"
                        required
                        name="input-10-1"
                        :rules="rules.password"
                        label="รหัสผ่านใหม่"
                        @click:append="showpassword = !showpassword"
                      ></v-text-field>
                    </v-col>
                    <!-- avatar upload and preview -->
                    <v-col cols="12" md="6" lg="6" align="center">
                      <v-hover v-slot="{ hover }">
                        <v-card
                          color="#DFDDDD"
                          height="142"
                          max-width="230"
                          tile
                          class="px-3 mb-2 uploadimg"
                        >
                          <v-row
                            style="height: 100%"
                            justify="center"
                            align="center"
                          >
                            <v-img
                              v-if="profileImage !== ''"
                              :src="profileImage"
                              height="142"
                              width="230"
                            >
                            </v-img>
                            <v-expand-transition>
                              <div
                                v-if="hover"
                                class="d-flex v-card--reveal"
                                style="height: 100%"
                              >
                                <div>
                                  <v-btn
                                    fab
                                    color="#F5F5F5"
                                    class="mr-2"
                                    @click="handleImageButtonClick"
                                  >
                                    <v-icon size="30"
                                      >mdi-file-image-outline</v-icon
                                    >
                                  </v-btn>
                                  <input
                                    type="file"
                                    ref="image"
                                    @change="onImageSelected"
                                    style="display: none"
                                    accept="image/png, image/jpeg"
                                  />
                                </div>
                              </div>
                            </v-expand-transition>
                          </v-row>
                        </v-card>
                      </v-hover>
                    </v-col>
                  </v-row>
                </v-container>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="mx-auto">
              <v-form v-model="valid" lazy-validation></v-form>
              <v-btn
                class="mr-4"
                color="agree"
                width="200px"
                outlined
                large
                :disabled="!valid"
                @click="submitRegister"
              >
                ยืนยันการลงทะเบียน
              </v-btn>
              <v-btn
                class="mr-4"
                to="/login"
                width="200px"
                large
                outlined
                color="error"
              >
                ยกเลิกการลงทะเบียน
              </v-btn>
              <v-btn
                class="mr-4"
                large
                outlined
                @click="clearForm"
                color="warning"
              >
                ล้างข้อมูล</v-btn
              >
            </div>
          </v-card-actions>
        </v-card>
      </v-layout>
      <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="2500">
        {{ text }}
      </v-snackbar>
    </v-container>
  </v-app>
</template>
<script>
import { storage } from "../../utils/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { apiUrl } from "../../utils/url";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import ranks from "../../json/rank.json";
import affiliations from "../../json/affiliations.json";
import genders from "../../json/genders.json";
export default {
  data: () => ({
    valid: false,
    profileImage: "",
    imageURL: "",
    showpassword: false,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    rank: "",
    affiliation: "",
    username: "",
    password: "",
    text: "",
    deleted: false,
    role: "user",
    snackbar: false,
    snackbarColor: "",
    ranks: ranks,
    affiliations: affiliations,
    genders: genders,
    rules: {
      email: {
        required: (v) => !!v || "กรุณาใส่อีเมล",
        regex: (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "อีเมลไม่ถูกต้อง",
      },
      phoneNumber: {
        required: (v) => !!v || "กรุณาใส่เบอร์โทรศัพท์",
        regex: (v) =>
          /^(08[0-9]{8})|(06[0-9]{8})|(09[0-9]{8})$/.test(v) ||
          "เบอร์โทรศัพท์ม่ถูกต้อง",
      },
      username: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 6) || "ชื่อผู้ใช้ต้องมีมากกว่า 6 ตัวอักษร",
      ],
      password: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 8) || "รหัสผ่านต้องมีมากกว่า 8 ตัวอักษร",
      ],
      Avatar: [
        (value) =>
          !value || value.size < 2000000 || "รูปประจำตัวขนาดไม่เกิน 2 MB",
      ],
      zonesBuildingsRoom: [(v) => !!v || "กรุณากรอกข้อมูล"],
    },
  }),
  created() {
    this.gettoken();
  },
  methods: {
    // get refreshToken
    gettoken() {
      var token = sessionStorage.getItem("refreshToken");
      this.token = token;
    },
    async submitRegister() {
      if (this.$refs.formRegister.validate()) {
        this.imageURL = await this.uploadProfileImageToStorage(
          this.profileImage
        );
        this.callAPIRegister();
      }
    },
    async callAPIRegister() {
      const datas = {
        username: this.username.trim(),
        password: this.password.trim(),
        rank: this.rank.trim(),
        affiliation: this.affiliation.trim(),
        first_name: this.firstName.trim(),
        last_name: this.lastName.trim(),
        gender: this.gender.trim(),
        email: this.email.trim(),
        phone_number: this.phoneNumber.trim(),
        profile_url: this.imageURL,
      };
      const config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      axios
        .post(apiUrl + "/v1/auth/registers", datas, config)
        .then(async () => {
          this.$router.push({
            name: "Login",
          });
        })
        .catch((error) => {
          console.log(error.response.data.error_message);
          if (error.response.data.error_message === "username already taken") {
            this.snackbar = true;
            this.snackbarColor = "warning";
            this.text = "ชื่อผู้ใช้งานนี้ ถูกใช้งานไปแล้ว";
          }
          if (error.response.data.error_message === "email already taken") {
            this.snackbar = true;
            this.snackbarColor = "warning";
            this.text = "อีเมลนี้ ถูกใช้งานไปแล้ว";
          } else {
            this.snackbar = true;
            this.snackbarColor = "red";
            this.text = "มีบางอย่างผิดพลาด กรุณาติดต่อ ผู้จัดทำ";
          }
        });
    },
    async uploadProfileImageToStorage(profileImage) {
      const metadata = { contentType: "image/jpeg" };
      const imageName = uuidv4() + ".jpg";
      const storageRef = ref(storage, `profile-image/${imageName}`);
      return new Promise(function (resolve) {
        uploadString(storageRef, profileImage, "data_url", metadata).then(
          (snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    },
    handleImageButtonClick() {
      this.$refs.image.click();
    },
    onImageSelected(event) {
      var file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.profileImage = e.target.result;
      };
    },
    clearForm() {
      this.$refs.formRegister.resetValidation();
      this.$refs.formRegister.reset();
      this.showpassword = false;
      this.profileImage = null;
    },
  },
};
</script>
<style scoped>
.h1c {
  font-size: 30px;
}
.card-text-register {
  margin-top: 10px;
  margin-bottom: 30px;
}
</style>
