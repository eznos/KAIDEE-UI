<template>
  <v-app id="app">
    <!-- title and bottom -->
    <div class="content background-main" v-if="role == 'admin'">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-9">
              <h2>
                <v-icon size="40" color="#F3953F">mdi-account-edit</v-icon>
                จัดการผู้ใช้งาน
              </h2>
            </div>
          </v-row>
        </div>
      </v-row>
    </div>
    <!-- table and buttons -->
    <v-card class="card-filter px-6 py-6" v-if="role == 'admin'">
      <v-card-title>
        <!-- title -->
        <v-icon size="35px" class="icon"
          >mdi-format-list-bulleted-triangle</v-icon
        >
        &nbsp;&nbsp;
        <h3>ตารางผู้ใช้งาน</h3>
        &nbsp;&nbsp;
        <!-- delete as selected -->
        <v-btn
          color="error"
          width="140"
          v-bind="attrs"
          v-on="on"
          class="button-filter pt-5 pb-5"
          :disabled="!selectItems"
          @click="getUsersID()"
        >
          <v-icon>mdi-delete-sweep</v-icon>
          &nbsp; ลบข้อมูลที่เลือก
        </v-btn>
        <v-spacer></v-spacer>
        <!-- add user -->
        <v-dialog v-model="dialog" persistent max-width="75%">
          <v-card>
            <v-card-title>
              <div>
                <span>{{ formTitle }}</span>
              </div>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="formAdduser" v-model="valid" lazy-validation>
                  <v-row>
                    <!-- <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                        label="ยศ"
                        :items="ranks"
                        v-model="editedItem.rank"
                        required
                        :rules="rules.name"
                        disabled
                        item-text="name"
                        item-value="value"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                        v-model="editedItem.affiliation"
                        :items="affiliations"
                        required
                        :rules="rules.name"
                        disabled
                        label="สังกัด"
                        item-text="name"
                        item-value="value"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.firstName"
                        label="ชื่อ"
                        required
                        :rules="rules.name"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.lastName"
                        label="นามสกุล"
                        required
                        :rules="rules.name"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.gender"
                        :items="genders"
                        label="เพศ"
                        required
                        :rules="rules.name"
                        item-text="name"
                        item-value="value"
                        disabled
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.phone_number"
                        label="เบอร์โทรศัพท์"
                        required
                        :rules="[rules.phoneNumber.regex]"
                        disabled
                      ></v-text-field>
                    </v-col> -->
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.email"
                        label="อีเมล"
                        required
                        clearable
                        :rules="[rules.email.regex]"
                      ></v-text-field>
                    </v-col>
                    <!-- <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.role"
                        label="ตำแหน่ง"
                        :items="roles"
                        required
                        :rules="rules.name"
                        item-text="name"
                        item-value="value"
                        disabled
                      >
                      </v-select>
                    </v-col> -->
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-form>
                <v-btn color="warning" text @click="close"> ยกเลิก </v-btn>
                <v-btn color="agree" text :disabled="!valid" @click="save">
                  ยืนยัน
                </v-btn>
              </v-form>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- delete water user -->
        <v-dialog v-model="dialogDelete" persistent max-width="75%">
          <v-card>
            <v-card-title class="text-h5"
              >ต้องการลบผู้อยู่อาศัยคนนี้หรือไม่?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning" text @click="closeDelete">ยกเลิก</v-btn>
              <v-btn color="agree" text @click="deleteItemConfirm"
                >ยืนยัน</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-title>
      <!-- data table -->
      <v-card-text>
        <!-- filter -->
        <v-row justify="space-between" class="px-3">
          <v-col cols="6">
            <!-- Filter for  name-->
            <v-text-field
              v-model="search"
              prepend-icon="mdi-magnify"
              type="text"
              label="ค้นหา"
              clearable
              class="filter"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <!-- search by roles -->
            <v-select
              v-model="roleFilterValue"
              prepend-icon="mdi-account-circle-outline"
              label="ตำแหน่ง"
              :items="roles"
              clearable
              class="filter"
              item-text="name"
              item-value="value"
            >
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <!-- start data-table -->
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="userTable"
        item-key="id"
        :items-per-page="itemsPerPage"
        class="elevation-1 pa-6"
        :search="search"
        :loading="loadTable"
        loading-text="กำลังโหลด... โปรดรอสักครู่"
        show-select
        @input="enterSelect($event)"
        id="virtual-scroll-table"
        v-scroll:#virtual-scroll-table="onScroll"
      >
        <!-- color of roles on datatable  -->
        <template v-slot:[`item.role`]="{ item }">
          <v-chip :color="getColor(item.role)" dark>
            <td v-if="item.role == 'admin'">{{ "เจ้าหน้าที่" }}</td>
            <td v-if="item.role == 'user'">{{ "ผู้ใช้งาน" }}</td>
          </v-chip>
        </template>
        <template v-slot:[`item.gender`]="{ item }">
          <td v-if="item.gender == 'male'">{{ "ชาย" }}</td>
          <td v-if="item.gender == 'female'">{{ "หญิง" }}</td>
          <td v-if="item.gender == 'n/a'">{{ "ไม่ระบุ" }}</td>
        </template>
        <!-- data -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
        </template>
      </v-data-table>
      <!-- end data-table -->
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="colorSnackbar">
      <div class="text-center">
        {{ statusAction }}
      </div>
    </v-snackbar>
    <v-container v-if="role == 'user'">
      <NotFound />
    </v-container>
  </v-app>
