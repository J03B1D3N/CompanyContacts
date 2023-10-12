<template>
  <div
    class="form w-2/6 h-7/12 cursor-default flex items-center justify-center"
  >
    <div class="edit w-full h-full px-12 py-12 relative">
      <h1 class="text-3xl">Redaguokite struktūrą:</h1>
      <div class="input flex flex-col">
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field :class="newStructureTypeClass">
              <label for="newStructureType">Struktūros tipas:</label>
              <md-select
                disabled
                v-model="formData.newStructureType"
                name="newStructureType"
                id="newStructureType"
              >
                <md-option
                  value="office"
                  v-if="formData.newStructureType === 'office'"
                  >Ofisas</md-option
                >
                <md-option
                  value="division"
                  v-if="formData.newStructureType === 'division'"
                  >Padalinys</md-option
                >
                <md-option
                  value="department"
                  v-if="formData.newStructureType === 'department'"
                  >Skyrius</md-option
                >
                <md-option
                  value="group"
                  v-if="formData.newStructureType === 'group'"
                  >Grupė</md-option
                >
              </md-select>
              <span class="md-error" v-if="v$.formData.newStructureType.$error"
                >{{ v$.formData.newStructureType.$errors[0].$message }}
              </span>
            </md-field>
          </div>
          <FilterVue
            :componentClass="chosenOptionsClass"
            :filter_name="{
              name: 'Kam priklauso:',
              placeholder: 'Pasirinkite kam priklauso',
            }"
            :val="structureBelongsTo"
            :edit="false"
            :items="choiceOptionsForStructure"
            @structureChange="handleStructureChange"
            @selected="chosenOptions_invalid = false"
            :for-structure="true"
            :error-props="
              Object.keys(v$).length > 0
                ? v$.formData.chosenOptions.$errors
                : []
            "
          />

          <div
            class="md-layout-item"
            v-if="formData.newStructureType !== 'office'"
          >
            <md-field :class="structureNameClass">
              <label>Pavadinimas:</label>
              <md-input
                :placeholder="'Įveskite pavadinimą'"
                v-model="formData.structureName"
                maxlength="40"
                @input="structureName_invalid = false"
              ></md-input>
              <span class="md-error" v-if="v$.formData.structureName.$error"
                >{{ v$.formData.structureName.$errors[0].$message }}
              </span>
            </md-field>
          </div>

          <div
            class="md-layout-item"
            v-if="formData.newStructureType === 'office'"
          >
            <md-field :class="streetClass">
              <label>Gatvė:</label>
              <md-input
                :placeholder="'Įveskite gatvės pavadinimą...'"
                v-model="formData.street"
                maxlength="40"
                @input="street_invalid = false"
              ></md-input>
              <span class="md-error" v-if="v$.formData.street.$error"
                >{{ v$.formData.street.$errors[0].$message }}
              </span>
            </md-field>
          </div>
          <div
            class="md-layout-item"
            v-if="formData.newStructureType === 'office'"
          >
            <md-field :class="streetNumberClass">
              <label>Gatvės numeris:</label>
              <md-input
                :placeholder="'Įveskite gatvės numerį...'"
                v-model="formData.streetNumber"
                maxlength="10"
                @input="streetNumber_invalid = false"
              ></md-input>
              <span class="md-error" v-if="v$.formData.streetNumber.$error"
                >{{ v$.formData.streetNumber.$errors[0].$message }}
              </span>
            </md-field>
          </div>
          <div
            class="md-layout-item"
            v-if="formData.newStructureType === 'office'"
          >
            <md-field :class="cityClass">
              <label>Miestas:</label>
              <md-input
                :placeholder="'Įveskite miesto pavadinimą...'"
                v-model="formData.city"
                maxlength="40"
                @input="city_invalid = false"
              ></md-input>
              <span class="md-error" v-if="v$.formData.city.$error"
                >{{ v$.formData.city.$errors[0].$message }}
              </span>
            </md-field>
          </div>
          <div
            class="md-layout-item"
            v-if="formData.newStructureType === 'office'"
          >
            <md-field :class="countryClass">
              <label>Šalis:</label>
              <md-input
                :placeholder="'Įveskite šalies pavadinimą...'"
                v-model="formData.country"
                maxlength="40"
                @input="country_invalid = false"
              ></md-input>
              <span class="md-error" v-if="v$.formData.country.$error"
                >{{ v$.formData.country.$errors[0].$message }}
              </span>
            </md-field>
          </div>
        </div>
      </div>
      <md-button
        :disabled="editDisabled"
        type="submit"
        class="md-raised main-btn btn"
        @click="handleEdit"
        >Redaguoti</md-button
      >
      <md-button class="md-icon-button main-btn delete" @click="handleCancel">
        <img :src="cancel" alt="an x" />
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import cancel from "../../../assets/cancel.svg";
import FilterVue from "../../components/filter.vue";
import { pb, checkPermissions } from "../../../lib/pocketbase";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import {
  streetNumberRegex,
  streetRegex,
  cityRegex,
  textRegex,
} from "../validation";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  async created() {
    window.addEventListener("keydown", this.listenForEnter);

    if (this.modal.data.collectionName === "offices") {
      this.formData.newStructureType = "office";
      await this.fetchOptionsForStructure({
        id: this.modal.data.id,
        parentStructureRelation: "companies_offices",
        expand: ["company_id", "office_id"],
        parentStructure: "getCompanies",
      });
    }
    if (this.modal.data.collectionName === "divisions") {
      this.formData.newStructureType = "division";
      await this.fetchOptionsForStructure({
        id: this.modal.data.id,
        parentStructureRelation: "offices_divisions",
        expand: ["office_id", "division_id"],
        parentStructure: "getOfficesForOptions",
      });
    }
    if (this.modal.data.collectionName === "departments") {
      this.formData.newStructureType = "department";
      await this.fetchOptionsForStructure({
        id: this.modal.data.id,
        parentStructureRelation: "divisions_departments",
        expand: ["division_id", "department_id"],
        parentStructure: "getDivisionsForOptions",
      });
    }
    if (this.modal.data.collectionName === "groups") {
      this.formData.newStructureType = "group";
      await this.fetchOptionsForStructure({
        id: this.modal.data.id,
        parentStructureRelation: "departments_groups",
        expand: ["department_id", "group_id"],
        parentStructure: "getDepartmentsForOptions",
      });
    }
    if (this.formData.newStructureType === "office") {
      (this.formData.street = this.modal.data.street),
        (this.formData.streetNumber = this.modal.data.street_number),
        (this.formData.city = this.modal.data.city),
        (this.formData.country = this.modal.data.country);
      (this.oldStreet = this.modal.data.street),
        (this.oldStreetNumber = this.modal.data.street_number),
        (this.oldCity = this.modal.data.city),
        (this.oldCountry = this.modal.data.country);
    } else {
      this.formData.structureName = this.modal.data.name;
      this.formData.oldStructureName = this.modal.data.name;
    }
    this.pb.autoCancellation(false);
    this.formData.chosenOptions = this.structureBelongsTo;
    this.SET_OLD_STRUCTURE_DATA(
      JSON.parse(JSON.stringify(this.$data.formData))
    );
  },

  components: {
    FilterVue,
  },

  data() {
    return {
      formData: {
        newStructureType: "",
        structureName: "",
        street: "",
        chosenOptions: [],
        streetNumber: "",
        city: "",
        country: "",
        oldStructureName: "",
      },

      oldStreet: "",
      oldStreetNumber: "",
      oldCity: "",
      oldCountry: "",

      cancel,
      newStructureType_invalid: false,
      structureName_invalid: false,
      chosenOptions_invalid: false,
      street_invalid: false,
      streetNumber_invalid: false,
      city_invalid: false,
      country_invalid: false,
      pb,
      checkPermissions,
      editDisabled: true,
    };
  },
  validations() {
    return {
      formData: {
        newStructureType: {
          required: helpers.withMessage(
            "Pasirinkite struktūros tipą",
            required
          ),
        },
        chosenOptions: {
          required: helpers.withMessage("Pasirinkite kam priklauso", required),
        },
        structureName: {
          required:
            this.formData.newStructureType === "office"
              ? {}
              : helpers.withMessage("Įveskite struktūros pavadinimą", required),
          sameName:
            this.formData.newStructureType === "office"
              ? {}
              : helpers.withMessage(
                  "Šis struktūros pavadinimas jau naudojamas",
                  this.sameName
                ),
          textRegex:
            this.formData.newStructureType === "office"
              ? {}
              : helpers.withMessage(
                  "Įveskite teisingą struktūros pavadinimą",
                  textRegex
                ),
        },
        street: {
          required:
            this.formData.newStructureType === "office"
              ? helpers.withMessage("Įveskite gatvės pavadinimą", required)
              : {},
          streetRegex:
            this.formData.newStructureType === "office"
              ? helpers.withMessage(
                  "Įveskite teisingą gatvės pavadinimą",
                  streetRegex
                )
              : {},
        },
        streetNumber: {
          required:
            this.formData.newStructureType === "office"
              ? helpers.withMessage("Įveskite gatvės numerį", required)
              : {},
          streetNumberRegex:
            this.formData.newStructureType === "office"
              ? helpers.withMessage(
                  "Įveskite teisingą gatvės numerį",
                  streetNumberRegex
                )
              : {},
        },
        city: {
          required:
            this.formData.newStructureType === "office"
              ? helpers.withMessage("Įveskite miesto pavadinimą", required)
              : {},
          cityRegex:
            this.formData.newStructureType === "office"
              ? helpers.withMessage(
                  "Įveskite teisingą miesto pavadinimą",
                  cityRegex
                )
              : {},
        },
        country: {
          required:
            this.formData.newStructureType === "office"
              ? helpers.withMessage("Įveskite šalies pavadinimą", required)
              : {},
          countryRegex:
            this.formData.newStructureType === "office"
              ? helpers.withMessage(
                  "Įveskite teisingą šalies pavadinimą",
                  textRegex
                )
              : {},
        },
      },
    };
  },
  watch: {
    formData: {
      handler(newData) {
        this.objectsHaveSameValues(newData, this.oldStructureData)
          ? (this.editDisabled = true)
          : (this.editDisabled = false);
      },
      deep: true,
    },
    v$(newval) {
      this.v$.formData.newStructureType.$error
        ? (this.newStructureType_invalid = true)
        : null;
      this.v$.formData.structureName.$error
        ? (this.structureName_invalid = true)
        : null;
      this.v$.formData.chosenOptions.$error
        ? (this.chosenOptions_invalid = true)
        : null;
      this.v$.formData.street.$error ? (this.street_invalid = true) : null;
      this.v$.formData.streetNumber.$error
        ? (this.streetNumber_invalid = true)
        : null;
      this.v$.formData.city.$error ? (this.city_invalid = true) : null;
      this.v$.formData.country.$error ? (this.country_invalid = true) : null;
    },
  },
  computed: {
    ...mapGetters([
      "modal",
      "companies",
      "choiceOptionsForStructure",
      "nameCheck",
      "structureBelongsTo",
      "oldStructureData",
    ]),

    newStructureTypeClass() {
      return { "md-invalid": this.newStructureType_invalid };
    },
    structureNameClass() {
      return { "md-invalid": this.structureName_invalid };
    },
    chosenOptionsClass() {
      return { "md-invalid": this.chosenOptions_invalid };
    },
    streetClass() {
      return { "md-invalid": this.street_invalid };
    },
    streetNumberClass() {
      return { "md-invalid": this.streetNumber_invalid };
    },
    cityClass() {
      return { "md-invalid": this.city_invalid };
    },
    countryClass() {
      return { "md-invalid": this.country_invalid };
    },
  },
  methods: {
    ...mapActions([
      "setModal",
      "updateCompany",
      "pushToQueue",
      "fetchOptionsForStructure",
      "updateGroup",
      "updateDivision",
      "updateOffice",
      "updateDepartment",
    ]),
    ...mapMutations([
      "SET_CHOICE_OPTIONS_FOR_STRUCTURE",
      "SET_STRUCTURE_BELONGS_TO",
      "SET_OLD_STRUCTURE_DATA",
    ]),

    handleStructureChange(val) {
      this.SET_STRUCTURE_BELONGS_TO(val);
      console.log(val);
      this.formData.chosenOptions = val;
    },
    sameOffice(street, streetNumber, city, country) {
      if (this.formData.newStructureType === "office") {
        return street === this.oldStreet &&
          streetNumber === this.oldStreetNumber &&
          city === this.oldCity &&
          country === this.oldCountry
          ? false
          : this.nameCheck.some((structure) => {
              return structure.collectionName === "offices"
                ? structure.street.toLowerCase().trim() ===
                    street.toLowerCase().trim() &&
                    structure.street_number.toLowerCase() ===
                      streetNumber.toLowerCase() &&
                    structure.city.toLowerCase().trim() ===
                      city.toLowerCase().trim() &&
                    structure.country.toLowerCase().trim() ===
                      country.toLowerCase().trim()
                : null;
            });
      }
    },

    sameName(name) {
      return this.formData.structureName.toLocaleLowerCase() ===
        this.formData.oldStructureName.toLocaleLowerCase()
        ? true
        : !this.nameCheck.some(
            (structure) =>
              structure.name.toLowerCase().trim() === name.toLowerCase().trim()
          );
    },
    arraysHaveSameValues(arr1, arr2) {
      const set1 = new Set(arr1);
      const set2 = new Set(arr2);

      if (set1.size !== set2.size) {
        return false;
      }

      for (const item of set1) {
        if (!set2.has(item)) {
          return false;
        }
      }

      return true;
    },
    objectsHaveSameValues(obj1, obj2) {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) {
        return false;
      }

      for (const key of keys1) {
        if (key === "chosenOptions") {
          if (!this.arraysHaveSameValues(obj1[key], obj2[key])) {
            return false;
          }
        } else {
          if (obj1[key] !== obj2[key]) {
            return false;
          }
        }
      }
      return true;
    },

    async handleEdit() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) {
        console.log(this.v$);
        return;
      }

      if (
        this.sameOffice(
          this.formData.street,
          this.formData.streetNumber,
          this.formData.city,
          this.formData.country
        )
      ) {
        this.pushToQueue({
          message: "Negali egzistuoti du ofisai su tuo pačiu adresu",
          status: "failure",
        });
        return;
      }

      if (this.formData.newStructureType === "group") {
        await this.updateGroup({
          id: this.modal.data.id,
          data: {
            name: this.formData.structureName,
          },
          structureBelongsTo: this.structureBelongsTo,
        });
      }
      if (this.formData.newStructureType === "division") {
        await this.updateDivision({
          id: this.modal.data.id,
          data: {
            name: this.formData.structureName,
          },
          structureBelongsTo: this.structureBelongsTo,
        });
      }
      if (this.formData.newStructureType === "office") {
        await this.updateOffice({
          id: this.modal.data.id,
          data: {
            name:
              this.formData.street +
              " " +
              this.formData.streetNumber +
              ", " +
              this.formData.city +
              ", " +
              this.formData.country,
            street: this.formData.street,
            street_number: this.formData.streetNumber,
            city: this.formData.city,
            country: this.formData.country,
          },
          structureBelongsTo: this.structureBelongsTo,
        });
      }
      if (this.formData.newStructureType === "department") {
        await this.updateDepartment({
          id: this.modal.data.id,
          data: {
            name: this.formData.structureName,
          },
          structureBelongsTo: this.structureBelongsTo,
        });
      }
    },

    handleCancel() {
      this.setModal({});
    },

    listenForEnter(e) {
      if (e.keyCode === 13) {
        this.handleEdit();
      }
    },
  },

  beforeDestroy() {
    window.removeEventListener("keydown", this.listenForEnter);
    this.SET_STRUCTURE_BELONGS_TO([]);
    this.SET_CHOICE_OPTIONS_FOR_STRUCTURE([]);
    this.pb.autoCancellation(true);
  },
};
</script>

<style scoped>
.delete {
  position: absolute !important;
  top: 5px !important;
  right: 5px !important;
}
button:disabled {
  background-color: grey !important;
}
.edit {
  background: #ffffff;
}
.label {
  color: #fff !important;
}
</style>
