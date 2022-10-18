<template>
  <v-data-table
    :headers="headers"
    :items="userList"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>User Details</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New Item
            </v-btn>
          </template>
          <v-form ref="form">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <div class="d-flex flex-column">
                        <div v-if="editedIndex > -1">
                          <img
                            width="200"
                            :src="editedItem.imageUrl"
                            :alt="editedItem.name"
                          />
                        </div>

                        <label class="placeholder">Choose an Image </label>
                        <input
                          class="file-input"
                          ref="fileInput"
                          type="file"
                          @input="onSelectFile"
                        />
                        <div v-if="selectImageFlag" class="pt-2">
                          <label class="red--text darken-1">select image</label>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Enter Name"
                        :counter="10"
                        :rules="nameRules"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        v-model="editedItem.email"
                        label="Enter Email"
                        :rules="emailRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        v-model="editedItem.address"
                        label="Enter Address"
                        :rules="addressRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        v-model="editedItem.latitude"
                        label="Enter latitude"
                        :rules="latitudeRules"
                        type="number"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        v-model="editedItem.longitude"
                        label="Enter longitude"
                        :rules="longitudeRules"
                        type="number"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        v-model="editedItem.mobileNo"
                        label="Enter Mobile No"
                        :rules="mobileRules"
                        required
                        type="number"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="close"> Cancel </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItem()"
                >Yes</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.imageUrl`]="{ item }">
      <img width="50" :src="item.imageUrl" :alt="item.name" />
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteUserConfirmation(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ListView",
  data: () => ({
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 10 || "Name must be less than 10 characters",
    ],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
    latitudeRules: [(v) => !!v || "Latitude is required"],
    longitudeRules: [(v) => !!v || "Longitude is required"],
    mobileRules: [(v) => !!v || "Number is required"],
    addressRules: [(v) => !!v || "Address is required"],
    dialog: false,
    dialogDelete: false,
    displayUserDetailsFlag: false,
    selectImageFlag: false,
    currentDeletedUser: 0,
    headers: [
      {
        text: "Name ",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Mobile", value: "mobileNo" },
      { text: "Email", value: "email" },
      { text: "Address", value: "address" },
      { text: "Image", value: "imageUrl" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      mobileNo: "",
      email: "",
      address: "",
      image: "",
      latitude: "",
      longitude: "",
    },
    defaultItem: {
      name: "",
      mobileNo: "",
      email: "",
      address: "",
      image: "",
      latitude: "",
      longitude: "",
    },
  }),

  computed: {
    ...mapGetters(["userList"]),
    formTitle() {
      return this.editedIndex === -1 ? "Add New User" : "Edit New User";
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
    this.fetchuserList();
  },

  methods: {
    ...mapActions(["fetchuserList", "addUser", "updateUser", "deleteUser"]),

    onSelectFile() {
      const input = this.$refs.fileInput;
      this.editedItem.image = input.files[0];
      this.selectImageFlag = false;
    },

    editItem(item) {
      this.dialog = true;
      this.editedIndex = 0;
      this.editedItem = Object.assign({}, item);
    },

    deleteUserConfirmation(item) {
      this.currentDeletedUser = item;
      this.dialogDelete = true;
    },

    async deleteItem() {
      await this.deleteUser(this.currentDeletedUser.id);
      await this.fetchuserList();
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
    },

    close() {
      this.dialog = false;
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
    },

    async save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          await this.updateUser(this.editedItem);
          this.fetchuserList();
          this.editedItem = Object.assign({}, this.defaultItem);
        } else {
          if (this.editedItem.image == "") {
            this.selectImageFlag = true;
            return;
          }

          await this.addUser(this.editedItem);
          this.editedItem = Object.assign({}, this.defaultItem);
        }
      } else {
        return;
      }

      this.close();
    },
  },
};
</script>
