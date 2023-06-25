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
                <v-icon size="40" color="yellow"> mdi-lightning-bolt </v-icon>
                จัดการไฟฟ้า
              </h2>
            </div>
          </v-row>
        </div>
      </v-row>
      <!-- filter -->
      <v-card class="card-filter px-6 py-6">
        <v-card-title>
          <v-icon size="35px" class="icon"
            >mdi-format-list-bulleted-triangle</v-icon
          >
          &nbsp;&nbsp;
          <h3>เครื่องมือค้นหา</h3>
          <v-chip color="#F3FF83" class="ma-2"> ค่าไฟมากกว่าค่าเฉลี่ย </v-chip>
          <v-chip color="#FFDE83" class="ma-2"> ค่าไฟน้อยกว่าค่าเฉลี่ย </v-chip>
          <v-chip color="#FFA5A5" class="ma-2"> ค่าไฟเป็น 0 </v-chip>
          <v-spacer></v-spacer>
        </v-card-title>
        <!-- filter -->
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header> แสดงเพิ่มเติม </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="space-between" class="px-3">
                <!-- Filter for  name-->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-text-field
                    v-model="search"
                    prepend-icon="mdi-magnify"
                    type="text"
                    label="ค้นหา"
                    class="filter"
                    clearable
                  ></v-text-field>
                </v-col>
                <!-- Filter for  zone-->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-autocomplete
                    v-model="zoneFilterValue"
                    prepend-icon="mdi-map-legend"
                    label="ค้นหาด้วยพื้นที่"
                    class="filter"
                    :items="zones"
                    clearable
                    item-text="zone"
                    item-value="id"
                  >
                  </v-autocomplete>
                </v-col>
                <!-- Filter for  building-->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-autocomplete
                    v-model="buildingFilterValue"
                    prepend-icon="mdi-office-building-outline"
                    label="ค้นหาด้วยอาคาร"
                    class="filter"
                    :items="buildings"
                    clearable
                    :disabled="!zoneFilterValue"
                  >
                  </v-autocomplete>
                </v-col>
                <!-- filter by date -->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-menu
                    v-model="modalfilter"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateFilterValue"
                        label="ค้นหาด้วยเดือน"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        class="filter"
                        clearable
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="dateFilterValue"
                      type="month"
                      locale="th-TH"
                      scrollable
                      @input="modalfilter = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- Filter for  status-->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-select
                    item-text="name"
                    item-value="value"
                    v-model="statusFilterValue"
                    :items="statuses"
                    prepend-icon="mdi-list-status"
                    label="ค้นหาด้วยสถานะ"
                    class="filter"
                    clearable
                  ></v-select>
                </v-col>
                <!-- Filter for  price-->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-select
                    v-model="electricAverageFilterValue"
                    :items="electricAverages"
                    prepend-icon="mdi-list-status"
                    label="ค้นหาด้วยค่าไฟฟ้า"
                    class="filter"
                    clearable
                  ></v-select>
                </v-col>
                <v-row> </v-row>
                <!-- btn filter -->
                <v-col cols="12" justify="space-between" class="px-3">
                  <v-btn
                    outlined
                    color="error"
                    width="140"
                    @click="clearFilter"
                    class="button-filter pt-6 pb-6"
                  >
                    <v-icon>mdi-delete-sweep</v-icon>
                    &nbsp; ล้างการค้นหา
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </div>
    <div></div>
    <!-- data table and button -->
    <v-card class="card-filter px-6 py-6">
      <v-card-title>
        <!-- title -->
        <v-icon size="35px" class="icon">mdi-table-large</v-icon>
        &nbsp;&nbsp;
        <h3>ตารางค่าไฟฟ้า</h3>
        <v-form v-model="isFormValid">
          <v-text-field
            v-model="defineUnitPrice"
            label="กำหนดคราคาหน่วยค่าน้ำ"
            clearable
            @keypress="isNumber($event)"
            :rules="rules.priceRule"
            required
            :disabled="this.GGG == true"
            class="shrink mx-4"
          ></v-text-field>
        </v-form>

        <v-btn
          color="green"
          v-if="this.GGG == false"
          outlined
          :disabled="!isFormValid"
          @click="setPrice()"
          >ยืนยันหน่วยค่าน้ำ</v-btn
        >
        <v-btn
          color="red"
          v-if="this.GGG == true"
          outlined
          @click="clearPrice()"
          >ยกเลิกราคาต่อหน่วย</v-btn
        >
        <v-spacer></v-spacer>
        <div>
          <!-- create old bill -->
          <v-dialog v-model="dialogCreateOldBill" persistent max-width="60%">
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                class="button-filter pt-5 pb-5"
                color="#7A4579"
                v-on="{ ...attrs }"
              >
                <v-icon> mdi-newspaper-plus </v-icon>
                &nbsp; สร้างบิลของเดือนเก่า
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <v-icon> mdi-newspaper-plus </v-icon> &nbsp;
                สร้างบิลของเดือนเก่า</v-card-title
              >
              <v-card-text>
                <v-form ref="formDiffPrice" v-model="valid" lazy-validation>
                  <v-row>
                    <!-- rank -->
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                        v-model="rankOldBill"
                        :items="ranks"
                        label="ยศ"
                        autofocus
                        required
                        clearable
                        :rules="rules.buildingRoom"
                        item-text="name"
                        item-value="name"
                      >
                      </v-autocomplete>
                    </v-col>
                    <!-- first name -->
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                        v-model="firstNameOldBill"
                        label="ชื่อ"
                        :items="firstNameOldBillData"
                        required
                        clearable
                        :rules="rules.name"
                        item-text="firstName"
                        item-value="firstName"
                      >
                      </v-autocomplete>
                    </v-col>
                    <!-- last name -->
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                        v-model="lastNameOldBill"
                        :items="lastNameOldBillData"
                        label="นามสกุล"
                        required
                        clearable
                        :rules="rules.name"
                        item-text="lastName"
                        item-value="lastName"
                      >
                      </v-autocomplete>
                    </v-col>
                    <!-- zone -->
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                        v-model="zoneOldbill"
                        label="พื้นที่"
                        required
                        :items="zonesData"
                        :rules="rules.zonesBuildingsRoom"
                        clearable
                        item-value="id"
                        item-text="name"
                      >
                      </v-autocomplete>
                    </v-col>
                    <!-- building -->
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                        v-model="buildingOldbill"
                        label="อาคาร"
                        required
                        :items="buildinsData"
                        item-text="name"
                        item-value="id"
                        :rules="rules.zonesBuildingsRoom"
                        clearable
                      >
                      </v-autocomplete>
                    </v-col>
                    <!-- room number -->
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                        v-model="roomNoOldbill"
                        label="เลขห้องพัก"
                        required
                        @keypress="isNumber($event)"
                        :items="roomsData"
                        :rules="rules.zonesBuildingsRoom"
                        item-text="roomNo"
                        item-value="roomNo"
                        clearable
                      >
                      </v-autocomplete>
                    </v-col>
                    <!-- bill cycle -->
                    <v-col cols="12" sm="6" md="4">
                      <v-dialog
                        ref="dialog"
                        v-model="modal"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="billCycleOldbill"
                            label="รอบบิล"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="billCycleOldbill"
                          type="month"
                          locale="th-TH"
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="warning" @click="modal = false">
                            ยกเลิก
                          </v-btn>
                          <v-btn
                            text
                            color="agree"
                            @click="$refs.dialog.save(billCycleOldbill)"
                          >
                            ยืนยัน
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <!-- unit -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="unitOldbill"
                        label="หน่วยไฟฟ้า"
                        clearable
                        required
                        :rules="rules.buildingRoom"
                        @keypress="isNumber($event)"
                      ></v-text-field>
                    </v-col>
                    <!-- price -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="priceOldbill"
                        label="ค่าไฟฟ้า"
                        clearable
                        required
                        :rules="rules.buildingRoom"
                        @keypress="isNumber($event)"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning" text @click="dialogCreateOldBill = false"
                  >ยกเลิก</v-btn
                >
                <v-btn
                  color="agree"
                  :disabled="!valid"
                  text
                  @click="createOldBill"
                  >ยืนยันข้อมูล</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- edit bill -->
          <v-dialog v-model="dialog" persistent max-width="75%">
            <v-card>
              <v-card-title>
                <!-- title add user -->
                <span>{{ formTitle }}</span>
                <v-if> </v-if>
              </v-card-title>
              <v-card-subtitle v-if="this.GGG == false">
                <span> กรุณากำหนดราคาหน่วยค่าไฟฟ้า</span>
              </v-card-subtitle>
              <v-card-text>
                <v-container>
                  <!-- edit user -->
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <!-- rank -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          item-text="name"
                          item-value="value"
                          v-model="editedItem.rank"
                          label="ยศ"
                          required
                          :rules="rules.name"
                          :items="ranks"
                          disabled
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- name -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.firstName"
                          label="ชื่อ"
                          required
                          :rules="rules.name"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- lastname -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.lastName"
                          label="นามสกุล"
                          required
                          :rules="rules.name"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- unit-->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.unit"
                          label="หน่วยไฟฟ้า"
                          required
                          :rules="rules.buildingRoom"
                          @keypress="isNumber($event)"
                          clearable
                          :disabled="this.GGG == false"
                        ></v-text-field>
                      </v-col>
                      <!-- date pay -->
                      <v-col cols="12" sm="6" md="4">
                        <v-dialog
                          ref="dialogAdduser"
                          v-model="modalAddDate"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.billing_cycle"
                              label="เดือน"
                              prepend-icon="mdi-calendar"
                              readonly
                              required
                              autofocus
                              :rules="rules.buildingRoom"
                              v-bind="attrs"
                              v-on="on"
                              clearable
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.billing_cycle"
                            type="month"
                            locale="th-TH"
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="warning"
                              @click="modalAddDate = false"
                            >
                              ยกเลิก
                            </v-btn>
                            <v-btn
                              text
                              color="agree"
                              @click="
                                $refs.dialogAdduser.save(
                                  editedItem.billing_cycle
                                )
                              "
                            >
                              ยืนยัน
                            </v-btn>
                          </v-date-picker>
                        </v-dialog>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <!-- save and cancel buttons-->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning" text @click="close"> ยกเลิก </v-btn>
                <v-btn color="agree" :disabled="!valid" text @click="save">
                  ยืนยัน
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- add bill in this month -->
          <v-dialog v-model="addElectricBills" persistent max-width="50%">
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                color="agree"
                class="button-filter pt-5 pb-5"
                v-on="{ ...attrs }"
              >
                <v-icon> mdi-clipboard-plus-outline </v-icon>
                &nbsp; เพิ่มบิลไฟฟ้าในเดือนนี้
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                ต้องการสร้างบิลไฟฟ้าในเดือนนี้หรือไม่ ?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning" text @click="addElectricBills = false">
                  ยกเลิก
                </v-btn>
                <v-btn color="agree" text @click="createElectricityBill">
                  ยืนยัน
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- export -->
          <v-dialog v-model="exportExcelElectric" persistent max-width="75%">
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                color="agree"
                class="button-filter pt-5 pb-5"
                v-on="{ ...attrs }"
                :disabled="!selectItems"
              >
                <v-icon> mdi-file-export-outline </v-icon>
                &nbsp; Export ข้อมูล Excel
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                ต้องการ export ข้อมูลเป็นรูปแบบ Excel ที่เลือกไว้หรือไม่ ?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="warning"
                  text
                  @click="exportExcelElectric = false"
                >
                  ยกเลิก
                </v-btn>
                <v-btn color="agree" text @click="getbillingsID">
                  ยืนยันข้อมูล
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-card-title>
      <v-card-text>
        <!-- data table for admin -->
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="electricTable"
          item-key="id"
          :items-per-page="itemsPerPage"
          class="elevation-1 pa-6"
          :search="search"
          :loading="loadTable"
          loading-text="กำลังโหลด... โปรดรอสักครู่"
          show-select
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @input="enterSelect($event)"
        >
          <!-- color of price on datatable  -->
          <template
            v-slot:[`item.accommodations[0].billings[0].total_pay`]="{ item }"
          >
            <v-chip
              :color="getColor(item.accommodations[0].billings[0].total_pay)"
            >
              {{ item.accommodations[0].billings[0].total_pay }}
            </v-chip>
          </template>
          <!-- date format -->
          <template
            v-slot:[`item.accommodations[0].billings[0].created_at`]="{ item }"
          >
            <span>{{
              new Date(item.accommodations[0].billings[0].created_at)
                .toISOString()
                .substr(0, 7)
            }}</span>
          </template>
          <!-- status color -->
          <template
            v-slot:[`item.accommodations[0].billings[0].status`]="{ item }"
          >
            <td v-if="item.accommodations[0].billings[0].status === 'draft'">
              {{ "ร่าง" }}
            </td>
            <td
              v-if="item.accommodations[0].billings[0].status === 'in_progress'"
            >
              {{ "กำลังดำเนินการ" }}
            </td>
            <td v-if="item.accommodations[0].billings[0].status === 'exported'">
              {{ "Export แล้ว" }}
            </td>
          </template>
          <!-- editor data -->
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
      <v-snackbar v-model="snackbar" :timeout="timeout" :color="colorSnackbar">
        <div class="text-center">
          {{ statusAction }}
        </div>
      </v-snackbar>
    </v-card>
    <v-container v-if="role == 'user'">
      <NotFound />
    </v-container>
  </v-app>
