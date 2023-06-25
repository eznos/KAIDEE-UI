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
    </div>
    <div></div>
    <!-- data table and button -->
    <v-card class="card-filter px-6 py-6">
      <v-card-title>
        <!-- title -->
        <v-icon size="35px" class="icon">mdi-table-large</v-icon>
        &nbsp;&nbsp;
        <h3>ตารางประวัติค่าใช้จ่าย</h3>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-data-table
              v-model="selected"
              :headers="headersWater"
              :items="waterHistoryTable"
              item-key="created_at"
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
              <template v-slot:item.createdAt="{ item }">
                <span>{{
                  new Date(item.createdAt).toISOString().substr(0, 7)
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
          <v-col cols="12">
            <v-card elevation="6" class="card-chart rounded-lg">
              <v-card-title>
                <v-row>
                  <v-col cols="6">
                    <div class="mx-auto">
                      <v-icon size="35px" color="#29DEFF"
                        >mdi-water-circle</v-icon
                      >
                      ค่าใช้จ่าย
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="mx-auto">
                      <v-icon size="35px" color="#ed473b"
                        >mdi-water-circle</v-icon
                      >
                      จำนวนหน่วย
                    </div>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-actions>
                <v-row>
                  <v-col cols="6">
                    <div class="chart-responsive" :style="{ padding: -20 }">
                      <canvas id="water" width="600" height="350"></canvas>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="chart-responsive" :style="{ padding: -20 }">
                      <canvas id="Unit" width="600" height="350"></canvas>
                    </div>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
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
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
import Chart from "chart.js";
import axios from "axios";
import { apiUrl } from "../../utils/url";
import FileDownload from "js-file-download";
export default {
  data: () => ({
    id: "",
    datenow: new Date().toISOString().substr(0, 4),
    chartData: [],
    firstName: "",
    lastName: "",
    rank: "",
    el: "#app",
    snackbar: false,
    statusAction: "",
    colorSnackbar: "",
    timeout: 2000,
    valid: true,
    loadTable: true,
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
          value: "createdAt",
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
          value: "priceDiff",
          align: "left",
        },
        {
          text: "ค่าใช้จ่ายรวม",
          value: "totalPay",
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
  watch: {},
  created() {
    this.getUserData();
    this.getUserHistory();
    // this.getUserHistoryAgain();
    // this.chartUser();
  },
  mounted() {},
  methods: {
    getUserData() {
      const id = localStorage.getItem("id");
      var rank = localStorage.getItem("rank");
      var firstName = localStorage.getItem("first_name");
      var lastName = localStorage.getItem("last_name");
      this.id = id;
      this.rank = rank;
      this.firstName = firstName;
      this.lastName = lastName;
    },
    async checkEnterPressedToSubmit(e) {
      if (e.keyCode === 13) this.submit();
    },
    submit() {
      if (this.$refs.history.validate()) {
        this.getUserHistory();
      }
    },
    // get electric
    getUserHistory() {
      let config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(`${apiUrl}/v1/billings/history?id=${this.id}`, config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            // this.electricHistoryTable =
            //   data.result.electric.accommodations[0].billings;
            this.waterHistoryTable = data.result.water;
            this.chartData = data.result.water;
            this.loadTable = false;
            this.snackbar = true;
            this.statusAction = "ค้นหาเรียบร้อย";
            this.colorSnackbar = "agree";

            const unit = [];
            for (let i = 0; i < data.result.water.length; i++) {
              unit.push(data.result.water[i].totalPay);
            }
            const units = [];
            for (let i = 0; i < data.result.water.length; i++) {
              units.push(data.result.water[i].unit);
            }
            const dateChart = [];
            for (let i = 0; i < data.result.water.length; i++) {
              dateChart.push(
                new Date(data.result.water[i].createdAt)
                  .toISOString()
                  .substr(0, 7)
              );
            }

            console.log(dateChart);
            new Chart(water, {
              type: "bar",
              data: {
                labels: dateChart,
                datasets: [
                  {
                    label: "ค่าน้ำประปา",
                    data: unit,
                    backgroundColor: "#8CFFD5",
                  },
                ],
              },

              options: {
                responsive: true,
                maintainAspectRatio: false,
                locale: "th-TH",
                layout: {
                  padding: 15,
                },
                legend: {
                  position: "top", // place legend on the right side of chart
                  plugins: {
                    labels: {
                      font: {
                        size: 20,
                        family: "Sarabun",
                      },
                    },
                  },
                },
                scales: {
                  xAxes: [
                    {
                      stacked: false, // this should be set to make the bars stacked
                    },
                  ],
                  yAxes: [
                    {
                      stacked: false, // this also..
                    },
                  ],
                },
              },
            });
            new Chart(Unit, {
              type: "bar",
              data: {
                labels: dateChart,
                datasets: [
                  {
                    label: "จำนวนหน่วย",
                    data: units,
                    backgroundColor: "#ed473b",
                  },
                ],
              },

              options: {
                responsive: true,
                maintainAspectRatio: false,
                locale: "th-TH",
                layout: {
                  padding: 15,
                },
                legend: {
                  position: "top", // place legend on the right side of chart
                  plugins: {
                    labels: {
                      font: {
                        size: 20,
                        family: "Sarabun",
                      },
                    },
                  },
                },
                scales: {
                  xAxes: [
                    {
                      stacked: false, // this should be set to make the bars stacked
                    },
                  ],
                  yAxes: [
                    {
                      stacked: false, // this also..
                    },
                  ],
                },
              },
            });
          }
          if (data.status == "success no data") {
            this.loadTable = false;
            this.snackbar = true;
            this.statusAction = "ไม่พบผู้อยู่อาศัย กรุณาค้นหาใหม่";
            this.colorSnackbar = "warning";
          }
        })
        .catch((error) => {
          if (
            error ==
            "TypeError: Cannot read properties of null (reading 'accommodations')"
          ) {
            this.loadTable = false;
            this.snackbar = true;
            this.statusAction = "ไม่พบบิล";
            this.colorSnackbar = "warning";
          } else {
            this.loadTable = false;
            this.snackbar = true;
            this.statusAction = "ค้นหาไม่สำเร็จ กรุณาติดต่อเจ้าหน้าที่";
            this.colorSnackbar = "red";
            console.log(error);
          }
        });
    },
    // getUserHistoryAgain() {
    //   let config = {
    //     headers: {
    //       "x-api-key": process.env.apiKey,
    //     },
    //   };
    //   return axios
    //     .get(`${apiUrl}/v1/billings/history?id=${this.id}`, config)
    //     .then((response) => {
    //       let data = response.data;
    //       if (data.status == "success") {
    //         const units = [];
    //         for (let i = 0; i < data.result.water.length; i++) {
    //           units.push(data.result.water[i].unit);
    //         }
    //         return new Chart(unit, {
    //           type: "line",
    //           data: {
    //             labels: [
    //               "มกราคม",
    //               "กุมภาพันธ์",
    //               "มีนาคม",
    //               "เมษายน",
    //               "พฤษภาคม ",
    //               "มิถุนายน ",
    //               "กรกฎาคม",
    //               "สิงหาคม",
    //               "กันยายน",
    //               "ตุลาคม",
    //               "พฤศจิกายน",
    //               "ธันวาคม",
    //             ],
    //             datasets: [
    //               {
    //                 label: "ค่าน้ำประปา",
    //                 data: units,
    //                 backgroundColor: "#ed473b",
    //               },
    //             ],
    //           },

    //           options: {
    //             responsive: true,
    //             maintainAspectRatio: false,
    //             locale: "th-TH",
    //             layout: {
    //               padding: 15,
    //             },
    //             legend: {
    //               position: "top", // place legend on the right side of chart
    //               plugins: {
    //                 labels: {
    //                   font: {
    //                     size: 20,
    //                     family: "Sarabun",
    //                   },
    //                 },
    //               },
    //             },
    //             scales: {
    //               xAxes: [
    //                 {
    //                   stacked: false, // this should be set to make the bars stacked
    //                 },
    //               ],
    //               yAxes: [
    //                 {
    //                   stacked: false, // this also..
    //                 },
    //               ],
    //             },
    //           },
    //         });
    //       }
    //       if (data.status == "success no data") {
    //         this.loadTable = false;
    //         this.snackbar = true;
    //         this.statusAction = "ไม่พบผู้อยู่อาศัย กรุณาค้นหาใหม่";
    //         this.colorSnackbar = "warning";
    //       }
    //     })
    //     .catch((error) => {
    //       if (
    //         error ==
    //         "TypeError: Cannot read properties of null (reading 'accommodations')"
    //       ) {
    //         this.loadTable = false;
    //         this.snackbar = true;
    //         this.statusAction = "ไม่พบบิล";
    //         this.colorSnackbar = "warning";
    //       } else {
    //         this.loadTable = false;
    //         this.snackbar = true;
    //         this.statusAction = "ค้นหาไม่สำเร็จ กรุณาติดต่อเจ้าหน้าที่";
    //         this.colorSnackbar = "red";
    //         console.log(error);
    //       }
    //     });
    // },
    chartUser() {
      data = this.chartData;
      new Chart(chartUsers, {
        type: "bar",
        data: {
          labels: [
            "มกราคม",
            "กุมภาพันธ์",
            "มีนาคม",
            "เมษายน",
            "พฤษภาคม ",
            "มิถุนายน ",
            "กรกฎาคม",
            "สิงหาคม",
            "กันยายน",
            "ตุลาคม",
            "พฤศจิกายน",
            "ธันวาคม",
          ],
          datasets: [
            {
              label: "ส่วนกลาง",
              data: [data],
              backgroundColor: "#8CFFD5",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          locale: "th-TH",
          layout: {
            padding: 15,
          },
          legend: {
            position: "top", // place legend on the right side of chart
            plugins: {
              labels: {
                font: {
                  size: 20,
                  family: "Sarabun",
                },
              },
            },
          },
          scales: {
            xAxes: [
              {
                stacked: false, // this should be set to make the bars stacked
              },
            ],
            yAxes: [
              {
                stacked: false, // this also..
              },
            ],
          },
        },
      });
    },
    // get selected id
    getbillingsID() {
      if (this.selectItems == true) {
        let billingsIDs = [];
        for (var i = 0; i < this.selected.length; i++) {
          billingsIDs.push(this.selected[i].id);
        }
        this.exportElectric(billingsIDs);
      }
    },
    // export with api
    exportHistory() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .post(apiUrl + "/v1/billings/history/export", config)
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
