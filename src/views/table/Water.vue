<template>
  <v-app id="app">
    <!-- title and filter card -->
    <div class="content background-main" v-if="role == 'admin'">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-9">
              <h2>
                <v-icon size="40" color="blue">mdi-water</v-icon> จัดการน้ำประปา
              </h2>
              <h2 v-if="role === 'user'">
                <v-icon size="40" color="blue">mdi-water</v-icon>
                ตารางค่าน้ำประปา
              </h2>
            </div>
          </v-row>
        </div>
      </v-row>
      <!-- filter -->
      <v-card class="card-filter px-6 py-6">
        <!-- title -->
        <v-card-title>
          <v-icon size="35px" class="icon"
            >mdi-format-list-bulleted-triangle</v-icon
          >
          &nbsp;&nbsp;
          <h3>เครื่องมือค้นหา</h3>
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
                    label="เขตพื้นที่"
                    class="filter"
                    :items="zonesData"
                    item-text="name"
                    item-value="name"
                    clearable
                  >
                  </v-autocomplete>
                </v-col>
                <!-- Filter for waterGroup-->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-autocomplete
                    v-model="waterGroupfilterValue"
                    label="สายมิเตอร์"
                    prepend-icon="mdi-home-group"
                    :items="meterGroups"
                    class="filter"
                    clearable
                    item-text="name"
                    item-value="name"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-dialog
                    ref="dialog"
                    v-model="dateFilter"
                    :return-value.sync="date"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dateFilterValue"
                        label="รอบบิล"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="dateFilterValue"
                      type="month"
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="warning" @click="dateFilter = false"
                        >Cancel</v-btn
                      >
                      <v-btn text color="agree" @click="getWaterData()"
                        >OK</v-btn
                      >
                    </v-date-picker>
                  </v-dialog>
                </v-col>
                <!-- Filter for  status-->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-select
                    v-model="stateFilterValue"
                    :items="statuses"
                    prepend-icon="mdi-list-status"
                    label="สถานะ"
                    class="filter"
                    clearable
                    item-text="name"
                    item-value="value"
                  ></v-select>
                </v-col>
                <!-- Fillter for water price -->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-select
                    v-model="waterAverageFilterValue"
                    :items="waterAverages"
                    prepend-icon="mdi-list-status"
                    label="ค่าน้ำเฉลี่ย"
                    class="filter"
                    clearable
                  ></v-select>
                </v-col>
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
              </v-row></v-expansion-panel-content
            >
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </div>
    <!-- button and data table -->
    <v-card class="card-filter px-6 py-6" v-if="role == 'admin'">
      <!-- title and button -->
      <v-card-title>
        <!-- title -->
        <v-icon size="35px" class="icon">mdi-table-large</v-icon>
        &nbsp;&nbsp;
        <h3>ตารางค่าน้ำประปา</h3>
        <v-form v-model="isFormValid">
          <v-responsive max-width="344">
            <v-text-field
              v-model="defineUnitPrice"
              label="กำหนดหน่วยค่าน้ำ"
              clearable
              @keypress="isNumber($event)"
              :rules="rules.priceRule"
              required
              max-width="300px"
              :disabled="this.GGG == true"
            ></v-text-field>
          </v-responsive>
        </v-form>
        <v-btn
          color="green"
          v-if="this.GGG == false"
          outlined
          :disabled="!isFormValid"
          @click="setPrice()"
          >ยืนยัน</v-btn
        >
        <v-btn
          color="red"
          v-if="this.GGG == true"
          outlined
          @click="clearPrice()"
          >ยกเลิกหน่วยค่าน้ำ</v-btn
        >
        <v-spacer></v-spacer>
        <div>
          <!-- create old bill -->
          <v-dialog v-model="dialogCreateOldBill" persistent max-width="60%">
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                class="button-filter pt-5 pb-5"
                color="error"
                v-on="{ ...attrs }"
              >
                <v-icon> mdi-newspaper-plus </v-icon>
                &nbsp; สร้างบิลย้อนหลัง
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <v-icon> mdi-newspaper-plus </v-icon> &nbsp;
                สร้างบิลย้อนหลัง</v-card-title
              >
              <v-card-text>
                <v-form ref="formOldBill" v-model="valid" lazy-validation>
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
                        :search-input.sync="findFirstName"
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
                        item-value="id"
                        :search-input.sync="findLastName"
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
                    <!-- bill cycle -->
                    <v-col cols="12" sm="6" md="4">
                      <v-dialog
                        ref="dialog"
                        v-model="modal1"
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
                          :max="new Date().toISOString()"
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="warning" @click="modal1 = false">
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
                    <!-- before unit -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="beforeUnit"
                        label="หน่วยเดิม"
                        clearable
                        required
                        :rules="rules.buildingRoom"
                        @keypress="isNumber($event)"
                      ></v-text-field>
                    </v-col>
                    <!-- after unit -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="afterUnit"
                        label="หน่วยใหม่"
                        clearable
                        required
                        :rules="rules.buildingRoom"
                        @keypress="isNumber($event)"
                      ></v-text-field>
                    </v-col>
                    <!-- unit -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="unitOldbill"
                        label="หน่วยน้ำ"
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
                        label="ค่าน้ำ"
                        clearable
                        required
                        :rules="rules.buildingRoom"
                        @keypress="isNumber($event)"
                      ></v-text-field>
                    </v-col>
                    <!-- price diff -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="priceDiffOldBill"
                        label="ค่าน้ำส่วนต่าง"
                        clearable
                        required
                        :rules="rules.buildingRoom"
                        @keypress="isNumber($event)"
                      ></v-text-field>
                    </v-col>
                    <!-- total pay -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="totalPayOldBill"
                        label="ค่าน้ำรวม"
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
                <v-btn color="error" text @click="dialogCreateOldBill = false"
                  >ยกเลิก</v-btn
                >
                <v-btn
                  color="agree"
                  :disabled="!valid"
                  text
                  @click="createOldBill"
                  >ยืนยัน</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end of create old bill -->
          <!-- add bills in this month -->
          <v-dialog v-model="dialogAddWater" persistent max-width="25%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="button-filter pt-5 pb-5"
                color="agree"
                dark
                v-bind="attrs"
                v-on="on"
              >
                สร้างบิลเดือนปัจจุบัน
              </v-btn>
            </template>
            <v-card>
              <v-card-title> สร้างบิลเดือนปัจจุบัน </v-card-title>
              <v-card-text></v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="dialogAddWater = false">
                  ยกเลิก
                </v-btn>
                <v-btn color="agree" text @click="createBillsInMonth">
                  ตกลง
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- water diff_price_cal -->
          <v-dialog
            v-model="differencePriceCalculate"
            persistent
            max-width="60%"
          >
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                class="button-filter pt-5 pb-5"
                color="#1B99A1"
                dark
                v-on="{ ...attrs }"
              >
                <v-icon> mdi-calculator </v-icon>
                &nbsp; คำนวณค่าน้ำส่วนต่าง
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <v-icon> mdi-calculator </v-icon> &nbsp;
                คำนวณค่าน้ำส่วนต่าง</v-card-title
              >
              <v-card-text>
                <!-- new changed  version ╰(▔∀▔)╯  ╰(▔∀▔)╯ -->
                <v-form ref="formDiffPrice" v-model="valid" lazy-validation>
                  <v-row>
                    <!-- zone  -->
                    <v-col cols="6">
                      <v-autocomplete
                        v-model="zoneCalculate"
                        label="เขตพื้นที่"
                        prepend-icon="mdi-home-city-outline"
                        required
                        :items="zonesData"
                        :rules="rules.buildingRoom"
                        item-text="name"
                        item-value="id"
                        :search-input.sync="search1"
                      >
                      </v-autocomplete>
                    </v-col>
                    <!-- meter group -->
                    <v-col cols="6">
                      <v-autocomplete
                        v-model="waterGroupCalculate"
                        label="สายมิเตอร์น้ำ"
                        prepend-icon="mdi-home-group"
                        required
                        :items="waterZonesData"
                        :rules="rules.buildingRoom"
                        item-text="name"
                        item-value="id"
                      >
                      </v-autocomplete>
                    </v-col>
                    <!-- meter zone -->
                    <v-col cols="6">
                      <v-text-field
                        v-model.number="meterZone"
                        required
                        label="ค่าน้ำจากมิเตอร์ใหญ่"
                        prepend-icon="mdi-car-speed-limiter"
                        @keypress="isNumber($event)"
                        :rules="rules.buildingRoom"
                        v-on:keyup="checkEnterPressedToSubmit"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="close">ยกเลิก</v-btn>
                <v-btn
                  color="agree"
                  :disabled="!valid"
                  text
                  @click="validateDiffprice"
                  >ยืนยัน</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- edit water -->
          <v-dialog v-model="dialog" persistent max-width="75%">
            <v-card>
              <v-card-title>
                <span>{{ formTitle }}</span>
              </v-card-title>
              <v-card-subtitle v-if="this.GGG == false">
                <span style="color: red"> กรุณากำหนดราคาหน่วยค่าไฟฟ้า</span>
              </v-card-subtitle>
              <v-card-text>
                <v-container>
                  <v-form ref="formEditwater" v-model="valid" lazy-validation>
                    <v-row>
                      <!-- rank -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.rank"
                          :items="ranks"
                          label="ยศ"
                          required
                          :rules="rules.buildingRoom"
                          disabled
                          item-text="name"
                          item-value="value"
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- firstname -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.firstName"
                          label="ชื่อ"
                          required
                          :rules="rules.name"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- lasname -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.lastName"
                          label="นามสกุล"
                          required
                          :rules="rules.name"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- old unit -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          autofocus
                          v-model="oldUnit"
                          label="หน่วยน้ำเดือนก่อน"
                          @keypress="isNumber($event)"
                          required
                          suffix="หน่วย"
                          :rules="rules.buildingRoom"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- new unit -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          autofocus
                          v-model="editedItem.newUnit"
                          label="หน่วยน้ำเดือนปัจจุบัน"
                          @keypress="isNumber($event)"
                          required
                          suffix="หน่วย"
                          :rules="rules.buildingRoom"
                        ></v-text-field>
                      </v-col>
                      <!-- water unit -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.status"
                          label="สถานะ"
                          required
                          :items="statuses"
                          item-text="name"
                          item-value="value"
                        >
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <!-- button -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-form ref="formButton" v-model="valid" lazy-validation>
                  <v-btn color="warning" text @click="close"> ยกเลิก </v-btn>
                  <v-btn v-if="this.GGG == false" color="agree" disabled text>
                    ยืนยัน
                  </v-btn>
                  <v-btn
                    v-if="this.GGG == true"
                    color="agree"
                    :disabled="!valid"
                    text
                    @click="save()"
                  >
                    ยืนยัน
                  </v-btn>
                </v-form>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- status chenge -->
          <v-dialog v-model="statusChenge" persistent width="25%">
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                class="button-filter pt-5 pb-5"
                color="#FB929E"
                v-on="{ ...attrs }"
                :disabled="!selectItems"
              >
                เปลี่ยนสถานะ
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="text-h5"> เปลี่ยนสถานะ </v-card-title>
              <v-card-text>
                <v-autocomplete
                  v-model="statusChanger"
                  label="สถานะ"
                  :items="statuses"
                  item-text="name"
                  item-value="value"
                  autofocus
                  required
                  :rules="rules.buildingRoom"
                >
                </v-autocomplete>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="statusChenge = false">
                  ยกเลิก
                </v-btn>
                <v-btn color="agree" text @click="getID()"> ตกลง </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- export excel -->
          <v-dialog v-model="exportExcelwater" max-width="75%" persistent>
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                color="#f8ce01"
                class="button-filter pt-5 pb-5"
                v-on="{ ...attrs }"
                :disabled="!selectItems"
              >
                <v-icon> mdi-file-export-outline </v-icon>
                &nbsp; Export ข้อมูล
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                ต้องการ export ข้อมูลเป็นรูปแบบ Excel ที่เลือกไว้หรือไม่ ?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="exportExcelwater = false">
                  ยกเลิก
                </v-btn>
                <v-btn color="agree" text @click="getbillingsID">
                  ยืนยัน
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
          :items="waterTables"
          item-key="id"
          :items-per-page="5"
          class="elevation-1 pa-6 th-1"
          :search="search"
          :loading="loadTable"
          loading-text="กำลังโหลด... โปรดรอสักครู่"
          show-select
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @input="enterSelect($event)"
          id="virtual-scroll-table"
          v-scroll:#virtual-scroll-table="onScroll"
        >
          <template #item.full_name="{ item }"
            >{{ item.rank }} {{ item.firstName }} {{ item.lastName }}</template
          >
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
            <td v-if="item.accommodations[0].billings[0].status === 'un_paid'">
              <v-chip
                :color="
                  getColorStatus(item.accommodations[0].billings[0].status)
                "
              >
                {{ "ยังไม่จ่าย" }}
              </v-chip>
            </td>
            <td v-if="item.accommodations[0].billings[0].status === 'paid'">
              <v-chip
                dark
                :color="
                  getColorStatus(item.accommodations[0].billings[0].status)
                "
              >
                {{ "จ่ายแล้ว" }}
              </v-chip>
            </td>
          </template>
          <!-- editor -->
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
import axios from "axios";
import { apiUrl } from "../../utils/url";
import zonesBuildingsRoom from "../../json/zonesBuildings.json";
import water_groups from "../../json/waterGroups.json";
import NotFound from "../../components/notFound/Notfound.vue";
import FileDownload from "js-file-download";
export default {
  components: { NotFound },
  data: () => ({
    statusChanger: "",
    statusChenge: false,
    beforeUnit: "",
    afterUnit: "",
    modal1: "",
    search1: "",
    findFirstName: "",
    findLastName: "",
    zoneCalculate: "",
    dateFilter: false,
    dateFilterValue: new Date().toISOString().substr(0, 7),
    GGG: false,
    isFormValid: false,
    firstNameOldBillData: [],
    lastNameOldBillData: [],
    rankOldBill: "",
    firstNameOldBill: "",
    lastNameOldBill: "",
    zoneOldbill: "",
    waterZoneOldbill: "",
    buildingOldbill: "",
    roomNoOldbill: "",
    billCycleOldbill: "",
    unitOldbill: "",
    priceOldbill: "",
    priceDiffOldBill: "",
    totalPayOldBill: "",
    zonesData: [],
    waterZonesData: [],
    buildingsData: [],
    roomsData: [],
    dialogCreateOldBill: false,
    dialogAddWater: false,
    zonesBuildingsRoom: zonesBuildingsRoom,
    role: "",
    waterAverageFilterValue: "",
    waterAverages: ["น้อยกว่าค่าเฉลี่ย", "มากกว่าค่าเฉลี่ย"],
    loadTable: true,
    snackbar: false,
    statusAction: "",
    colorSnackbar: "",
    timeout: 2000,
    el: "#app",
    sortBy: "first_name",
    menuDatefilter: false,
    sortDesc: false,
    oldUnit: "",
    currentUnit: null,
    selected: [],
    attrs: {},
    on: {},
    selectItems: false,
    valid: true,
    meterSum: null,
    meterZone: null,
    numberOfroom: "",
    rank: null,
    price_diff: null,
    ranks: ranks,
    modal: false,
    meter_group: null,
    meterGroups: water_groups,
    dialog: false,
    emailtarget: "",
    date_now: new Date().toISOString().substr(0, 7),
    dateNow: new Date(),
    differencePriceCalculate: false,
    exportExcelwater: false,
    menu: false,
    search: "",
    // Filter models
    NamefilterValue: "",
    waterGroupfilterValue: "",
    waterGroupCalculate: "",
    buildingFilterValue: "",
    zoneFilterValue: "",
    date: "",
    WaterBillingID: "",
    stateFilterValue: "",
    statuses: statuses,
    pricePerUnit: "",
    defineUnitPrice: "",
    waterTables: [],
    editedIndex: -1,
    start: 0,
    rowHeight: 24,
    perPage: 25,
    zoneIds: "",
    selectedHeaders: [],
    editedItem: {
      first_name: "",
      zone: "",
      building: "",
      room: "",
      water_no: "",
      water_meter_no: "",
      difference_price: "",
      billing_cycle: new Date().toISOString().substr(0, 7),
      status: "",
    },
    defaultItem: {
      first_name: "",
      zone: "",
      building: "",
      room: "",
      water_no: "",
      water_meter_no: "",
      difference_price: "",
      sum_price: "",
      billing_cycle: new Date().toISOString().substr(0, 7),
      status: "",
    },
    rules: {
      format: [
        (value) => !value || value.size < 20000000 || "ขนาดไฟล์ไม่เกิน 20 MB",
      ],
      email: {
        required: (v) => !!v || "กรุณาใส่อีเมลของผู้รับ",
        regex: (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "อีเมลไม่ถูกต้อง",
      },
      name: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 2) || "กรอกชื่อให้มากกว่า 2 ตัวอักษร",
      ],
      waterNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 4) || "กรอกเลขผู้ใช้น้ำประปาไม่ครบ 4 ตัว",
      ],
      waterMeterNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 4) || "กรอกเลขมิเตอร์น้ำประปาไม่ครบ 4 ตัว",
      ],
      buildingRoom: [(v) => !!v || "กรุณากรอกข้อมูล"],
      priceRule: [(v) => !!v || "กรุณากรอกข้อมูล"],
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มค่าน้ำ" : "แก้ไขค่าน้ำ";
    },
    // header table
    headers() {
      return [
        { text: "ชื่อ", value: "full_name" },
        {
          text: "เขตพื้นที่",
          value: "accommodations[0].room.zone.name",
          filter: this.zoneFilter,
        },
        {
          text: "สายของมิเตอร์",
          value: "accommodations[0].room.waterZone.name",
          filter: this.groupFilter,
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
          text: "หน่วยเก่า",
          value: "accommodations[0].billings[0].beforeUnit",
        },
        {
          text: "หน่วยปัจจุบัน",
          value: "accommodations[0].billings[0].afterUnit",
        },
        {
          text: "จำนวนหน่วย",
          value: "accommodations[0].billings[0].unit",
        },
        {
          text: "ค่าน้ำ",
          value: "accommodations[0].billings[0].price",
        },
        {
          text: "ส่วนต่าง",
          value: "accommodations[0].billings[0].price_diff",
        },
        {
          text: "ค่าน้ำรวม",
          value: "accommodations[0].billings[0].total_pay",
          filter: this.waterAverageFilter,
        },
        {
          text: "สถานะ",
          value: "accommodations[0].billings[0].status",
          filter: this.stateFilter,
        },
        {
          text: "แก้ไข",
          value: "actions",
          sortable: false,
        },
      ];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    search1: function () {
      this.zoneIds = this.zoneCalculate;
      this.getWaterZonesdata();
    },
    findFirstName: function () {
      this.getNameForCreateOldBill();
    },
    findLastName: function () {
      this.getLastNameForCreateOldBill();
    },
  },

  created() {
    this.gettoken();
    this.getRole();
    this.getZonesdata();
    this.getWaterZonesdata();
  },

  beforeMount() {
    this.getWaterData();
  },

  methods: {
    statusesChenge(billingIDs) {
      var data = {
        id: billingIDs,
        status: this.statusChanger,
      };
      var config = {
        method: "post",
        url: apiUrl + "/v1/billings/water/status-change",
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
        data: data,
      };
      axios(config)
        .then(() => {
          this.statusChenge = false;
          this.statusChanger = "";
          this.selected = [];
          this.getWaterData();
          this.snackbar = true;
          this.statusAction = "แก้ไขสถานะบิลสำเร็จ";
          this.colorSnackbar = "agree";
        })
        .catch((error) => {
          this.statusChenge = false;
          this.statusChanger = "";
          this.selected = [];
          this.getWaterData();
          this.snackbar = true;
          this.statusAction = "แก้ไขสถานะบิลไม่สำเร็จ";
          this.colorSnackbar = "warning";
          console.log(error);
        });
    },
    setPrice() {
      this.pricePerUnit = this.defineUnitPrice;
      this.GGG = true;
    },
    clearPrice() {
      this.defineUnitPrice = null;
      this.GGG = false;
      this.$refs.isFormValid.reset();
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
          return this.zonesData;
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
          apiUrl + "/v1/building/data/waterzone" + "?id=" + this.zoneIds,
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
    getNameForCreateOldBill() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(apiUrl + "/v1/resident/name" + "?rank=" + this.rankOldBill, config)
        .then((response) => {
          let data = response.data;
          this.firstNameOldBillData = data.result;
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
          apiUrl + "/v1/resident/last-name" + "?id=" + this.firstNameOldBill,
          config
        )
        .then((response) => {
          let data = response.data;
          this.lastNameOldBillData = data.result;
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
        date: this.billCycleOldbill,
        beforeUnit: this.beforeUnit,
        afterUnit: this.afterUnit,
        unit: this.unitOldbill,
        price: this.priceOldbill,
        priceDiff: this.priceDiffOldBill,
        totalPay: this.totalPayOldBill,
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
          this.statusAction = "สร้างบิลค่าน้ำสำเร็จ";
          this.colorSnackbar = "agree";
        })
        .catch((error) => {
          this.dialogCreateOldBill = false;
          this.snackbar = true;
          this.statusAction = "สร้างบิลค่าน้ำไม่สำเร็จ";
          this.colorSnackbar = "warning";
          console.log(error);
          this.dialogCreateOldBill = false;
        });
    },
    getRole() {
      var role = localStorage.getItem("role");
      this.role = role;
    },
    gettoken() {
      var token = sessionStorage.getItem("refreshToken");
      this.token = token;
    },
    // get water data from api
    getWaterData() {
      let date = "?date=" + this.dateFilterValue;
      const config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      return axios
        .get(apiUrl + "/v1/billings/water" + date, config)
        .then((response) => {
          let data = response.data;
          console.log(data);
          if (data.status == "success") {
            this.waterTables = [];
            this.loadTable = false;
            this.waterTables = data.result.billing;
            this.dateFilter = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // color of price
    getColor(total_pay) {
      if (total_pay == 0) return "error";
      if (total_pay >= 200) return "#E6FF007C";
      if (total_pay <= 150) return "#FFBB007C";
      else return "#FFFFFF00";
    },
    // create bill this month
    createBillsInMonth() {
      var config = {
        method: "post",
        url: apiUrl + "/v1/billings/water/add",
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      axios(config)
        .then(() => {
          this.dialogAddWater = false;
          this.getWaterData();
          this.statusAction =
            "เพิ่มบิลค่าน้ำประปาของรอบ " + this.date_now + " สำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
        })
        .catch((error) => {
          if (error.response.data.error_message == "unprocessable_entity") {
            this.statusAction = "เพิ่มบิลค่าน้ำเดือนนี้ไปแล้ว ";
            this.colorSnackbar = "warning";
            this.snackbar = true;
            this.dialogAddWater = false;
          } else {
            this.statusAction =
              "เพิ่มบิลค่าน้ำประปาของรอบ " + this.date_now + " ไม่สำเร็จ";
            this.colorSnackbar = "error";
            this.snackbar = true;
            this.dialogAddWater = false;
          }
        });
    },
    // color for status
    getColorStatus(status) {
      if (status == "un_paid") return "error";
      else return "agree";
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
    // enter diff price
    async checkEnterPressedToSubmit(e) {
      if (e.keyCode === 13) this.validateDiffprice();
    },
    // validate diff price
    validateDiffprice() {
      if (this.$refs.formDiffPrice.validate()) {
        this.calculateWaterPrice(this.meterZone);
      }
    },
    // calculate Price diff with api
    calculateWaterPrice(meterZone) {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      const price = { price: meterZone };
      const zoneID = "?id=" + this.waterGroupCalculate;
      return axios
        .post(apiUrl + "/v1/billings/water/diff" + zoneID, price, config)
        .then(() => {
          this.statusAction = "คำนวณค่าน้ำส่วนต่าง" + "สำเร็จ";
          this.waterGroupCalculate = "";
          this.meterZone = "";
          this.differencePriceCalculate = false;
          this.colorSnackbar = "agree";
          this.snackbar = true;
          this.getWaterData();
          this.$refs.formDiffPrice.resetValidation();
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.status === "invalid refresh token") {
            this.statusAction =
              "คำวนวนค่าน้ำส่วนต่าง ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
          }
          if (error.response.data.status === "unprocessable_entity") {
            this.statusAction =
              "คำวนวนค่าน้ำส่วนต่าง ไม่สำเร็จ กรุณาเลือกสายมิเตอร์ที่ยังไม่คำนวณ";
            this.colorSnackbar = "warning";
            this.snackbar = true;
          }
          this.differencePriceCalculate = false;
        });
    },
    // get selected id
    getbillingsID() {
      if (this.selectItems == true) {
        const billingsIDs = [];
        for (let i = 0; i < this.selected.length; i++) {
          billingsIDs.push(this.selected[i].id);
        }
        this.exportWater(billingsIDs);
      }
    },
    getID() {
      if (this.selectItems == true) {
        const billingIDs = [];
        for (let i = 0; i < this.selected.length; i++) {
          billingIDs.push(this.selected[i].accommodations[0].billings[0].id);
        }
        console.log(billingIDs);
        this.statusesChenge(billingIDs);
      }
    },
    // export with api
    exportWater(billingsIDs) {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
        responseType: "blob",
      };
      const id = { id: billingsIDs };
      return axios
        .post(apiUrl + "/v1/billings/water/export", id, config)
        .then((response) => {
          FileDownload(response.data, "ข้อมูลค่าน้ำ" + this.dateNow + ".xlsx");
          // this.getWaterData();
          this.exportExcelwater = false;
          this.statusAction =
            "Export ข้อมูลผู้อยู่ใช้น้ำจำนวน " +
            this.selected.length +
            "คน สำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
          this.selected = [];
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
            this.differencePriceCalculate = false;
          } else {
            this.statusAction = "Export ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
            this.differencePriceCalculate = false;
          }
        });
    },
    // edit billing via API
    editWaterBilling() {
      let idwater = "?id=" + this.WaterBillingID;
      const payload = {
        oldUnit: this.oldUnit,
        newUnit: this.editedItem.newUnit,
        unitPrice: this.pricePerUnit.trim(),
        status: this.editedItem.status,
      };
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      return axios
        .patch(apiUrl + "/v1/billings/water/edit" + idwater, payload, config)
        .then(() => {
          this.getWaterData();
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

    nameFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.NamefilterValue) {
        return true;
      }
      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.NamefilterValue.toLowerCase());
    },
    zoneFilter(value) {
      if (!this.zoneFilterValue) {
        return true;
      }
      return value === this.zoneFilterValue;
    },
    waterAverageFilter(value) {
      if (this.waterAverageFilterValue == "น้อยกว่าค่าเฉลี่ย") {
        return value <= 150;
      }
      if (this.waterAverageFilterValue == "มากกว่าค่าเฉลี่ย") {
        return value >= 200;
      }
      return true;
    },
    groupFilter(value) {
      if (!this.waterGroupfilterValue) {
        return true;
      }
      return value === this.waterGroupfilterValue;
    },
    buildingFilter(value) {
      if (!this.buildingFilterValue) {
        return true;
      }
      return value === this.buildingFilterValue;
    },
    stateFilter(value) {
      if (!this.stateFilterValue) {
        return true;
      }
      return value === this.stateFilterValue;
    },
    editItem(item) {
      this.oldUnit = item.accommodations[0].billings[0].beforeUnit;
      this.editedIndex = this.waterTables.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.WaterBillingID = item.id;
    },
    close() {
      this.dialog = false;
      this.differencePriceCalculate = false;
      this.$refs.formOldBill.resetValidation();
      this.$refs.formDiffPrice.resetValidation();
      this.$refs.formButton.resetValidation();
      this.$refs.formEditwater.resetValidation();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.waterTables[this.editedIndex], this.editedItem);
        this.editWaterBilling(
          this.editedItem.newUnit,
          this.oldUnit,
          this.editedItem.price,
          this.editedItem.status,
          this.editedItem.billing_cycle
        );
        this.snackbar = true;
        this.statusAction = "แก้ไขข้อมูลสำเร็จ";
        this.colorSnackbar = "agree";
        this.$refs.formEditwater.resetValidation();
      } else {
        this.waterTables.push(this.editedItem);
      }
      this.$refs.formEditwater.resetValidation();
      this.close();
    },
    clearFilter() {
      (this.NamefilterValue = ""),
        (this.waterGroupfilterValue = ""),
        (this.buildingFilterValue = ""),
        (this.stateFilterValue = ""),
        (this.zoneFilterValue = "");
      this.search = "";
      this.waterAverageFilterValue = "";
    },
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
    onScroll(e) {
      // debounce if scrolling fast
      this.timeout && clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        const { scrollTop } = e.target;
        const rows = Math.ceil(scrollTop / this.rowHeight);

        this.start =
          rows + this.perPage > this.waterTables.length
            ? this.waterTables.length - this.perPage
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
#virtual-scroll-table {
  max-height: 400px;
  overflow: auto;
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
</style>
