<template>
  <v-app id="app">
    <!-- title  -->
    <div class="content background-main" v-if="role === 'admin'">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-9">
              <h2>
                <v-icon size="40" color="gray"> mdi-home-circle </v-icon>
                จัดการหอพัก
              </h2>
            </div>
          </v-row>
        </div>
      </v-row>
    </div>
    <!-- filter -->
    <v-card class="card-filter px-6 py-6" v-if="role === 'admin'">
      <v-card-title>
        <v-icon size="35px" class="icon"
          >mdi-format-list-bulleted-triangle</v-icon
        >
        &nbsp;&nbsp;
        <h3>เครื่องมือค้นหา</h3>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header> แสดงเพิ่มเติม </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-form ref="formFilter">
              <!-- filter -->
              <v-row class="px-3">
                <!-- search -->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-text-field
                    v-model="search"
                    prepend-icon="mdi-magnify"
                    type="text"
                    label="ค้นหา"
                    clearable
                    class="filter"
                  ></v-text-field>
                </v-col>
                <!-- Filter for  zone-->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-autocomplete
                    v-model="zoneFilterValue"
                    prepend-icon="mdi-map-marker-radius"
                    type="text"
                    label="ค้นหาด้วยพื้นที่"
                    clearable
                    class="filter"
                    item-text="name"
                    item-value="name"
                    :items="zonesData"
                  >
                  </v-autocomplete>
                </v-col>
                <!-- water zone filter -->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-autocomplete
                    item-text="name"
                    item-value="name"
                    v-model="waterGroupFilterValue"
                    prepend-icon="mdi-water-circle"
                    type="text"
                    label="ค้นหาด้วยสายมิเตอร์น้ำประปา"
                    clearable
                    class="filter"
                    :items="waterZonesData"
                  >
                  </v-autocomplete>
                </v-col>
                <!-- search by building -->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-autocomplete
                    v-model="buildFilterValue"
                    prepend-icon="mdi-office-building-marker"
                    type="text"
                    label="ค้นหาด้วยอาคาร"
                    clearable
                    class="filter"
                    :items="buildinsData"
                    item-text="name"
                    item-value="name"
                  >
                  </v-autocomplete>
                </v-col>
                <!-- search by type -->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-select
                    item-text="name"
                    item-value="value"
                    v-model="typeFilterValue"
                    prepend-icon="mdi-shape-outline"
                    label="ค้นหาด้วยประเภทห้อง"
                    :items="room_types"
                    clearable
                    class="filter"
                  >
                  </v-select>
                </v-col>
                <!-- search by status -->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-select
                    item-text="name"
                    item-value="value"
                    v-model="statusFilterValue"
                    prepend-icon="mdi-list-status"
                    label="ค้นหาด้วยสถานะ"
                    :items="room_statuses"
                    clearable
                    class="filter"
                  >
                  </v-select>
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
            </v-form>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <!-- table and buttons -->
    <v-row v-if="role === 'admin'">
      <v-col cols="12">
        <v-card class="card-filter px-6 py-6">
          <v-card-title>
            <v-icon size="35px" class="icon">mdi-table-large</v-icon>
            &nbsp;&nbsp;
            <h3>ตารางสถานะห้องพัก</h3>
            &nbsp;&nbsp;
            <!-- delete as selected -->
            <v-btn
              color="error"
              class="button-filter pt-5 pb-5"
              :disabled="!selectItems"
              @click="getRoomsID()"
            >
              <v-icon>mdi-delete-sweep</v-icon>
              &nbsp; ลบข้อมูลที่เลือก
            </v-btn>
            <v-spacer></v-spacer>
            <div>
              <!-- edit zone building water zone -->
              <v-dialog v-model="editZoneBuildings" persistent max-width="45%">
                <template v-slot:activator="{ on: attrs }">
                  <v-btn
                    color="#482121"
                    dark
                    v-on="{ ...attrs }"
                    class="button-filter pt-5 pb-5"
                  >
                    <v-icon> mdi-notebook-edit-outline </v-icon>
                    &nbsp; แก้ไขพื้นที่และอิ่น ๆ
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title> แก้ไขพื้นที่และอื่น ๆ </v-card-title>
                  <v-card-text>
                    <div>
                      <v-expansion-panels variant="popout" class="my-4">
                        <!-- zone -->
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            แก้ไขหรือลบพื้นที่
                          </v-expansion-panel-header>
                          <!-- content -->
                          <v-expansion-panel-content>
                            <!-- edit -->
                            <v-dialog
                              v-model="editZoneTableData"
                              persistent
                              max-width="45%"
                            >
                              <v-card>
                                <v-card-title> แก้ไขพื้นที่ </v-card-title>
                                <v-card-text>
                                  <v-container>
                                    <v-form
                                      ref="formEditZones"
                                      v-model="valid"
                                      lazy-validation
                                    >
                                      <v-row>
                                        <!-- zone -->
                                        <v-text-field
                                          v-model="editZones.zone"
                                          label="เขตพื้นที่"
                                          required
                                          clearable
                                          autofocus
                                          :rules="rules.zonesBuildingsRoom"
                                        ></v-text-field>
                                      </v-row>
                                    </v-form>
                                  </v-container>
                                </v-card-text>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-form
                                    ref="form"
                                    v-model="valid"
                                    lazy-validation
                                  >
                                    <v-btn
                                      large
                                      color="error"
                                      text
                                      @click="editZoneTableData = false"
                                    >
                                      ยกเลิก
                                    </v-btn>
                                    <v-btn
                                      large
                                      color="agree"
                                      :disabled="!valid"
                                      text
                                      @click="editZonesSubmit"
                                    >
                                      ยืนยัน
                                    </v-btn>
                                  </v-form>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                            <!-- delete -->
                            <v-dialog
                              v-model="deleteZoneDialog"
                              persistent
                              max-width="45%"
                            >
                              <v-card>
                                <v-card-title> ลบพื้นที่ </v-card-title>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-form
                                    ref="form"
                                    v-model="valid"
                                    lazy-validation
                                  >
                                    <v-btn
                                      large
                                      color="error"
                                      text
                                      @click="deleteZoneDialog = false"
                                    >
                                      ยกเลิก
                                    </v-btn>
                                    <v-btn
                                      large
                                      color="agree"
                                      :disabled="!valid"
                                      text
                                      @click="deleteZonesSubmit"
                                    >
                                      ยืนยัน
                                    </v-btn>
                                  </v-form>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                            <!-- data table -->
                            <v-data-table
                              :headers="zonesDataTable"
                              :items="zonesDataTables"
                              class="elevation-1"
                            >
                              <template v-slot:[`item.actions`]="{ item }">
                                <v-icon @click="editZones(item)">
                                  mdi-pencil
                                </v-icon>
                                <v-icon @click="deleteZone(item)">
                                  mdi-delete
                                </v-icon>
                              </template>
                            </v-data-table>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                        <!-- water zone -->
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            แก้ไขหรือลบสายมิเตอร์น้ำ
                          </v-expansion-panel-header>
                          <!-- content -->
                          <v-expansion-panel-content>
                            <!--  -->
                            <!-- edit -->
                            <v-dialog
                              v-model="editWaterZoneDialog"
                              persistent
                              max-width="45%"
                            >
                              <v-card>
                                <v-card-title>
                                  แก้ไขสายมิเตอร์น้ำ
                                </v-card-title>
                                <v-card-text>
                                  <v-container>
                                    <v-form
                                      ref="formEditZones"
                                      v-model="valid"
                                      lazy-validation
                                    >
                                      <v-row>
                                        <!-- zone -->
                                        <v-text-field
                                          v-model="editWaterZone.waterZone"
                                          label="สายมิเตอร์น้ำ"
                                          required
                                          clearable
                                          autofocus
                                          :rules="rules.zonesBuildingsRoom"
                                        ></v-text-field>
                                      </v-row>
                                    </v-form>
                                  </v-container>
                                </v-card-text>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-form
                                    ref="form"
                                    v-model="valid"
                                    lazy-validation
                                  >
                                    <v-btn
                                      large
                                      color="error"
                                      text
                                      @click="editWaterZoneDialog = false"
                                    >
                                      ยกเลิก
                                    </v-btn>
                                    <v-btn
                                      large
                                      color="agree"
                                      :disabled="!valid"
                                      text
                                      @click="editWaterZoneSubmit"
                                    >
                                      ยืนยัน
                                    </v-btn>
                                  </v-form>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                            <!-- delete -->
                            <v-dialog
                              v-model="deleteWaterZoneDialog"
                              persistent
                              max-width="45%"
                            >
                              <v-card>
                                <v-card-title> ลบสายมิเตอร์น้ำ </v-card-title>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-form
                                    ref="form"
                                    v-model="valid"
                                    lazy-validation
                                  >
                                    <v-btn
                                      large
                                      color="error"
                                      text
                                      @click="deleteWaterZoneDialog = false"
                                    >
                                      ยกเลิก
                                    </v-btn>
                                    <v-btn
                                      large
                                      color="agree"
                                      text
                                      @click="deleteWaterZoneSubmit"
                                    >
                                      ยืนยัน
                                    </v-btn>
                                  </v-form>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                            <v-data-table
                              :headers="waterZonesDataTable"
                              :items="waterZonesDataTables"
                              class="elevation-1"
                            >
                              <template v-slot:[`item.actions`]="{ item }">
                                <v-icon @click="editWaterZone(item)">
                                  mdi-pencil
                                </v-icon>
                                <v-icon @click="deleteWaterZone(item)">
                                  mdi-delete
                                </v-icon>
                              </template>
                            </v-data-table>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                        <!-- building -->
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            แก้ไขหรือลบอาคาร
                          </v-expansion-panel-header>
                          <!-- content -->
                          <v-expansion-panel-content>
                            <!-- edit -->
                            <v-dialog
                              v-model="buildingTableEdit"
                              persistent
                              max-width="75%"
                            >
                              <v-card>
                                <v-card-title> แก้ไขอาคาร </v-card-title>
                                <v-card-text>
                                  <v-container>
                                    <v-form
                                      ref="formEditZones"
                                      v-model="valid"
                                      lazy-validation
                                    >
                                      <v-row>
                                        <!-- zone -->
                                        <v-text-field
                                          v-model="editBuildingZone.building"
                                          label="อาคาร"
                                          required
                                          clearable
                                          autofocus
                                          :rules="rules.zonesBuildingsRoom"
                                        ></v-text-field>
                                      </v-row>
                                    </v-form>
                                  </v-container>
                                </v-card-text>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-form
                                    ref="form"
                                    v-model="valid"
                                    lazy-validation
                                  >
                                    <v-btn
                                      large
                                      color="error"
                                      text
                                      @click="editWaterZoneDialog = false"
                                    >
                                      ยกเลิก
                                    </v-btn>
                                    <v-btn
                                      large
                                      color="agree"
                                      :disabled="!valid"
                                      text
                                      @click="editBuildingSubmit"
                                    >
                                      ยืนยัน
                                    </v-btn>
                                  </v-form>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                            <!-- delete -->
                            <v-dialog
                              v-model="deleteBuildingDialog"
                              persistent
                              max-width="45%"
                            >
                              <v-card>
                                <v-card-title> ลบอาคาร </v-card-title>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-btn
                                    large
                                    color="error"
                                    text
                                    @click="deleteWaterZoneDialog = false"
                                  >
                                    ยกเลิก
                                  </v-btn>
                                  <v-btn
                                    large
                                    color="agree"
                                    text
                                    @click="deleteBuildingSubmit"
                                  >
                                    ยืนยัน
                                  </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                            <v-data-table
                              :headers="buildingsDataTable"
                              :items="buildingsDataTables"
                              class="elevation-1"
                            >
                              <template v-slot:[`item.actions`]="{ item }">
                                <v-icon @click="editBuildingZone(item)">
                                  mdi-pencil
                                </v-icon>
                                <v-icon @click="deleteBuilding(item)">
                                  mdi-delete
                                </v-icon>
                              </template>
                            </v-data-table>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-btn
                        large
                        color="error"
                        text
                        @click="editZoneBuildings = false"
                      >
                        ยกเลิก
                      </v-btn>
                    </v-form>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- add zone -->
              <v-dialog v-model="dialogAddZone" persistent max-width="40%">
                <template v-slot:activator="{ on: attrs }">
                  <v-btn
                    color="#0F6292"
                    dark
                    v-on="{ ...attrs }"
                    class="button-filter pt-5 pb-5"
                  >
                    <v-icon> mdi-island </v-icon>
                    &nbsp; เพิ่มพื้นที่
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title> เพิ่มพื้นที่ </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-form ref="addZone" v-model="valid" lazy-validation>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              v-model="addZone"
                              label="พื้นที่"
                              clearable
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-btn
                        large
                        color="error"
                        text
                        @click="dialogAddZone = false"
                      >
                        ยกเลิก
                      </v-btn>
                      <v-btn
                        large
                        color="agree"
                        :disabled="!valid"
                        text
                        @click="createZone"
                      >
                        ยืนยัน
                      </v-btn>
                    </v-form>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- add water zone -->
              <v-dialog v-model="dialogAddWaterZone" persistent max-width="40%">
                <template v-slot:activator="{ on: attrs }">
                  <v-btn
                    color="#1B99A1"
                    dark
                    v-on="{ ...attrs }"
                    class="button-filter pt-5 pb-5"
                  >
                    <v-icon> mdi-water-plus-outline </v-icon>
                    &nbsp; เพิ่มสายมิเตอร์น้ำ
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title> เพิ่มสายมิเตอร์น้ำ </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-form ref="addZone" v-model="valid" lazy-validation>
                        <v-row>
                          <v-col cols="12">
                            <v-autocomplete
                              v-model="addZoneInWaterZone"
                              item-text="name"
                              item-value="id"
                              :items="zonesData"
                              label="เขตพื้นที่"
                              required
                              @click="getWaterZonesdata()"
                            >
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="addWaterZone"
                              label="สายมิเตอร์น้ำ"
                              clearable
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-btn
                        large
                        color="error"
                        text
                        @click="dialogAddWaterZone = false"
                      >
                        ยกเลิก
                      </v-btn>
                      <v-btn
                        large
                        color="agree"
                        :disabled="!valid"
                        text
                        @click="createWaterZone"
                      >
                        ยืนยัน
                      </v-btn>
                    </v-form>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- add building -->
              <v-dialog v-model="dialogAddbuilding" persistent max-width="75%">
                <template v-slot:activator="{ on: attrs }">
                  <v-btn
                    color="agree"
                    dark
                    v-on="{ ...attrs }"
                    class="button-filter pt-5 pb-5"
                  >
                    <v-icon> mdi-office-building-marker-outline </v-icon>
                    &nbsp; เพิ่มอาคาร
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title> เพิ่มอาคาร </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-form ref="addBuilding" v-model="valid" lazy-validation>
                        <v-row>
                          <!-- zone -->
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete
                              v-model="addZoneInBuilding"
                              item-text="name"
                              item-value="id"
                              :items="zonesData"
                              label="เขตพื้นที่"
                              required
                              :search-input.sync="search1"
                            >
                            </v-autocomplete>
                          </v-col>
                          <!-- waterzone -->
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete
                              v-model="waterZonesDatas"
                              item-text="name"
                              item-value="id"
                              :items="waterZonesData"
                              label="สายมิเตอร์น้ำ"
                              required
                            >
                            </v-autocomplete>
                          </v-col>
                          <!-- building -->
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="addBuilding"
                              label="อาคาร"
                              clearable
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-btn large color="error" text @click="close">
                        ยกเลิก
                      </v-btn>
                      <v-btn
                        large
                        color="agree"
                        :disabled="!valid"
                        text
                        @click="createbuilding"
                      >
                        ยืนยัน
                      </v-btn>
                    </v-form>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- add room -->
              <v-dialog v-model="dialog" persistent max-width="75%">
                <template v-slot:activator="{ on: attrs }">
                  <v-btn
                    color="#046FE5"
                    dark
                    v-on="{ ...attrs }"
                    class="button-filter pt-5 pb-5"
                  >
                    <v-icon> mdi-account-plus </v-icon>
                    &nbsp; เพิ่มห้องพัก
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span>{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-form ref="formNewdata" v-model="valid" lazy-validation>
                        <v-row>
                          <!-- zone -->
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete
                              v-model="editedItem.zone"
                              item-text="name"
                              item-value="id"
                              :items="zonesData"
                              label="เขตพื้นที่"
                              required
                              clearable
                              autofocus
                              :search-input.sync="search2"
                              :rules="rules.zonesBuildingsRoom"
                            >
                            </v-autocomplete>
                          </v-col>
                          <!-- water group -->
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete
                              v-model="editedItem.waterZone"
                              item-text="name"
                              item-value="id"
                              :items="waterZonesData"
                              label="สายมิเตอร์น้ำ"
                              required
                              clearable
                              :rules="rules.zonesBuildingsRoom"
                              :search-input.sync="search3"
                            >
                            </v-autocomplete>
                          </v-col>
                          <!-- building -->
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete
                              v-model="editedItem.building"
                              :items="buildinsData"
                              item-text="name"
                              item-value="id"
                              label="อาคาร"
                              clearable
                              required
                              :rules="rules.zonesBuildingsRoom"
                            >
                            </v-autocomplete>
                          </v-col>
                          <!-- roomNo -->
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.roomNo"
                              label="เลขห้องพัก"
                              clearable
                              required
                              @keypress="isNumber($event)"
                              :rules="rules.zonesBuildingsRoom"
                            >
                            </v-text-field>
                          </v-col>
                          <!-- waterNo -->
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.waterNo"
                              label="เลขผู้ใช้น้ำ"
                              @keypress="isNumber($event)"
                              clearable
                              required
                              counter="4"
                              maxlength="4"
                              :rules="rules.waterNumber"
                            ></v-text-field>
                          </v-col>
                          <!-- water_meter_no -->
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.waterMeterNo"
                              label="เลขมิเตอร์น้ำ"
                              @keypress="isNumber($event)"
                              clearable
                              required
                              counter="4"
                              maxlength="4"
                              :rules="rules.waterNumber"
                            ></v-text-field>
                          </v-col>
                          <!-- type -->
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              v-model="editedItem.roomType"
                              :items="room_types"
                              label="ประเภทห้องพัก"
                              clearable
                              required
                              :rules="rules.zonesBuildingsRoom"
                              item-text="name"
                              item-value="value"
                            >
                            </v-select>
                          </v-col>
                          <!-- status -->
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              item-text="name"
                              item-value="value"
                              v-model="editedItem.status"
                              :items="room_statuses"
                              label="สถานะห้องพัก"
                              clearable
                              required
                              :rules="rules.zonesBuildingsRoom"
                            >
                            </v-select>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-btn large color="error" text @click="close">
                        ยกเลิก
                      </v-btn>
                      <v-btn
                        large
                        color="agree"
                        :disabled="!valid"
                        text
                        @click="validateForm"
                      >
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
                    <v-btn color="error" text @click="closeDelete"
                      >ยกเลิก</v-btn
                    >
                    <v-btn color="agree" text @click="deleteItemConfirm"
                      >ยืนยัน</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- export excel to email -->
              <v-dialog
                v-model="exportExcelBuliding"
                persistent
                max-width="75%"
              >
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
                    <v-btn
                      color="error"
                      text
                      @click="exportExcelBuliding = false"
                    >
                      ยกเลิก
                    </v-btn>
                    <v-btn class="ma-2" text color="agree" @click="getRoomsID">
                      ยืนยัน
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-card-title>
          <v-card-text>
            <!-- start data-table -->
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="buildingTable"
              item-key="id"
              :items-per-page="itemsPerPage"
              class="table header-blue"
              :search="search"
              :loading="loadTable"
              loading-text="กำลังโหลด... โปรดรอสักครู่"
              show-select
              @input="enterSelect($event)"
              id="virtual-scroll-table"
              v-scroll:#virtual-scroll-table="onScroll"
            >
              <!-- color status on datatable  -->
              <template v-slot:[`item.status`]="{ item }">
                <v-chip :color="getColor(item.status)" dark>
                  <td v-if="item.status == 'empty'">{{ "ว่าง" }}</td>
                  <td v-if="item.status == 'not_empty'">
                    {{ "ไม่ว่าง" }}
                  </td>
                </v-chip>
              </template>
              <template v-slot:[`item.roomType`]="{ item }">
                <td v-if="item.roomType == 'single'">{{ "ห้องโสด" }}</td>
                <td v-if="item.roomType == 'family_1'">
                  {{ "ห้องครอบครัว 1" }}
                </td>
                <td v-if="item.roomType == 'family_2'">
                  {{ "ห้องครอบครัว 2" }}
                </td>
              </template>
              <!-- data edit and delete-->
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <v-snackbar
          v-model="snackbar"
          :timeout="timeout"
          :color="colorSnackbar"
        >
          <div class="text-center">
            {{ statusAction }}
          </div>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-container v-if="role == 'user'">
      <NotFound />
    </v-container>
  </v-app>
</template>

<script>
import room_statuses from "../../json/roomStatuses.json";
import room_types from "../../json/roomTypes.json";
import axios from "axios";
import { apiUrl } from "../../utils/url";
import NotFound from "../../components/notFound/Notfound.vue";
import FileDownload from "js-file-download";
export default {
  components: { NotFound },
  data: () => ({
    zoneIdEdit: "",
    waterZoneIdEdit: "",
    buildingIdEdit: "",
    deleteBuildingDialog: false,
    buildingTableEdit: false,
    editWaterZoneDialog: false,
    deleteWaterZoneDialog: false,
    deleteZoneDialog: false,
    editZoneTableData: false,
    editZoneBuildings: false,
    zonesDataTables: [],
    waterZonesDataTables: [],
    buildingsDataTables: [],
    search1: "",
    search2: "",
    search3: "",
    buildingIDs: "",
    waterZoneIds: "",
    zoneIds: "",
    waterIds: "",
    zonesDatas: "",
    waterZonesDatas: "",
    buildingDatas: "",
    zonesData: [],
    waterZonesData: [],
    buildinsData: [],
    lat: "",
    lng: "",
    dialogAddZone: false,
    dialogAddWaterZone: false,
    dialogAddbuilding: false,
    addZone: "",
    addZoneInWaterZone: "",
    addWaterZone: "",
    addZoneInBuilding: "",
    addBuilding: "",
    token: "",
    buildingID: "",
    roomID: "",
    role: "",
    el: "#app",
    valid: true,
    modal: false,
    snackbar: false,
    statusAction: "",
    colorSnackbar: "",
    timeout: 2000,
    loadTable: true,
    dialog: false,
    menu: false,
    selected: [],
    itemsPerPage: 5,
    selectItems: false,
    first_name: "",
    on: {},
    attrs: {},
    zonevalues: "",
    emailtarget: "",
    exportExcelBuliding: false,
    dateExport: new Date().toISOString().substr(0, 7),
    menuExportExcel: false,
    electricityNo: "",
    waterNo: "",
    electricityMeterNo: "",
    water_meter_no: "",
    roomType: "",
    status: "",
    room_types: room_types,
    room_statuses: room_statuses,
    search: "",
    dialogDelete: false,
    // Filter models.
    waterGroupFilterValue: "",
    zoneFilterValue: "",
    statusFilterValue: "",
    typeFilterValue: "",
    buildFilterValue: null,
    roomFilterValue: null,
    buildingTable: [],
    editedIndex: -1,
    start: 0,
    rowHeight: 24,
    perPage: 25,
    zoneId: "",
    editedItem: {
      waterZone: "",
      zone: "",
      building: "",
      roomNo: "",
      electricityNo: "",
      electricityMeterNo: "",
      waterNo: "",
      waterMeterNo: "",
      roomType: "",
      status: "",
    },
    defaultItem: {
      waterZone: "",
      zone: "",
      building: "",
      roomNo: "",
      electricityNo: "",
      electricityMeterNo: "",
      waterNo: "",
      waterMeterNo: "",
      roomType: "",
      status: "",
    },
    rules: {
      nameRules: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 2) || "กรอกชื่อให้มากกว่า 2 ตัวอักษร",
      ],
      zonesBuildingsRoom: [(v) => !!v || "กรุณากรอกข้อมูล"],
      waterNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 4) || "กรอกชื่อให้มากกว่า 4 ตัวอักษร",
      ],
      electricNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 12) || "กรอกเลขผู้ใช้ไฟฟ้าไม่ครบ 12 ตัว",
      ],
      electricMeterNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 11) || "กรอกเลขมิเตอร์ไฟฟ้าไม่ครบ 11 ตัว",
      ],
      latitudeRules: {
        required: (v) => !!v || "กรุณาใส่ข้อมูล",
        regex: (v) =>
          /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
            v
          ) || "ละติจูดไม่ถูกต้อง",
      },
      longitudeRules: {
        required: (v) => !!v || "กรุณาใส่ข้อมูล.",
        regex: (v) =>
          /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
            v
          ) || "ลองจิจูดไม่ถูกต้อง",
      },
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มห้องพัก" : "แก้ไขห้องพัก";
    },
    headers() {
      return [
        {
          text: "เขตพื้นที่",
          value: "zone.name",
          filter: this.zoneFilter,
        },
        {
          text: "สายมิเตอร์น้ำ",
          value: "waterZone.name",
          filter: this.waterGroupFilter,
        },
        {
          text: "อาคาร",
          value: "building.name",
          filter: this.buildingFilter,
        },
        {
          text: "เลขห้องพัก",
          value: "roomNo",
        },
        {
          text: "เลขผู้ใช้น้ำ",
          value: "waterNo",
        },
        {
          text: "เลขมิเตอร์น้ำ",
          value: "waterMeterNo",
        },
        {
          text: "ประเภทห้องพัก",
          value: "roomType",
          filter: this.typeFilter,
        },
        {
          text: "สถานะ",
          value: "status",
          filter: this.statusFilter,
        },
        {
          text: "แก้ไข",
          value: "actions",
          align: "center",
          sortable: false,
        },
      ];
    },
    zonesDataTable() {
      return [
        {
          text: "เขตพื้นที่",
          value: "name",
          filter: this.zoneFilter,
        },
        {
          text: "จัดการ",
          value: "actions",
          align: "center",
          sortable: false,
        },
      ];
    },
    waterZonesDataTable() {
      return [
        {
          text: "เขตพื้นที่น้ำ",
          value: "name",
        },
        {
          text: "แก้ไข",
          value: "actions",
          align: "center",
          sortable: false,
        },
      ];
    },
    buildingsDataTable() {
      return [
        {
          text: "อาคาร",
          value: "name",
        },
        {
          text: "แก้ไข",
          value: "actions",
          align: "center",
          sortable: false,
        },
      ];
    },
    startHeight() {
      return this.start * this.rowHeight - 32;
    },
    endHeight() {
      return this.rowHeight * (this.buildingTable.length - this.start);
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    search1: function () {
      this.zoneIds = this.addZoneInBuilding;
      this.getWaterZonesdata();
    },
    search2: function () {
      this.zoneIds = this.editedItem.zone;
      this.getWaterZonesdata();
    },
    search3: function () {
      this.waterZoneIds = this.editedItem.waterZone;
      this.getBuildingsdatas();
    },
  },
  created() {
    this.getRole();
    this.gettoken();
  },
  mounted() {
    this.getBuildingData();
    this.getZonesdata();
    this.getWaterZonesdata();
    this.getBuildingsdatas();
    this.getWaterZonesdataTable();
    this.getBuildingdataTable();
  },
  methods: {
    createZone() {
      var data = JSON.stringify({
        name: this.addZone.trim(),
      });
      var config = {
        method: "post",
        url: apiUrl + "/v1/building/buildings/add/zone",
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios(config)
        .then(() => {
          this.dialogAddZone = false;
          this.statusAction = "เพิ่มพื้นที่สำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
          this.getZonesdata();
          this.addZone = null;
        })
        .catch((error) => {
          console.log(error.response.data.error_message);
          if (error.response.data.error_message === "Unprocessable Entity") {
            this.dialogAddZone = false;
            this.statusAction = "เพิ่มพื้นที่ไม่สำเร็จเพราะข้อมูลซ้ำกัน";
            this.colorSnackbar = "red";
            this.snackbar = true;
            this.dialogAddZone = false;
            this.addZone = null;
          } else {
            this.statusAction = "เพิ่มพื้นที่ไม่สำเร็จ";
            this.colorSnackbar = "red";
            this.snackbar = true;
            this.dialogAddZone = false;
            this.addZone = null;
          }
        });
    },
    createWaterZone() {
      const data = JSON.stringify({
        zoneId: this.addZoneInWaterZone,
        name: this.addWaterZone.trim(),
      });
      const config = {
        method: "post",
        url: apiUrl + "/v1/building/buildings/add/water-zone",
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios(config)
        .then(() => {
          this.dialogAddWaterZone = false;
          this.statusAction = "เพิ่มสายมิเตอร์น้ำสำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
          this.getWaterZonesdata();
          this.addWaterZone = null;
          this.getWaterZonesdataTable();
        })
        .catch((error) => {
          console.log(error);
          this.statusAction = "เพิ่มสายมิเตอร์น้ำไม่สำเร็จ";
          this.colorSnackbar = "red";
          this.snackbar = true;
          this.dialogAddWaterZone = false;
          this.addWaterZone = null;
        });
    },
    createbuilding() {
      const data = JSON.stringify({
        zoneId: this.addZoneInBuilding,
        waterZoneId: this.waterZonesDatas,
        name: this.addBuilding,
      });
      const config = {
        method: "post",
        url: apiUrl + "/v1/building/buildings/add/building",
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios(config)
        .then(() => {
          this.dialogAddbuilding = false;
          this.statusAction = "เพิ่มอาคารสำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
          this.getBuildingsdatas();
          this.addBuilding = null;
          this.getBuildingdataTable();
        })
        .catch((error) => {
          console.log(error);
          this.statusAction = "เพิ่มห้องพักไม่สำเร็จ";
          this.colorSnackbar = "red";
          this.snackbar = true;
          this.dialogAddbuilding = false;
          this.addBuilding = null;
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
          this.zonesDataTables = dataZones;
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

    getWaterZonesdataTable() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(apiUrl + "/v1/building/data/water-zone-table", config)
        .then((response) => {
          let data = response.data;
          this.waterZonesDataTables = data.result;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getBuildingdataTable() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(apiUrl + "/v1/building/data/building-table", config)
        .then((response) => {
          let data = response.data;
          this.buildingsDataTables = data.result;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //edit zone
    editZonesSubmit() {
      let data = JSON.stringify({
        name: this.editZones.zone,
      });
      let config = {
        method: "patch",
        url:
          apiUrl +
          "/v1/building/buildings/edit-zone" +
          "?id=" +
          this.zoneIdEdit,
        headers: {
          "x-api-key": process.env.apiKey,
          "Content-Type": "application/json",
        },
        data: data,
      };
      return axios(config)
        .then(() => {
          this.getZonesdata();
          this.editZoneTableData = false;
          this.statusAction = "แก้ไขพื้นที่สำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
        })
        .catch((error) => {
          console.log(error);
          this.statusAction = "แก้ไขพื่นที่ไม่สำเร็จ";
          this.colorSnackbar = "red";
          this.snackbar = true;
        });
    },
    // delete zone
    deleteZonesSubmit() {
      let config = {
        method: "delete",
        url:
          apiUrl +
          "/v1/building/buildings/delete-zone" +
          "?id=" +
          this.zoneIdEdit,
        headers: {
          "x-api-key": process.env.apiKey,
          "Content-Type": "application/json",
        },
      };
      return axios(config)
        .then(() => {
          this.getZonesdata();
          this.deleteZoneDialog = false;
          this.statusAction = "ลบพื่นที่สำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
        })
        .catch((error) => {
          console.log(error);
          this.statusAction = "ลบพื่นที่ไม่สำเร็จ";
          this.colorSnackbar = "red";
          this.snackbar = true;
        });
    },
    //  edit water zone
    editWaterZoneSubmit() {
      let data = JSON.stringify({
        name: this.editWaterZone.waterZone,
      });
      let config = {
        method: "patch",
        url:
          apiUrl +
          "/v1/building/buildings/edit-water-zone" +
          "?id=" +
          this.waterZoneIdEdit,
        headers: {
          "x-api-key": process.env.apiKey,
          "Content-Type": "application/json",
        },
        data: data,
      };
      return axios(config)
        .then(() => {
          this.getWaterZonesdataTable();
          this.editWaterZoneDialog = false;
          this.statusAction = "แก้ไขสายมิเตอร์สำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
        })
        .catch((error) => {
          console.log(error);
          this.editWaterZoneDialog = false;
          this.statusAction = "แก้ไขสายมิเตอร์ไม่สำเร็จ";
          this.colorSnackbar = "red";
          this.snackbar = true;
        });
    },
    deleteWaterZoneSubmit() {
      let config = {
        method: "delete",
        url:
          apiUrl +
          "/v1/building/buildings/delete-water-zone" +
          "?id=" +
          this.waterZoneIdEdit,
        headers: {
          "x-api-key": process.env.apiKey,
          "Content-Type": "application/json",
        },
      };
      return axios(config)
        .then(() => {
          this.getWaterZonesdataTable();
          this.deleteWaterZoneDialog = false;
          this.statusAction = "ลบสายมิเตอร์สำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
        })
        .catch((error) => {
          console.log(error);
          this.deleteWaterZoneDialog = false;
          this.statusAction = "ลบสายมิเตอร์ไม่สำเร็จ";
          this.colorSnackbar = "red";
          this.snackbar = true;
        });
    },
    // edit building
    editBuildingSubmit() {
      let data = JSON.stringify({
        name: this.editBuildingZone.building,
      });
      let config = {
        method: "patch",
        url:
          apiUrl +
          "/v1/building/buildings/edit-building" +
          "?id=" +
          this.buildingIdEdit,
        headers: {
          "x-api-key": process.env.apiKey,
          "Content-Type": "application/json",
        },
        data: data,
      };
      return axios(config)
        .then(() => {
          this.getBuildingdataTable();
          this.buildingTableEdit = false;
          this.statusAction = "แก้ไขอาคารสำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
        })
        .catch((error) => {
          this.buildingTableEdit = false;
          this.statusAction = "แก้ไขอาคารไม่สำเร็จ";
          this.colorSnackbar = "red";
          this.snackbar = true;
          console.log(error);
        });
    },
    deleteBuildingSubmit() {
      let config = {
        method: "delete",
        url:
          apiUrl +
          "/v1/building/buildings/delete-building" +
          "?id=" +
          this.buildingIdEdit,
        headers: {
          "x-api-key": process.env.apiKey,
          "Content-Type": "application/json",
        },
      };
      return axios(config)
        .then(() => {
          this.getBuildingdataTable();
          this.deleteBuildingDialog = false;
          this.statusAction = "ลบอาคารสำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
        })
        .catch((error) => {
          console.log(error);
          this.deleteBuildingDialog = false;
          this.statusAction = "ลบอาคารไม่สำเร็จ";
          this.colorSnackbar = "red";
          this.snackbar = true;
        });
    },
    // get refreshToken
    gettoken() {
      var token = sessionStorage.getItem("refreshToken");
      this.token = token;
    },
    // get role user
    getRole() {
      var role = localStorage.getItem("role");
      this.role = role;
    },
    // get building data for table
    getBuildingData() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      return axios
        .get(apiUrl + "/v1/building/buildings", config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            this.buildingTable = data.result;
            this.loadTable = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getRoomsID() {
      if (this.selectItems == true) {
        let roomsIDs = [];
        for (var i = 0; i < this.selected.length; i++) {
          roomsIDs.push(this.selected[i].id);
        }
        if (this.exportExcelBuliding === true) {
          this.loader;
          this.exportBuliding(roomsIDs);
        }
        if (this.exportExcelBuliding === false) {
          this.deleteItemSelected(roomsIDs);
        }
      }
    },
    // export with api
    exportBuliding(roomsIDs) {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
        responseType: "blob",
      };
      const id = { id: roomsIDs };
      return axios
        .post(apiUrl + "/v1/building/export", id, config)
        .then((response) => {
          FileDownload(response.data, "ข้อมูลห้องพัก.xlsx");
          this.exportExcelBuliding = false;
          this.statusAction =
            "Export ข้อมูลห้องพักจำนวน " +
            this.selected.length +
            " ห้อง สำเร็จ";
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
            this.colorSnackbar = "error";
            this.snackbar = true;
            this.exportExcelBuliding = false;
          } else {
            this.statusAction = "Export ไม่สำเร็จ กรุณาติดต่อเจ้าหน้าที่";
            this.colorSnackbar = "red";
            this.snackbar = true;
            this.exportExcelBuliding = false;
          }
        });
    },
    // delete buildibg
    deleteRoom(roomsIDs) {
      var data = { id: roomsIDs };
      var config = {
        method: "delete",
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
          "Content-Type": "application/json",
        },
        data: data,
      };
      return axios
        .delete(apiUrl + "/v1/building/buildings/delete", config)
        .then(() => {
          if (confirm) {
            this.statusAction =
              "ลบข้อมูลห้องพักจำนวน " + this.selected.length + "ห้อง สำเร็จ";
            this.colorSnackbar = "agree";
            this.snackbar = true;
            this.selected = [];
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.error_message === "bad_request") {
            this.statusAction = "ลบข้อมูลไม่สำเร็จ กรุณาเลือกข้อมูลใหม่";
            this.colorSnackbar = "error";
            this.snackbar = true;
          } else {
            this.statusAction = "ลบข้อมูลไม่สำเร็จ กรุณาติดต่อเจ้าหน้าที่";
            this.colorSnackbar = "red";
            this.snackbar = true;
          }
        });
    },
    // create building room
    createBuilding(
      waterZone,
      zone,
      building,
      roomNo,
      waterNo,
      waterMeterNo,
      roomType,
      status
    ) {
      let payload = {
        waterZoneId: waterZone,
        zoneId: zone,
        buildingId: building,
        roomNo: roomNo.trim(),
        waterNo: waterNo.trim(),
        waterMeterNo: waterMeterNo.trim(),
        roomType: roomType,
        status: status,
      };
      let headerAPI = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
        payload: payload,
      };
      axios
        .post(apiUrl + "/v1/building/buildings/add", payload, headerAPI)
        .then(() => {
          this.getBuildingData();
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.error_message === "invalid API Key") {
            this.snackbar = true;
            this.statusAction = "เพิ่มข้อมูลผิดพลาด กรูณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "wanning";
          } else {
            this.snackbar = true;
            this.statusAction = "เพิ่มข้อมูลผิดพลาด กรูณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
          }
        });
    },
    editBuilding() {
      let building_ID = this.buildingID;
      let payload = {
        waterZoneId: this.editedItem.waterZone.id,
        zoneId: this.editedItem.zone.id,
        buildingId: this.editedItem.building.id,
        roomNo: this.editedItem.roomNo.trim(),
        waterNo: this.editedItem.waterNo.trim(),
        waterMeterNo: this.editedItem.waterMeterNo.trim(),
        roomType: this.editedItem.roomType,
        status: this.editedItem.status,
      };
      let config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
        payload: payload,
      };
      return axios
        .patch(
          apiUrl + "/v1/building/buildings/edit/" + building_ID,
          payload,
          config
        )
        .then(async () => {})
        .catch((error) => {
          console.log(error);
          if (error.response.data.status === "unauthorized") {
            this.statusAction = "แก้ไขข้อมูล ไม่สำเร็จ กรุณาติดต่อเจ้าหน้าที่";
            this.colorSnackbar = "error";
            this.snackbar = true;
            this.differencePriceCalculate = false;
          } else {
            this.statusAction = "แก้ไขข้อมูล ไม่สำเร็จ กรุณาติดต่อเจ้าหน้าที่";
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
      // Check if the current loop value (The dessert first_name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.NamefilterValue.toLowerCase());
    },
    waterGroupFilter(value) {
      if (!this.waterGroupFilterValue) {
        return true;
      }
      return value === this.waterGroupFilterValue;
    },
    zoneFilter(value) {
      if (!this.zoneFilterValue) {
        return true;
      }
      return value === this.zoneFilterValue;
    },
    buildingFilter(value) {
      if (!this.buildFilterValue) {
        return true;
      }
      return value === this.buildFilterValue;
    },
    roomFilter(value) {
      if (!this.roomFilterValue) {
        return true;
      }
      return value === this.roomFilterValue;
    },
    statusFilter(value) {
      if (!this.statusFilterValue) {
        return true;
      }
      return value === this.statusFilterValue;
    },
    typeFilter(value) {
      if (!this.typeFilterValue) {
        return true;
      }
      return value === this.typeFilterValue;
    },
    editItem(item) {
      this.editedIndex = this.buildingTable.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.buildingID = item.id;
    },
    deleteItem(item) {
      this.editedIndex = this.buildingTable.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    editZones(item) {
      this.zoneIdEdit = item.id;
      this.editZoneTableData = true;
    },
    deleteZone(item) {
      this.zoneIdEdit = item.id;
      this.deleteZoneDialog = true;
    },
    editWaterZone(item) {
      this.waterZoneIdEdit = item.id;
      this.editWaterZoneDialog = true;
    },
    deleteWaterZone(item) {
      this.waterZoneIdEdit = item.id;
      this.deleteWaterZoneDialog = true;
    },
    editBuildingZone(item) {
      this.buildingIdEdit = item.id;
      this.buildingTableEdit = true;
    },
    deleteBuilding(item) {
      this.buildingIdEdit = item.id;
      console.log(item.id);
      this.deleteBuildingDialog = true;
    },
    deleteItemConfirm() {
      this.buildingTable.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialogAddbuilding = false;
      this.dialog = false;
      this.$refs.formNewdata.resetValidation();
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
    async validateForm() {
      if (this.$refs.formNewdata.validate()) {
        this.save();
      }
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.buildingTable[this.editedIndex], this.editedItem);
        this.editBuilding(
          this.editedItem.waterZone.id,
          this.editedItem.zone.id,
          this.editedItem.building.id,
          this.editedItem.roomNo,
          this.editedItem.waterNo,
          this.editedItem.waterMeterNo,
          this.editedItem.roomType,
          this.editedItem.status
        );
        this.snackbar = true;
        this.statusAction = "แก้ไขข้อมูลสำเร็จ";
        this.colorSnackbar = "agree";
        this.$refs.formNewdata.resetValidation();
      } else {
        this.buildingTable.push(this.editedItem);
        this.createBuilding(
          this.editedItem.waterZone,
          this.editedItem.zone,
          this.editedItem.building,
          this.editedItem.roomNo,
          this.editedItem.waterNo,
          this.editedItem.waterMeterNo,
          this.editedItem.roomType,
          this.editedItem.status
        );
        this.snackbar = true;
        this.statusAction = "เพิ่มข้อมูลสำเร็จ";
        this.colorSnackbar = "agree";
        this.$refs.formNewdata.resetValidation();
      }
      this.close();
    },
    // clear input filter
    clear() {
      (this.NamefilterValue = null),
        (this.zoneFilterValue = null),
        (this.statusFilterValue = null),
        (this.buildFilterValue = null),
        (this.search = null);
    },
    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },
    // clearFilter
    clearFilter() {
      this.$refs.formFilter.reset();
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
    // clear form add user
    clearForm() {
      this.$refs.formNewdata.reset();
    },
    // color of status
    getColor(status) {
      if (status == "not_empty") return "red";
      if (status == "empty") return "agree";
      else return "#ffffff";
    },
    // Check selectItems column
    enterSelect() {
      if (this.selected.length >= 1) {
        return (this.selectItems = true);
      } else {
        return (this.selectItems = false);
      }
    },
    // delete as selected
    deleteItemSelected(roomsIDs) {
      if (confirm("ต้องการลบข้อมูลที่เลือกหรือไม่ ?")) {
        for (var i = 0; i < this.selected.length; i++) {
          const index = this.buildingTable.indexOf(this.selected[i]);
          this.buildingTable.splice(index, 1);
        }
        this.buildingTable.indexOf(this.selected[0]);
        this.selectItems = false;
        this.roomID = this.selected.id;
        this.deleteRoom(roomsIDs);
      }
    },
    onScroll(e) {
      // debounce if scrolling fast
      this.timeout && clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        const { scrollTop } = e.target;
        const rows = Math.ceil(scrollTop / this.rowHeight);
        this.start =
          rows + this.perPage > this.buildingTable.length
            ? this.buildingTable.length - this.perPage
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
  padding: 20px;
  font-family: Sarabun;
}
.button-filter {
  margin: 10px;
  padding: 20px;
}
.card-filter {
  margin-bottom: 20px;
  margin-top: 20px;
}
.title {
  font-size: 25px;
  font-family: Sarabun;
}

.form-table {
  margin-top: -20px;
  padding: -20px;
}

.header-table {
  padding: 15px;
  margin-top: 15px;
}

.chart-responsive {
  width: 100%;
  margin: 20px auto;
}
.mx-auto {
  font-size: 30px;
}
.header-blue .v-data-table-header {
  background-color: #466bb2 !important;
}
.filter {
  padding: 5px;
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
#virtual-scroll-table {
  max-height: 400px;
  overflow: auto;
}
</style>
