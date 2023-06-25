<template>
  <v-app id="app">
    <v-card class="mx-auto" elevation="10" width="100%">
      <v-card-title>
        <div class="ml-3 mt-2 title">
          <h3>
            <v-icon size="40px" color="">mdi-account-edit</v-icon>
            แก้ไขข้อมูลส่วนตัว
          </h3>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form ref="formEdit" v-model="valid" class="form" lazy-validation>
          <v-responsive>
            <v-row>
              <!-- avatar upload and preview -->
              <v-col cols="12" sm="12" md="2" lg="2">
                <v-hover v-slot="{ hover }">
                  <v-card
                    color="#DFDDDD"
                    height="142"
                    max-width="230"
                    tile
                    class="px-3 mb-2 uploadimg"
                  >
                    <v-row style="height: 100%" justify="center" align="center">
                      <v-avatar
                        v-if="!profileImage"
                        tile
                        height="142"
                        width="230"
                        color="#DFDDDD"
                      >
                        <h2>
                          {{
                            firstName != null ? firstName.substring(0, 1) : null
                          }}
                          {{
                            lastName != null ? lastName.substring(0, 1) : null
                          }}
                        </h2>
                      </v-avatar>
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
                              <v-icon size="30">mdi-file-image-outline</v-icon>
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
              <v-col col="12">
                <v-container>
                  <v-row>
                    <!-- rank -->
                    <v-col cols="12" sm="4" md="6" lg="2">
                      <v-autocomplete
                        item-text="name"
                        item-value="name"
                        v-model="rank"
                        :items="ranks"
                        label="ยศ"
                        required
                        :rules="rules.nomalRules"
                        autofocus
                        clearable
                        prepend-icon="mdi-chevron-triple-up"
                      >
                      </v-autocomplete>
                    </v-col>
                    <!-- affi -->
                    <v-col cols="12" sm="4" md="6" lg="2">
                      <v-autocomplete
                        item-text="name"
                        item-value="name"
                        v-model="affiliation"
                        :items="affiliations"
                        :rules="rules.nomalRules"
                        label="สังกัด"
                        required
                        prepend-icon="mdi-format-list-group"
                      ></v-autocomplete>
                    </v-col>
                    <!-- name -->
                    <v-col cols="12" sm="4" md="6" lg="4">
                      <v-text-field
                        v-model="firstName"
                        :rules="rules.nameRules"
                        label="ชื่อ"
                        prepend-icon="mdi-form-textbox"
                        required
                        clearable
                      ></v-text-field>
                    </v-col>
                    <!-- last name -->
                    <v-col cols="12" sm="4" md="6" lg="4">
                      <v-text-field
                        v-model="lastName"
                        :rules="rules.nameRules"
                        label="นามสกุล"
                        prepend-icon="mdi-rename-box"
                        required
                        clearable
                      ></v-text-field>
                    </v-col>
                    <!-- email -->
                    <v-col cols="12" sm="4" md="6" lg="4">
                      <v-text-field
                        v-model="email"
                        :rules="[rules.email.regex]"
                        label="อีเมล"
                        prepend-icon="mdi-email"
                        clearable
                        required
                      ></v-text-field>
                    </v-col>
                    <!-- tel. -->
                    <v-col cols="12" sm="4" md="6" lg="4">
                      <v-text-field
                        :rules="[rules.phoneNumber.regex]"
                        v-model="phoneNumber"
                        :counter="10"
                        label="เบอร์โทร"
                        required
                        clearable
                        prepend-icon="mdi-card-account-phone"
                        @keypress="isNumber($event)"
                      ></v-text-field>
                    </v-col>
                    <!-- gender -->
                    <v-col cols="12" sm="4" md="6" lg="4">
                      <v-select
                        v-model="defaultGender"
                        prepend-icon="mdi-gender-male-female"
                        item-color="red"
                        :items="genders"
                        label="เพศ"
                        item-value="value"
                        item-text="name"
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                  <v-row> </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-responsive>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="mx-auto">
          <v-form v-model="valid" ref="formButton" @submit.prevent="submit">
            <!-- submit form -->
            <v-btn
              class="mr-4"
              color="agree"
              width="200px"
              large
              :disabled="!valid"
              @click="submit()"
              dark
            >
              ยืนยันการลงทะเบียน
            </v-btn>
            <!-- cancel form -->
            <v-btn
              class="mr-4"
              @click="$router.go(-1)"
              width="200px"
              large
              color="error"
            >
              ยกเลิกการลงทะเบียน
            </v-btn>
            <!-- clear form -->
            <v-btn
              class="mr-4"
              @click="clear"
              outlined
              width="200px"
              large
              color="error"
            >
              ล้างข้อมูล
            </v-btn>
          </v-form>
        </div>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="colorSnackbar">
      <div class="text-center">
        {{ statusAction }}
      </div>
    </v-snackbar>
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
    user_ID: "",
    snackbar: false,
    statusAction: "",
    colorSnackbar: "",
    timeout: 2000,
    loading: false,
    dialog: false,
    on: {},
    attrs: {},
    valid: true,
    clicked: false,
    loader: null,
    avatar: null,
    profileImage: "",
    CurrentUserimage: "",
    rank: "",
    ranks: ranks,
    affiliation: "",
    firstName: "",
    lastName: "",
    imageURL: "",
    defaultGender: {
      text: "ไม่ระบุ",
      value: "n/a",
    },
    genders: genders,
    tel: "",
    email: "",
    phoneNumber: "",
    zone: null,
    building: null,
    room: null,
    affiliations: affiliations,
    rules: {
      nameRules: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 2) || "กรอกชื่อให้มากกว่า 2 ตัวอักษร",
      ],
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
      nomalRules: [(v) => !!v || "กรุณากรอกข้อมูล"],
    },
    emailRules: [
      (v) => !!v || "กรุณากรอกอีเมล",
      (v) => /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/.test(v) || "อีเมลไม่ผิดรูปแบบ",
    ],
  }),
  setup() {},
  watch: {},
  computed: {},
  created() {
    this.getRole();
    this.gettoken();
  },

  methods: {
    getRole() {
      var role = localStorage.getItem("role");
      var user_ID = localStorage.getItem("id");
      this.role = role;
      this.user_ID = user_ID;
    },
    async submit() {
      if (this.$refs.formEdit.validate()) {
        this.imageURL = await this.uploadProfileImageToStorage(
          this.profileImage
        );
        this.callAPIEditUser();
      }
    },
    gettoken() {
      var token = sessionStorage.getItem("refreshToken");
      this.token = token;
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
    async callAPIEditUser() {
      const data = {
        rank: this.rank,
        affiliation: this.affiliation,
        firstName: this.firstName.trim(),
        lastName: this.lastName.trim(),
        email: this.email.trim(),
        phoneNumber: this.phoneNumber.trim(),
        gender: this.defaultGender,
        profileUrl: this.imageURL,
      };
      // let id = "?id=" +  this.user_ID
      const config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      axios
        .patch(
          apiUrl + "/v1/auth/edit-info" + "?id=" + this.user_ID,
          data,
          config
        )
        .then(() => {
          console.log(this.user_ID);
          this.$refs.formEdit.reset();
          this.statusAction = "แก้ไขข้อมูลสำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
          this.profileImage = null;
        })
        .catch((error) => {
          console.log(error);
          this.snackbar = true;
          this.snackbarColor = "red";
          this.text = "มีบางอย่างผิดพลาด กรุณาติดต่อ ผู้จัดทำ";
        });
    },
    // upload image and preview
    handleImageButtonClick() {
      this.$refs.image.click();
    },
    onImageSelected(event) {
      var file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.profileImage = e.target.result;
        this.isUploadProfileImage = true;
        // this.Userimage = e.target.result;
        // localStorage.setItem("ImageURL", this.Userimage);
      };
    },
    clear() {
      this.$refs.formEdit.reset();
      this.profileImage = "";
      // localStorage.removeItem("ImageURL");
    },
    validate() {
      this.$refs.formEdit.validate();
    },
    // number only in text field
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
  },
};
</script>
<style scoped>
.form {
  padding: 25px;
  margin-top: -20px;
}
.title {
  margin-top: 20px;
}
.icon {
  margin-right: 20px;
}
.uploadimg {
  margin-top: 20px;
  margin-right: -30px;
  margin-bottom: 30px;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
