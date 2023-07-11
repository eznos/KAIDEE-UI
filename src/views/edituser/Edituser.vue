<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <v-col cols="3">
          <v-card max-width="450px" class="mx-auto bg" elevation="2">
            <v-img
              class=""
              height="200px"
              src="http://unblast.com/wp-content/uploads/2021/09/Real-Estate-Agent-Illustration.jpg"
              gradient="150deg, rgb(185 224 255 / 58%) 0%, rgb(243 220 246 / 52%) 35%, rgb(223 255 242 / 74%) 74%"
            >
            </v-img>
            <v-row justify="center">
              <v-col
                align-self="start"
                class="mx-auto justify-center align-center"
                cols="12"
              >
                <v-hover v-slot="{ hover }">
                  <v-card
                    color="rgba(245, 39, 145, 0)"
                    class="px-3 mb-2 uploadimg"
                  >
                    <v-row style="height: 100%" justify="center" align="center">
                      <v-avatar color="grey" size="190" rounded="10">
                        <v-img
                          v-if="profileImage !== ''"
                          :src="profileImage"
                          height="190"
                        >
                        </v-img>
                      </v-avatar>
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
            </v-row>
            <v-list-item color="#0000" class="profile-text-name ma-4 pt-16">
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  Marcus Obrien
                </v-list-item-title>
                <v-list-item-subtitle>Network Engineer</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <!-- icon + -->
                <v-dialog v-model="dialog" persistent width="1024">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      class="mx-2"
                      v-bind="props"
                      fab
                      dark
                      color="indigo"
                      small
                    >
                      <v-icon dark> mdi-clipboard-edit </v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">User Profile</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              label="Legal first name*"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              label="Legal middle name"
                              hint="example of helper text only on focus"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              label="Legal last name*"
                              hint="example of persistent helper text"
                              persistent-hint
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              label="Email*"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              label="Password*"
                              type="password"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-select
                              :items="['0-17', '18-29', '30-54', '54+']"
                              label="Age*"
                              required
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-autocomplete
                              :items="[
                                'Skiing',
                                'Ice hockey',
                                'Soccer',
                                'Basketball',
                                'Hockey',
                                'Reading',
                                'Writing',
                                'Coding',
                                'Basejump',
                              ]"
                              label="Interests"
                              multiple
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                      </v-container>
                      <small>*indicates required field</small>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="dialog = false"
                      >
                        Close
                      </v-btn>
                      <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="dialog = false"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item-action>
            </v-list-item>

            <v-card-subtitle>
              <b class="ml-2">Sobre Mim</b>
              <v-btn v-on:click="saveBio" icon>
                <v-icon small>{{ bioIcon }}</v-icon>
              </v-btn>
            </v-card-subtitle>

            <p v-if="!editBio" class="pl-6 pr-6 pt-0">
              {{ Bio }}
            </p>
            <v-textarea
              v-model="Bio"
              rows="2"
              v-if="editBio"
              label="Editar minha Bio"
              class="pa-6"
            ></v-textarea>
            <v-spacer></v-spacer>
            <v-text-field
              class="pa-6"
              v-model="Phone"
              prepend-icon="mdi-whatsapp"
              label="Phone"
              :disabled="!editBio"
            ></v-text-field>
            <v-spacer></v-spacer>

            <v-row>
              <v-col cols="6" class="text-end">
                <v-list-item-content class="sutitles">
                  <v-list-item-title class="text-h6"> 1002 </v-list-item-title>
                  <v-list-item-subtitle class="text-caption"
                    >Curtidas</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-col>
              <v-col cols="6" class="text-start">
                <v-list-item-content class="sutitles">
                  <v-list-item-title class="text-h6"> 10 </v-list-item-title>
                  <v-list-item-subtitle class="text-caption"
                    >Seguindo</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="9">
          <v-row>
            <v-col cols="6">
              <v-card class="mx-auto" elevation="2">
                <div class="chart-responsive" :style="{ padding: -20 }">
                  <canvas id="product" width="600" height="350"></canvas>
                </div>
              </v-card>
            </v-col>
            <v-col cols="2">
              <v-card>
                <v-card-title> จำนวนเครดิต </v-card-title>
                <v-card-text>
                  <v-text-field
                    label="จำนวนเครดิตคงเหลือ"
                    value="20000"
                    disabled
                  >
                  </v-text-field>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-card>
                <v-card-title> ตารางคำสั่งซื้อ </v-card-title>
                <v-card-text>
                  <v-data-table
                    :headers="headers"
                    :items="desserts"
                    sort-by="calories"
                    class="elevation-1"
                  >
                    <template v-slot:top>
                      <v-toolbar flat>
                        <v-toolbar-title>My CRUD</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              color="primary"
                              dark
                              class="mb-2"
                              v-bind="attrs"
                              v-on="on"
                            >
                              New Item
                            </v-btn>
                          </template>
                          <v-card>
                            <v-card-title>
                              <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                              <v-container>
                                <v-row>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                      v-model="editedItem.name"
                                      label="Dessert name"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                      v-model="editedItem.calories"
                                      label="Calories"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                      v-model="editedItem.fat"
                                      label="Fat (g)"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                      v-model="editedItem.carbs"
                                      label="Carbs (g)"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                      v-model="editedItem.protein"
                                      label="Protein (g)"
                                    ></v-text-field>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-card-text>

                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="blue darken-1" text @click="close">
                                Cancel
                              </v-btn>
                              <v-btn color="blue darken-1" text @click="save">
                                Save
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogDelete" max-width="500px">
                          <v-card>
                            <v-card-title class="text-h5"
                              >Are you sure you want to delete this
                              item?</v-card-title
                            >
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                color="blue darken-1"
                                text
                                @click="closeDelete"
                                >Cancel</v-btn
                              >
                              <v-btn
                                color="blue darken-1"
                                text
                                @click="deleteItemConfirm"
                                >OK</v-btn
                              >
                              <v-spacer></v-spacer>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                      <v-icon small class="mr-2" @click="editItem(item)">
                        mdi-pencil
                      </v-icon>
                      <v-icon small @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <template v-slot:no-data>
                      <v-btn color="primary" @click="initialize"> Reset </v-btn>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
import Chart from "chart.js";
export default {
  data: () => ({
    dialog: false,
    profileImage: "",
    imageURL: "",
    Phone: "00 00000-0000",
    editBio: false,
    Bio: "my bio test about myself, what do you know about me?",
    bioIcon: "mdi-pencil",
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party",
    ],
    dialogDelete: false,
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    tab: null,
    items: ["Minha agenda", "Sobre Mim"],
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  }),
  computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },
  watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
  mounted() {
    this.initialize();
    this.chartProduct();
    //this.$refs.calendar.checkChange();
  },
  computed: {
    buttonText() {
      return this.selectedFile
        ? this.selectedFile.name
        : this.defaultButtonText;
    },
  },
  methods: {
    initialize() {
      this.desserts = [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
        },
      ];
    },
    chartProduct() {
      return new Chart(product, {
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
              label: "จำนวนคำสั่งซื้อ",
              data: [
                "123",
                "123",
                "123",
                "123",
                "123",
                "123",
                "123",
                "123",
                "123",
                "123",
                "123",
                "123",
              ],
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

    saveBio() {
      this.editBio = !this.editBio;
      this.bioIcon = "mdi-content-save";
      if (!this.editBio) {
        this.bioIcon = "mdi-pencil";

        alert("salvo com sucesso!");
      }
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
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        });
      }

      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>
<style scoped>
.form {
  padding: 25px;
  margin-top: -20px;
}
.chart-responsive {
  width: 100%;
  margin: 0px auto;
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
