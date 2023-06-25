<template>
  <v-app id="app">
    <!-- filer and title-->
    <div class="content background-main">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-9">
              <h2>
                <v-icon size="40" color="#795548">
                  mdi-clipboard-text-clock
                </v-icon>
                ประวัติ
              </h2>
            </div>
          </v-row>
        </div>
      </v-row>
      <!-- search history -->
      <v-card class="card-filter px-6 py-6">
        <v-card-title>
          <v-icon size="35px" class="icon"
            >mdi-format-list-bulleted-triangle</v-icon
          >
          &nbsp;&nbsp;
          <h3>เครื่องมือค้นหา</h3>
          <!-- button -->
          <v-spacer></v-spacer>
        </v-card-title>
        <!-- search history -->
        <v-form lazy-validation ref="history">
          <v-row justify="space-between" class="px-3">
            <!-- rank -->
            <v-col cols="12" xs="12" sm="12" md="4" lg="4">
              <v-autocomplete
                v-model="rank"
                label="ยศ"
                class="filter"
                :items="ranks"
                clearable
                item-text="name"
                :rules="rules.autocomplete"
                name="rank"
                autofocus
                :search-input.sync="findFirstName"
              >
              </v-autocomplete>
            </v-col>
            <!--frist name-->
            <v-col cols="12" xs="12" sm="12" md="4" lg="4">
              <v-autocomplete
                v-model="firstName"
                :items="firstNameList"
                label="ชื่อ"
                class="filter"
                clearable
                :rules="rules.name"
                item-text="firstName"
                item-value="id"
                :search-input.sync="findLastName"
              ></v-autocomplete>
            </v-col>
            <!-- last name -->
            <v-col cols="12" xs="12" sm="12" md="4" lg="4">
              <v-autocomplete
                v-model="lastName"
                label="นามสกุล"
                class="filter"
                :items="lastNameList"
                clearable
                item-text="lastName"
                item-value="id"
                :rules="rules.name"
              ></v-autocomplete>
            </v-col>
            <v-row> </v-row>
            <!-- btn search -->
            <v-col cols="12" justify="space-between" class="px-3">
              <v-btn
                outlined
                color="agree"
                width="140"
                class="button-filter pt-6 pb-6"
                @click="submit()"
              >
                <v-icon>mdi-magnify</v-icon>
                &nbsp; ค้นหา
              </v-btn>
              <v-btn
                outlined
                color="error"
                width="140"
                class="button-filter pt-6 pb-6"
                @click="resetTable()"
              >
                <v-icon>mdi-delete-sweep</v-icon>
                &nbsp; ล้างข้อมูล
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </div>
    <div></div>
    <!-- data table and button -->
    <v-card class="card-filter px-6 py-6">
      <v-card-title>
        <!-- title -->
        <v-icon size="35px" class="icon">mdi-table-large</v-icon>
        &nbsp;&nbsp;
        <h3>ตารางประวัติการใช้น้ำประปา</h3>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialogExport" persistent max-width="75%">
          <template v-slot:activator="{ on, attrs }">
            <v-btn :disabled="!submit" color="#f8ce01" v-bind="attrs" v-on="on">
              Export ข้อมูล
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              ต้องการ Export ข้อมูลเป็นไฟล์ Excel หรือไม่
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="dialogExport = false">
                ยกเลิก
              </v-btn>
              <v-btn color="agree" text @click="exportHistory"> ยืนยัน </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-title>
      <v-card-text>
        <v-row>
          <!-- water -->
          <v-col cols="12">
            <v-data-table
              v-model="selected"
              :headers="headersWater"
              :items="waterHistoryTable"
              item-key="first_name"
              :items-per-page="itemsPerPage"
              class="elevation-1 pa-6"
              :loading="loadTable"
              loading-text="กำลังโหลด... โปรดรอสักครู่"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              @input="enterSelect($event)"
            >
              <template v-slot:top>
                <h3>ตารางประวัติค่าน้ำประปา</h3>
              </template>
              <template v-slot:item.created_at="{ item }">
                <span>{{
                  new Date(item.created_at).toISOString().substr(0, 7)
                }}</span>
              </template>
              <!-- color of price on datatable  -->
              <template v-slot:[`item.price`]="{ item }">
                <v-chip :color="getColor(item.price)">
                  {{ item.price }}
                </v-chip>
              </template>
              <template v-slot:[`item.unit`]="{ item }">
                <v-chip :color="getColor(item.unit)">
                  {{ item.unit }}
                </v-chip>
              </template>
              <!-- color of price on datatable  -->
              <template v-slot:[`item.status`]="{ item }">
                <td v-if="item.status === 'un_paid'">
                  <v-chip :color="getColorStatus(item.status)">
                    {{ "ยังไม่จ่าย" }}
                  </v-chip>
                </td>
                <td v-if="item.status === 'paid'">
                  <v-chip dark :color="getColorStatus(item.status)">
                    {{ "จ่ายแล้ว" }}
                  </v-chip>
                </td>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
      <v-snackbar v-model="snackbar" :timeout="timeout" :color="colorSnackbar">
        <div class="text-center">
          {{ statusAction }}
        </div>
      </v-snackbar>
    </v-card>
  </v-app>
