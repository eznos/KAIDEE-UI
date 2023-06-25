<template>
  <div id="app">
    <div class="pa-3 content background-main">
      <!-- title and export button -->
      <v-row justify="space-between" class="px-3">
        <div class="mb-4"></div>
        <!-- export data -->
        <div v-if="role === 'admin'">
          <v-dialog
            transition="dialog-bottom-transition"
            v-model="dialog"
            persistent
            max-width="70%"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="#f8ce01" v-bind="attrs" v-on="on">
                <v-icon> mdi-application-export </v-icon>
                &nbsp; Export ข้อมูล
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <v-icon size="30px" color="red">
                  mdi-application-export
                </v-icon>
                &nbsp; Export ข้อมูลภาพรวมเป็นไฟล์ Excel หรือไม่ ?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="warning" @click="dialog = false">
                  ยกเลิก
                </v-btn>
                <v-btn text color="agree" @click="exportOverview"> ตกลง </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-row>
    </div>
    <!-- chart -->
    <div class="pa-3 content background-main">
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" lg="12">
          <div>
            <!-- water -->
            <v-card elevation="6" class="card-chart rounded-lg">
              <v-card-title>
                <div class="mx-auto">
                  <v-icon size="35px" color="#29DEFF">mdi-water-circle</v-icon>
                  ค่าน้ำประปา
                </div>
              </v-card-title>
              <v-card-actions>
                <div class="chart-responsive" :style="{ padding: -20 }">
                  <canvas id="water" width="600" height="350"></canvas>
                </div>
              </v-card-actions>
            </v-card>
          </div>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="12">
          <div>
            <!-- water -->
            <v-card elevation="6" class="card-chart rounded-lg">
              <v-card-title>
                <div class="mx-auto">
                  <v-icon size="35px" color="#29DEFF">mdi-water-circle</v-icon>
                  จำนวนหน่วย
                </div>
              </v-card-title>
              <v-card-actions>
                <div class="chart-responsive" :style="{ padding: -20 }">
                  <canvas id="waterUnit" width="600" height="350"></canvas>
                </div>
              </v-card-actions>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="colorSnackbar">
      <div class="text-center">
        {{ statusAction }}
      </div>
    </v-snackbar>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