</template>

<script>
import statuses from "../../json/statuses.json";
import ranks from "../../json/rank.json";
import zonesBuildingsRoom from "../../json/zonesBuildings.json";
import axios from "axios";
import { apiUrl } from "../../utils/url";
import NotFound from "../../components/notFound/Notfound.vue";
import FileDownload from "js-file-download";
export default {
  components: { NotFound },
  data: () => ({
    zonesData: [],
    buildinsData: [],
    roomsData: [],
    dialogCreateOldBill: false,
    firstNameOldBillData: [],
    lastNameOldBillData: [],
    rankOldBill: "",
    firstNameOldBill: "",
    lastNameOldBill: "",
    zoneOldbill: "",
    buildingOldbill: "",
    roomNoOldbill: "",
    billCycleOldbill: "",
    unitOldbill: "",
    totalPayOldBill: "",
    priceOldbill: "",
    modal: false,
    isFormValid: false,
    GGG: false,
    priceOfUnit: "",
    addElectricBills: false,
    zonesBuildingsRoom: zonesBuildingsRoom,
    el: "#app",
    snackbar: false,
    electricAverageFilterValue: "",
    electricAverages: ["น้อยกว่าค่าเฉลี่ย", "มากกว่าค่าเฉลี่ย"],
    role: "",
    statusAction: "",
    colorSnackbar: "",
    timeout: 2000,
    valid: true,
    loadTable: true,
    sortBy: "id",
    sortDesc: false,
    modalAddDate: false,
    modalfilter: false,
    dialog: false,
    dialog3: false,
    attrs: {},
    on: {},
    selected: [],
    itemsPerPage: 5,
    selectItems: false,
    emailtarget: "",
    importExcel: false,
    exportExcelElectric: false,
    search: "",
    rank: "",
    ranks: ranks,
    building: null,
    room_no: null,
    ElectricBillingID: "",
    // Filter models.
    zoneFilterValue: "",
    buildingFilterValue: "",
    roomFilterValue: "",
    dateFilterValue: "",
    statusFilterValue: "",
    date: new Date().toISOString().substr(0, 7),
    dateNow: new Date().toISOString().substr(0, 10),
    statuses: statuses,
    electricTable: [],
    editedIndex: -1,
    pricePerUnit: "",
    defineUnitPrice: "",
    editedItem: {
      firstName: "",
      zone: "",
      room_no: "",
      electricity_no: "",
      electricity_meter_no: "",
      status: "draft",
      billing_cycle: new Date().toISOString().substr(0, 7),
    },
    defaultItem: {
      firstName: "",
      zone: "",
      room_no: "",
      electricity_no: "",
      electricity_meter_no: "",
      status: "draft",
      billing_cycle: new Date().toISOString().substr(0, 7),
    },
    rules: {
      format: [
        (value) => !value || value.size < 20000000 || "ขนาดไฟล์ไม่เกิน 20 MB",
      ],
      name: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 2) || "กรอกชื่อให้มากกว่า 2 ตัวอักษร",
      ],
      electricNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 12) || "กรอกเลขผู้ใช้ไฟฟ้าไม่ครบ 12 ตัว",
      ],
      electricMeterNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 11) || "กรอกเลขมิเตอร์ไฟฟ้าไม่ครบ 11 ตัว",
      ],
      buildingRoom: [(v) => !!v || "กรุณากรอกข้อมูล"],
      email: {
        required: (v) => !!v || "กรุณาใส่อีเมลของผู้รับ",
        regex: (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "อีเมลไม่ถูกต้อง",
      },
      priceRule: [(v) => !!v || "กรุณากรอกข้อมูล"],
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มผู้ใช้ไฟฟ้า" : "แก้ไขผู้ใช้ไฟฟ้า";
    },
    headers() {
      return [
        {
          text: "ยศ",
          align: "left",
          value: "rank",
          filter: this.rankFilter,
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
          text: "พื้นที่",
          value: "accommodations[0].room.zone.name",
          filter: this.zoneFilter,
        },
        {
          text: "อาคาร",
          value: "accommodations[0].room.building.name",
          filter: this.buildingFilter,
        },
        {
          text: "เลขห้องพัก",
          value: "accommodations[0].room.roomNo",
        },
        {
          text: "เลขผู้ใช้ไฟ",
          value: "accommodations[0].room.electricityNo",
        },
        {
          text: "เลขมิเตอร์ไฟ",
          value: "accommodations[0].room.electricityMeterNo",
        },
        {
          text: "เดือน",
          value: "accommodations[0].billings[0].created_at",
          filter: this.dateFilter,
        },
        {
          text: "หน่วย",
          value: "accommodations[0].billings[0].unit",
          filterable: false,
        },
        {
          text: "ค่าไฟฟ้า",
          value: "accommodations[0].billings[0].price",
          filter: this.electricAverageFilter,
        },
        {
          text: "สถานะ",
          value: "accommodations[0].billings[0].status",
          filter: this.stateFilter,
        },
        {
          text: "การจัดการ",
          value: "actions",
          align: "center",
          sortable: false,
        },
      ];
    },

    // autocomplete for filter
    zones() {
      const zones = zonesBuildingsRoom;
      const zonedata = zones.map((x) => x.zone);
      return zonedata;
    },
    buildings() {
      if (this.zoneFilterValue == "เขตส่วนกลาง") {
        const buiding = zonesBuildingsRoom;
        const buildingcenters = buiding[0].buildingcenter;
        const buildingCenter = buildingcenters.map((x) => x.buildingName);
        return buildingCenter;
      }
      if (this.zoneFilterValue == "เขตอัษฎางค์") {
        const buiding = zonesBuildingsRoom;
        const buildingAngtadangs = buiding[1].buildingangtadang;
        const buildingAngtadang = buildingAngtadangs.map((x) => x.buildingName);
        return buildingAngtadang;
      }
      if (this.zoneFilterValue == "เขตสุรนารายณ์") {
        const buiding = zonesBuildingsRoom;
        const buildingSuranarais = buiding[2].buildingsuranarai;
        const buildingSuranarai = buildingSuranarais.map((x) => x.buildingName);
        return buildingSuranarai;
      }
      if (this.editedItem.zone == "เขตส่วนกลาง") {
        const buiding = zonesBuildingsRoom;
        const buildingcenters = buiding[0].buildingcenter;
        const buildingCenter = buildingcenters.map((x) => x.buildingName);
        return buildingCenter;
      }
      if (this.editedItem.zone == "เขตอัษฎางค์") {
        const buiding = zonesBuildingsRoom;
        const buildingAngtadangs = buiding[1].buildingangtadang;
        const buildingAngtadang = buildingAngtadangs.map((x) => x.buildingName);
        return buildingAngtadang;
      }
      if (this.editedItem.zone == "เขตสุรนารายณ์") {
        const buiding = zonesBuildingsRoom;
        const buildingSuranarais = buiding[2].buildingsuranarai;
        const buildingSuranarai = buildingSuranarais.map((x) => x.buildingName);
        return buildingSuranarai;
      } else {
        return ["ไม่มีข้อมูล"];
      }
    },
    rooms() {
      if (this.editedItem.building == "2/11") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[0].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/12") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[1].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/13") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[2].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/14") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[3].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/15") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[4].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/16") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[5].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/17") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[6].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/18") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[7].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/19") {
        const buildingcenters =
          zonesBuildingsRoom[1].buildingangtadang[0].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/20") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[0].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/21") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[1].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/22") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[2].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/23") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[3].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/24") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[4].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/25") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[5].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/26") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[6].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/27") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[7].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/28") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[8].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/29") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[9].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/31") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[10].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/32") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[11].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/33") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[12].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/34") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[13].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/35") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[14].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/36") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[15].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/37") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[16].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/38") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[17].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/39") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[18].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/40") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[19].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/41") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[20].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      } else {
        return ["ไม่มีข้อมูล"];
      }
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.getRole();
    this.gettoken();
    this.getZonesdata();
    this.getBuildingsdatas();
    this.getRoomsdatas();
    this.getNameForCreateOldBill();
  },
  mounted() {
    this.getElectricData();
  },
  methods: {
    setPrice() {
      this.pricePerUnit = this.defineUnitPrice;
      this.GGG = true;
    },
    clearPrice() {
      this.defineUnitPrice = null;
      this.GGG = false;
      this.$refs.isFormValid.reset();
    },
    // data for select
    // get name data
    getNameForCreateOldBill() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(apiUrl + "/v1/resident/name", config)
        .then((response) => {
          let data = response.data;
          this.firstNameOldBillData = data.result.firstName;
          this.lastNameOldBillData = data.result.lastName;
        })
        .catch((error) => {
          console.log(error);
        });
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
          this.zonesData = dataZones;
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
        .get(apiUrl + "/v1/building/data/building", config)
        .then((response) => {
          let data = response.data;
          const dataBuilding = data.result;
          this.buildinsData = dataBuilding;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // rooms data for select
    getRoomsdatas() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(apiUrl + "/v1/building/data/room", config)
        .then((response) => {
          let data = response.data;
          const dataRoom = data.result;
          this.roomsData = dataRoom;
          return this.roomsData;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // create old bill
    createOldBill() {
      var data = {
        rank: this.rankOldBill,
        firstName: this.firstNameOldBill,
        lastName: this.lastNameOldBill,
        zone: this.zoneOldbill,
        building: this.buildingOldbill,
        roomNo: this.roomNoOldbill,
        date: this.billCycleOldbill,
        unit: this.unitOldbill,
        price: this.priceOldbill,
        totalPay: this.priceOldbill,
      };
      var config = {
        method: "post",
        url: apiUrl + "/v1/billings/water/add/old-bill",
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
        data: data,
      };
      axios(config)
        .then(() => {
          this.dialogCreateOldBill = false;
          this.snackbar = true;
          this.statusAction =
            "สร้างบิลค่าน้ำของเดือน" + this.billCycleOldbill + "สำเร็จ";
          this.colorSnackbar = "agree";
        })
        .catch((error) => {
          console.log(error);
          this.dialogCreateOldBill = false;
        });
    },
    // get role for user
    getRole() {
      var role = localStorage.getItem("role");
      this.role = role;
    },
    gettoken() {
      var token = sessionStorage.getItem("refreshToken");
      this.token = token;
    },
    // get electric
    getElectricData() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      // var date = "?date=" + this.dateNow;
      return axios
        .get(apiUrl + "/v1/billings/electric", config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            this.electricTable = data.result.billing;
            this.loadTable = false;
          }
        })
        .catch((error) => {
          console.log(error);
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
    exportElectric(billingsIDs) {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
        responseType: "blob",
      };
      const id = { id: billingsIDs };
      return axios
        .post(apiUrl + "/v1/billings/electric/export", id, config)
        .then((response) => {
          FileDownload(
            response.data,
            "ข้อมูลค่าไฟฟ้า" + this.dateNow + ".xlsx"
          );
          this.exportExcelElectric = false;
          this.statusAction =
            "Export ข้อมูลผู้อยู่ใช้ไฟจำนวน " +
            this.selected.length +
            "คน สำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
          this.selected = [];
        })
        .catch((error) => {
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
    // edit billing via API
    editElectricBilling(unit, billing_cycle) {
      let idelectric = "?id=" + this.ElectricBillingID;
      const payload = {
        unit: unit,
        unitPrice: this.pricePerUnit,
        billing_cycle: billing_cycle,
      };
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      return axios
        .patch(
          apiUrl + "/v1/billings/electric/edit" + idelectric,
          payload,
          config
        )
        .then(() => {
          this.getElectricData();
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.status === "unauthorized") {
            this.statusAction = "แก้ไขข้อมูล ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "warning";
            this.snackbar = true;
          } else {
            this.statusAction = "แก้ไขข้อมูล ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
          }
        });
    },
    // create bills
    createElectricityBill() {
      var config = {
        method: "post",
        url: apiUrl + "/v1/billings/electric/add",
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      axios(config)
        .then(async () => {
          this.getElectricData();
          this.statusAction = "สร้างบิลสำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
          this.addElectricBills = false;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.status === "unauthorized") {
            this.statusAction = "แก้ไขข้อมูล ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "warning";
            this.snackbar = true;
            this.addElectricBills = false;
          } else {
            this.statusAction = "แก้ไขข้อมูล ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
            this.addElectricBills = false;
          }
        });
    },
    nameFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.NamefilterValue) {
        return true;
      }
      // Check if the current loop value (The name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.NamefilterValue.toLowerCase());
    },
    zoneFilter(value) {
      if (!this.zoneFilterValue) {
        return true;
      }
      return value === this.zoneFilterValue;
    },
    buildingFilter(value) {
      if (!this.buildingFilterValue) {
        return true;
      }
      return value === this.buildingFilterValue;
    },
    stateFilter(value) {
      if (!this.statusFilterValue) {
        return true;
      }
      return value === this.statusFilterValue;
    },
    // electric average price
    electricAverageFilter(value) {
      if (this.electricAverageFilterValue == "น้อยกว่าค่าเฉลี่ย") {
        return value < 260;
      }
      if (this.electricAverageFilterValue == "มากกว่าค่าเฉลี่ย") {
        return value > 300;
      }
      return true;
    },
    dateFilter(value) {
      if (!this.dateFilterValue) {
        return true;
      }
      return value == this.dateFilterValue;
    },
    editItem(item) {
      this.editedIndex = this.electricTable.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.ElectricBillingID = item.id;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.electricTable[this.editedIndex], this.editedItem);
        this.editElectricBilling(
          this.editedItem.unit,
          this.editedItem.billing_cycle
        );
        this.snackbar = true;
        this.statusAction = "แก้ไขข้อมูลสำเร็จ";
        this.colorSnackbar = "agree";
      } else {
        this.electricTable.push(this.editedItem);
      }
      this.close();
    },
    savea() {
      if (this.editedIndex > -1) {
        Object.assign(this.electricTable[this.editedIndex], this.editedItem);
      } else {
        this.electricTable.push(this.editedItem);
      }
      this.close();
    },
    // clear form
    clearForm() {
      this.$refs.form.reset();
    },
    // clear filter
    clearFilter() {
      (this.buildingFilterValue = ""),
        (this.zoneFilterValue = ""),
        (this.dateFilterValue = "");
      this.statusFilterValue = "";
      this.search = "";
      this.electricAverageFilterValue = "";
    },
    // search in data table
    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
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
    // color of price
    getColor(total_pay) {
      if (total_pay == 0) return "#FF606090";
      if (total_pay >= 300) return "#E6FF007C";
      if (total_pay <= 260) return "#FFBB007C";
      else return "#FFFFFF00";
    },
    // status color
    getColorForStatus(status) {
      if (status == "draft") return "yellow";
      if (status == "in_progress") return "red";
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
</style>