</template>
<script>
import statuses from "../../json/statuses.json";
import ranks from "../../json/rank.json";
import axios from "axios";
import { apiUrl } from "../../utils/url";
import FileDownload from "js-file-download";
export default {
  data: () => ({
    id: "",
    firstNameList: [],
    lastNameList: [],
    findFirstName: "",
    findLastName: "",
    datenow: new Date().toISOString().substr(0, 4),
    firstName: "",
    lastName: "",
    el: "#app",
    snackbar: false,
    statusAction: "",
    colorSnackbar: "",
    timeout: 3500,
    valid: true,
    loadTable: false,
    sortBy: "created_at",
    sortDesc: false,
    modalAddDate: false,
    modalfilter: false,
    dialogExport: false,
    dialog3: false,
    attrs: {},
    on: {},
    selected: [],
    itemsPerPage: 5,
    selectItems: false,
    emailtarget: "",
    importExcel: false,
    exportExcelElectric: false,
    rank: "",
    ranks: ranks,
    statuses: statuses,
    electricHistoryTable: [],
    waterHistoryTable: [],
    historyElectric: "",
    historyWater: "",
    rules: {
      name: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 2) || "กรอกชื่อให้มากกว่า 2 ตัวอักษร",
      ],
      autocomplete: [(v) => !!v || "กรุณากรอกข้อมูล"],
    },
  }),
  computed: {
    headersWater() {
      return [
        {
          text: "เดือน",
          align: "left",
          value: "created_at",
        },
        {
          text: "หน่วย",
          value: "unit",
          align: "left",
        },
        {
          text: "ค่าน้ำ",
          value: "price",
          align: "left",
        },
        {
          text: "ค่าน้ำส่วนต่าง",
          value: "price_diff",
          align: "left",
        },
        {
          text: "ค่าใช้จ่ายรวม",
          value: "total_pay",
          align: "left",
        },
        {
          text: "สถานะ",
          value: "status",
          align: "left",
        },
      ];
    },
  },
  watch: {
    findFirstName: function () {
      this.getNameForCreateOldBill();
    },
    findLastName: function () {
      this.getLastNameForCreateOldBill();
    },
  },
  created() {},
  mounted() {},
  methods: {
    getNameForCreateOldBill() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(apiUrl + "/v1/resident/name" + "?rank=" + this.rank, config)
        .then((response) => {
          let data = response.data;
          this.firstNameList = data.result;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getLastNameForCreateOldBill() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(
          apiUrl + "/v1/resident/last-name" + "?id=" + this.firstName,
          config
        )
        .then((response) => {
          let data = response.data;
          this.lastNameList = data.result;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    submit() {
      if (this.$refs.history.validate()) {
        this.getUserHistory();
      }
    },
    // get electric
    getUserHistory() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(
          apiUrl + "/v1/billings/history/admin" + "?id=" + this.firstName,
          config
        )
        .then((response) => {
          let data = response.data;
          console.log(data);
          if (data.result.water == null) {
            this.waterHistoryTable = [];
            this.loadTable = false;
            this.snackbar = true;
            this.statusAction = "ไม่พบค่าน้ำ";
            this.colorSnackbar = "warning";
          } else {
            this.waterHistoryTable =
              data.result.water.accommodations[0].billings;
            this.loadTable = false;
            this.snackbar = true;
            this.statusAction = "ค้นหาสำเร็จ";
            this.colorSnackbar = "agree";
          }
        })
        .catch((error) => {
          this.loadTable = false;
          this.snackbar = true;
          this.statusAction = "ค้นหาไม่สำเร็จ กรุณากรอกข้อมูลให้ถูกต้อง";
          this.colorSnackbar = "red";
          console.log(error);
        });
    },
    // export with api
    exportHistory() {
      let data = {
        rank: this.rank,
        id: this.firstName,
        lastName: this.lastName,
      };
      var config = {
        headers: {
          "x-api-key": "339ea1bdb4c96a94b5291cec559b50e2",
        },
        data: data,
      };
      return axios
        .post(apiUrl + "/v1/billings/history/export",data, config)
        .then((response) => {
          FileDownload(response.data, "ข้อมูลผู้อยู่อาศัย.xlsx");
          this.exportExcelElectric = false;
          this.statusAction = "Export สำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
        })
        .catch((error) => {
          console.log(error);
          if (
            error.response.data.error_message ===
            "some record does not have calculated status"
          ) {
            this.statusAction = "Export ไม่สำเร็จ กรุณาเลือกข้อมูลใหม่";
            this.colorSnackbar = "warning";
            this.snackbar = true;
            this.exportExcelElectric = false;
          } else {
            this.statusAction = "Export ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
            this.exportExcelElectric = false;
          }
        });
    },
    resetTable() {
      this.electricHistoryTable = [];
      this.waterHistoryTable = [];
      this.$refs.history.reset();
      this.loadTable = true;
    },
    // color of price
    getColor(price) {
      if (price == 0) return "#FF606090";
      else return "#FFFFFF00";
    },
    // status color
    getColorForStatus(status) {
      if (status == "draft") return "yellow";
      if (status == "in_progess") return "red";
      if (status == "calculated") return "gray";
      else return "green";
    },
    // show delete as selected button
    enterSelect() {
      if (this.selected.length >= 1) {
        return (this.selectItems = true);
      } else {
        return (this.selectItems = false);
      }
    },
    // select all
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.getDesserts.slice();
    },
    // sort by name
    toggleOrder() {
      this.sortDesc = !this.sortDesc;
    },
    getColorStatus(status) {
      if (status == "un_paid") return "error";
      else return "agree";
    },
  },
};
</script>

<style scoped>
.filter {
  padding: 5px;
}
.button-filter {
  margin: 10px;
  padding: 20px;
}
.card-filter {
  margin-bottom: 20px;
  margin-top: 20px;
}
.sort {
  margin-right: 20px;
}
.chart-responsive {
  width: 100%;
  margin: 20px auto;
  margin-top: -20px;
}
</style>