import Chart from "chart.js";
import { apiUrl } from "../../utils/url";
import axios from "axios";
import infoCardSelects from "../../json/infoCardSelects.json";
import FileDownload from "js-file-download";
export default {
  mounted() {
    // this.chartElectric();
    this.chartWater();
  },
  data() {
    return {
      sumOfZones: "",
      sumOfwaterZone: "",
      sumOfBuilding: "",
      zoneId: "",
      waterZoneIds: "",
      buildingId: "",
      zone: "",
      waterZone: "",
      building: "",
      zones: [],
      waterZonesData: [],
      buildinsData: [],
      snackbar: false,
      statusAction: "",
      colorSnackbar: "",
      timeout: 2500,
      role: "",
      infoCardSelect: [],
      infoCardSelects: infoCardSelects,
      menu: false,
      date: [],
      dialog: false,
      total: "",
      empty: "",
      move_in: "",
      move_out: "",
      rules: {
        dataRules: [(value) => !!value || "กรุณากรอก ชื่อผู้ใช้"],
      },
    };
  },
  watch: {},
  created() {
    this.getZonesdata();
    this.chartWaterUnit();
    this.getRole();
  },
  methods: {
    chartWater() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      axios
        .get(apiUrl + "/v1/overviews/overviews", config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            return new Chart(water, {
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
                    data: [
                      data.result.billings.zone.Center.jan,
                      data.result.billings.zone.Center.feb,
                      data.result.billings.zone.Center.mar,
                      data.result.billings.zone.Center.apr,
                      data.result.billings.zone.Center.may,
                      data.result.billings.zone.Center.jun,
                      data.result.billings.zone.Center.jul,
                      data.result.billings.zone.Center.aug,
                      data.result.billings.zone.Center.sep,
                      data.result.billings.zone.Center.oct,
                      data.result.billings.zone.Center.nov,
                      data.result.billings.zone.Center.dec,
                    ],
                    backgroundColor: "#8CFFD5",
                  },
                  {
                    label: "สุรนารายณ์",
                    data: [
                      data.result.billings.zone.Suranarai.jan,
                      data.result.billings.zone.Suranarai.feb,
                      data.result.billings.zone.Suranarai.mar,
                      data.result.billings.zone.Suranarai.apr,
                      data.result.billings.zone.Suranarai.may,
                      data.result.billings.zone.Suranarai.jun,
                      data.result.billings.zone.Suranarai.jul,
                      data.result.billings.zone.Suranarai.aug,
                      data.result.billings.zone.Suranarai.sep,
                      data.result.billings.zone.Suranarai.oct,
                      data.result.billings.zone.Suranarai.nov,
                      data.result.billings.zone.Suranarai.dec,
                    ],
                    backgroundColor: "#F86D6D",
                  },
                  {
                    label: "อัษฎางค์",
                    data: [
                      data.result.billings.zone.Asadang.jan,
                      data.result.billings.zone.Asadang.feb,
                      data.result.billings.zone.Asadang.mar,
                      data.result.billings.zone.Asadang.apr,
                      data.result.billings.zone.Asadang.may,
                      data.result.billings.zone.Asadang.jun,
                      data.result.billings.zone.Asadang.jul,
                      data.result.billings.zone.Asadang.aug,
                      data.result.billings.zone.Asadang.sep,
                      data.result.billings.zone.Asadang.oct,
                      data.result.billings.zone.Asadang.nov,
                      data.result.billings.zone.Asadang.dec,
                    ],
                    backgroundColor: "#2E36F0",
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
    chartWaterUnit() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      axios
        .get(apiUrl + "/v1/overviews/overviews-unit", config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            return new Chart(waterUnit, {
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
                    data: [
                      data.result.billings.zone.Center.jan,
                      data.result.billings.zone.Center.feb,
                      data.result.billings.zone.Center.mar,
                      data.result.billings.zone.Center.apr,
                      data.result.billings.zone.Center.may,
                      data.result.billings.zone.Center.jun,
                      data.result.billings.zone.Center.jul,
                      data.result.billings.zone.Center.aug,
                      data.result.billings.zone.Center.sep,
                      data.result.billings.zone.Center.oct,
                      data.result.billings.zone.Center.nov,
                      data.result.billings.zone.Center.dec,
                    ],
                    backgroundColor: "#8CFFD5",
                  },
                  {
                    label: "สุรนารายณ์",
                    data: [
                      data.result.billings.zone.Suranarai.jan,
                      data.result.billings.zone.Suranarai.feb,
                      data.result.billings.zone.Suranarai.mar,
                      data.result.billings.zone.Suranarai.apr,
                      data.result.billings.zone.Suranarai.may,
                      data.result.billings.zone.Suranarai.jun,
                      data.result.billings.zone.Suranarai.jul,
                      data.result.billings.zone.Suranarai.aug,
                      data.result.billings.zone.Suranarai.sep,
                      data.result.billings.zone.Suranarai.oct,
                      data.result.billings.zone.Suranarai.nov,
                      data.result.billings.zone.Suranarai.dec,
                    ],
                    backgroundColor: "#F86D6D",
                  },
                  {
                    label: "อัษฎางค์",
                    data: [
                      data.result.billings.zone.Asadang.jan,
                      data.result.billings.zone.Asadang.feb,
                      data.result.billings.zone.Asadang.mar,
                      data.result.billings.zone.Asadang.apr,
                      data.result.billings.zone.Asadang.may,
                      data.result.billings.zone.Asadang.jun,
                      data.result.billings.zone.Asadang.jul,
                      data.result.billings.zone.Asadang.aug,
                      data.result.billings.zone.Asadang.sep,
                      data.result.billings.zone.Asadang.oct,
                      data.result.billings.zone.Asadang.nov,
                      data.result.billings.zone.Asadang.dec,
                    ],
                    backgroundColor: "#2E36F0",
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // export with api
    exportOverview() {
      var config = {
        method: "post",
        url: apiUrl + "/v1/overviews/export",
        headers: {
          "x-api-key": process.env.apiKey,
        },
        responseType: "blob",
      };
      axios(config)
        .then((response) => {
          FileDownload(response.data, "ข้อมูลภาพรวม.xlsx");
          this.dialog = false;
          this.snackbar = true;
          this.statusAction = "Export สำเร็จ";
          this.colorSnackbar = "agree";
        })
        .catch(function (error) {
          console.log(error);
          this.dialog = false;
          this.snackbar = true;
          this.statusAction = "Export ไม่สำเร็จกรุณาติดต่อผู้จัดทำ";
          this.colorSnackbar = "red";
        });
    },
    getRole() {
      var role = localStorage.getItem("role");
      this.role = role;
    },
    // get zone data for select
    getZonesdata() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(apiUrl + "/v1/building/data/zones", config)
        .then((response) => {
          let data = response.data;
          const dataZones = data.result;
          this.zones = dataZones;
          return this.zones;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // water zone data for select
    getWaterZonesdata() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(
          apiUrl + "/v1/building/data/waterzone" + "?id=" + this.zoneId,
          config
        )
        .then((response) => {
          let data = response.data;
          const dataWaterZones = data.result;
          this.waterZonesData = dataWaterZones;
          return this.waterZonesData;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // buildings data for select
    getBuildingsdatas() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(
          apiUrl + "/v1/building/data/building" + "?id=" + this.waterZoneIds,
          config
        )
        .then((response) => {
          let data = response.data;
          const dataBuilding = data.result;
          this.buildinsData = dataBuilding;
          return this.buildinsData;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.chart-responsive {
  width: 100%;
  margin: 0px auto;
}
.font {
  font-family: Sarabun;
}
.mx-auto {
  font-size: 30px;
}
.space {
  padding: 10px;
  margin-top: 30px;
  margin-bottom: 10px;
}
</style>