</template>

<script>
import roles from "../../json/role.json";
import genders from "../../json/genders.json";
import ranks from "../../json/rank.json";
import affiliations from "../../json/affiliations.json";
import axios from "axios";
import { apiUrl } from "../../utils/url";
import NotFound from "../../components/notFound/Notfound.vue";
export default {
  components: { NotFound },
  data: () => ({
    key: process.env.APIKey,
    el: "#app",
    role: "",
    token: "",
    userID: "",
    snackbar: false,
    statusAction: "",
    colorSnackbar: "",
    timeout: 2000,
    loadTable: true,
    valid: false,
    on: {},
    attrs: {},
    modal: false,
    selectItems: false,
    dialog: false,
    menu: false,
    roles: roles,
    genders: genders,
    search: "",
    dialogDelete: false,
    // Filter models.
    NamefilterValue: "",
    roleFilterValue: "",
    affiliations: affiliations,
    ranks: ranks,
    selected: [],
    itemsPerPage: 5,
    userTable: [],
    editedIndex: -1,
    start: 0,
    rowHeight: 24,
    perPage: 25,
    editedItem: {
      first_name: "",
      role: "",
    },
    defaultItem: {
      first_name: "",
      role: "",
    },
    rules: {
      name: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) =>
          (v && v.length >= 2) || "กรอกชื่อหรือนามสกุลให้มากกว่า 2 ตัวอักษร",
      ],
      email: {
        required: (v) => !!v || "กรุณาใส่อีเมลของผู้รับ",
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
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มผู้ใช้งาน" : "แก้ไขผู้ใช้งาน";
    },
    headers() {
      return [
        {
          text: "ยศ",
          value: "rank",
        },
        {
          text: "สังกัด",
          value: "affiliation",
        },
        {
          text: "ชื่อ",
          value: "firstName",
        },
        {
          text: "นามสกุล",
          value: "lastName",
        },
        {
          text: "เพศ",
          value: "gender",
        },
        {
          text: "อีเมล",
          value: "email",
        },
        {
          text: "เบอร์โทรศัพท์",
          value: "phoneNumber",
        },
        {
          text: "ตำแหน่ง",
          value: "role",
          filter: this.statusFilter,
        },
        {
          text: "แก้ไข",
          value: "actions",
          sortable: false,
        },
      ];
    },
    startHeight() {
      return this.start * this.rowHeight - 32;
    },
    endHeight() {
      return this.rowHeight * (this.userTable.length - this.start);
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.getRole();
    this.gettoken();
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    getRole() {
      var role = localStorage.getItem("role");
      this.role = role;
    },
    gettoken() {
      var token = sessionStorage.getItem("refreshToken");
      this.token = token;
    },
    getUsersID() {
      if (this.selectItems == true) {
        let userID = [];
        for (var i = 0; i < this.selected.length; i++) {
          userID.push(this.selected[i].id);
        }
        this.deleteItemSelected(userID);
      }
    },
    getUserList() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      return axios
        .get(apiUrl + "/v1/user/users", config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            this.userTable = data.result;
            this.loadTable = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // edit user (email)
    editUser(email) {
      let user_ID = "?id=" + this.userID;
      let payload = {
        email: email.trim(),
      };
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      return axios
        .patch(apiUrl + "/v1/user/users/edit" + user_ID, payload, config)
        .then(async () => {
          this.valid = true;
          // this.$refs.formAdduser.reset()
          this.$refs.formAdduser.resetValidation();
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.status === "unauthorized") {
            this.statusAction = "แก้ไขข้อมูล ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "warning";
            this.snackbar = true;
            this.differencePriceCalculate = false;
          } else {
            this.statusAction = "แก้ไขข้อมูล ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
            this.differencePriceCalculate = false;
          }
        });
    },

    // delete user
    deleteUserAPI(userIDs) {
      var axios = require("axios");
      var data = JSON.stringify({
        id: userIDs,
      });

      var config = {
        method: "delete",
        url: apiUrl + "/v1/user/users/delete",
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios(config)
        .then(async () => {
          this.statusAction =
            "ลบข้อมูลผู้อยู่อาศัยจำนวน " + this.selected.length + "คน สำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
          this.selected = [];
        })
        .catch(function (error) {
          if (error.response.data.error_message === "bad_request") {
            this.statusAction = "ลบข้อมูลไม่สำเร็จ กรุณาเลือกข้อมูลใหม่";
            this.colorSnackbar = "warning";
            this.snackbar = true;
          } else {
            this.statusAction = "ลบข้อมูลไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
          }
        });
    },
    statusFilter(value) {
      if (!this.roleFilterValue) {
        return true;
      }
      return value === this.roleFilterValue;
    },
    editItem(item) {
      this.editedIndex = this.userTable.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.userID = item.id;
    },
    deleteItemConfirm() {
      this.userTable.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$refs.formAdduser.resetValidation();
      this.valid = true;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.userTable[this.editedIndex], this.editedItem);
        this.editUser(this.editedItem.email);
        this.snackbar = true;
        this.statusAction = "แก้ไขข้อมูลสำเร็จ";
        this.colorSnackbar = "agree";
        this.$refs.formAdduser.resetValidation();
        this.valid = true;
      } else {
        this.userTable.push(this.editedItem);
        this.$refs.formAdduser.resetValidation();
        this.valid = true;
      }
      this.close();
      this.$refs.formAdduser.resetValidation();
      this.valid = true;
    },
    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },
    // show delete as selected button
    enterSelect(values) {
      if (values.length >= 1) {
        return (this.selectItems = true);
        // alert("selected all");
      } else {
        return (this.selectItems = false);
      }
    },
    // delete as selected
    deleteItemSelected(userIDs) {
      if (confirm("ต้องการลบข้อมูลที่เลือกหรือไม่ ?")) {
        for (var i = 0; i < this.selected.length; i++) {
          const index = this.userTable.indexOf(this.selected[i]);
          this.userTable.splice(index, 1);
        }
        this.dialog = false;
        this.deleteUserAPI(userIDs);
      }
    },
    // color of price
    getColor(role) {
      if (role == "admin") return "red";
      else return "green";
    },
    onScroll(e) {
      // debounce if scrolling fast
      this.timeout && clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        const { scrollTop } = e.target;
        const rows = Math.ceil(scrollTop / this.rowHeight);
        this.start =
          rows + this.perPage > this.userTable.length
            ? this.userTable.length - this.perPage
            : rows;
        this.$nextTick(() => {
          e.target.scrollTop = scrollTop;
        });
      }, 20);
    },
  },
};
</script>

<style scoped>
.title-table {
  font-size: 25px;
  padding: 10px;
  font-family: Sarabun;
}
.button-filter {
  margin: 10px;
  padding: 20px;
}
.filter {
  padding: 5px;
}
.card-filter {
  margin-bottom: 20px;
  margin-top: 20px;
}
.negative-value {
  color: red;
}

.v-data-table {
  font-size: 20px;
}
#virtual-scroll-table {
  max-height: 400px;
  overflow: auto;
}
</style>
