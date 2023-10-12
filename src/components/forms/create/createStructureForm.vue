<template>
  <div
    class="form w-2/6 h-7/12 cursor-default flex items-center justify-center"
  >
    <div class="create w-full h-full px-12 py-12 relative">
      <h1 class="text-3xl">Pridėkite naują struktūrą:</h1>
      <div class="input flex flex-col">
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field :class="newStructureTypeClass">
              <label for="newStructureType">Struktūros tipas:</label>
              <md-select
                v-model="newStructureType"
                name="newStructureType"
                id="newStructureType"
                @md-selected="fetchChosenOptions"
                :placeholder="'Pasirinkite struktūros tipą'"
              >
                <md-option
                  value="office"
                  v-if="checkPermissions('edit_offices')"
                  >Ofisas</md-option
                >
                <md-option
                  value="division"
                  v-if="checkPermissions('edit_structure')"
                  >Padalinys</md-option
                >
                <md-option
                  value="department"
                  v-if="checkPermissions('edit_structure')"
                  >Skyrius</md-option
                >
                <md-option
                  value="group"
                  v-if="checkPermissions('edit_structure')"
                  >Grupė</md-option
                >
              </md-select>
              <span class="md-error" v-if="v$.newStructureType.$error"
                >{{ v$.newStructureType.$errors[0].$message }}
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
            :forStructure="true"
            :error-props="
              Object.keys(v$).length > 0 ? v$.chosenOptions.$errors : []
            "
          />

          <div class="md-layout-item" v-if="newStructureType !== 'office'">
            <md-field :class="structureNameClass">
              <label>Pavadinimas:</label>
              <md-input
                :placeholder="'Įveskite pavadinimą'"
                v-model="structureName"
                maxlength="40"
                @input="structureName_invalid = false"
              ></md-input>
              <span class="md-error" v-if="v$.structureName.$error"
                >{{ v$.structureName.$errors[0].$message }}
              </span>
            </md-field>
          </div>

          <div class="md-layout-item" v-if="newStructureType === 'office'">
            <md-field :class="streetClass">
              <label>Gatvė:</label>
              <md-input
                :placeholder="'Įveskite gatvės pavadinimą...'"
                v-model="street"
                maxlength="40"
                @input="street_invalid = false"
              ></md-input>
              <span class="md-error" v-if="v$.street.$error"
                >{{ v$.street.$errors[0].$message }}
              </span>
            </md-field>
          </div>
          <div class="md-layout-item" v-if="newStructureType === 'office'">
            <md-field :class="streetNumberClass">
              <label>Gatvės numeris:</label>
              <md-input
                :placeholder="'Įveskite gatvės numerį...'"
                v-model="streetNumber"
                maxlength="10"
                @input="streetNumber_invalid = false"
              ></md-input>
              <span class="md-error" v-if="v$.streetNumber.$error"
                >{{ v$.streetNumber.$errors[0].$message }}
              </span>
            </md-field>
          </div>
          <div class="md-layout-item" v-if="newStructureType === 'office'">
            <md-field :class="cityClass">
              <label>Miestas:</label>
              <md-input
                :placeholder="'Įveskite miesto pavadinimą...'"
                v-model="city"
                maxlength="40"
                @input="city_invalid = false"
              ></md-input>
              <span class="md-error" v-if="v$.city.$error"
                >{{ v$.city.$errors[0].$message }}
              </span>
            </md-field>
          </div>
          <div class="md-layout-item" v-if="newStructureType === 'office'">
            <md-field :class="countryClass">
              <label>Šalis:</label>
              <md-input
                :placeholder="'Įveskite šalies pavadinimą...'"
                v-model="country"
                maxlength="40"
                @input="country_invalid = false"
              ></md-input>
              <span class="md-error" v-if="v$.country.$error"
                >{{ v$.country.$errors[0].$message }}
              </span>
            </md-field>
          </div>
        </div>
      </div>
      <md-button
        type="submit"
        class="md-raised main-btn btn"
        @click="handleCreate"
        >Sukurti</md-button
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
  created() {
    pb.autoCancellation(false);
    window.addEventListener("keydown", this.listenForEnter);
  },
  components: {
    FilterVue,
  },

  data() {
    return {
      newStructureType: "",
      structureName: "",
      cancel,
      chosenOptions: [],
      street: "",
      streetNumber: "",
      city: "",
      country: "",

      newStructureType_invalid: false,
      structureName_invalid: false,
      chosenOptions_invalid: false,
      street_invalid: false,
      streetNumber_invalid: false,
      city_invalid: false,
      country_invalid: false,
      pb,
      checkPermissions,
    };
  },
  validations() {
    return {
      newStructureType: {
        required: helpers.withMessage("Pasirinkite struktūros tipą", required),
      },
      chosenOptions: {
        required: helpers.withMessage("Pasirinkite kam priklauso", required),
      },
      structureName: {
        required:
          this.newStructureType === "office"
            ? {}
            : helpers.withMessage("Įveskite struktūros pavadinimą", required),
        sameName:
          this.newStructureType === "office"
            ? {}
            : helpers.withMessage(
                "Šis struktūros pavadinimas jau naudojamas",
                this.sameName
              ),
        textRegex:
          this.newStructureType === "office"
            ? {}
            : helpers.withMessage(
                "Įveskite teisingą struktūros pavadinimą",
                textRegex
              ),
      },
      street: {
        required:
          this.newStructureType === "office"
            ? helpers.withMessage("Įveskite gatvės pavadinimą", required)
            : {},
        streetRegex:
          this.newStructureType === "office"
            ? helpers.withMessage(
                "Įveskite teisingą gatvės pavadinimą",
                streetRegex
              )
            : {},
      },
      streetNumber: {
        required:
          this.newStructureType === "office"
            ? helpers.withMessage("Įveskite gatvės numerį", required)
            : {},
        streetNumberRegex:
          this.newStructureType === "office"
            ? helpers.withMessage(
                "Įveskite teisingą gatvės numerį",
                streetNumberRegex
              )
            : {},
      },
      city: {
        required:
          this.newStructureType === "office"
            ? helpers.withMessage("Įveskite miesto pavadinimą", required)
            : {},
        cityRegex:
          this.newStructureType === "office"
            ? helpers.withMessage(
                "Įveskite teisingą miesto pavadinimą",
                cityRegex
              )
            : {},
      },
      country: {
        required:
          this.newStructureType === "office"
            ? helpers.withMessage("Įveskite šalies pavadinimą", required)
            : {},
        countryRegex:
          this.newStructureType === "office"
            ? helpers.withMessage(
                "Įveskite teisingą šalies pavadinimą",
                textRegex
              )
            : {},
      },
    };
  },
  watch: {
    v$(newval) {
      this.v$.newStructureType.$error
        ? (this.newStructureType_invalid = true)
        : null;
      this.v$.structureName.$error ? (this.structureName_invalid = true) : null;
      this.v$.chosenOptions.$error ? (this.chosenOptions_invalid = true) : null;
      this.v$.street.$error ? (this.street_invalid = true) : null;
      this.v$.streetNumber.$error ? (this.streetNumber_invalid = true) : null;
      this.v$.city.$error ? (this.city_invalid = true) : null;
      this.v$.country.$error ? (this.country_invalid = true) : null;
    },
  },

  computed: {
    ...mapGetters([
      "modal",
      "companies",
      "choiceOptionsForStructure",
      "nameCheck",
      "structureBelongsTo",
      "officesForOptions",
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
      "createCompany",
      "pushToQueue",
      "fetchOptionsForStructure",
      "createGroup",
      "createDivision",
      "createOffice",
      "createDepartment",
    ]),
    ...mapMutations([
      "SET_CHOICE_OPTIONS_FOR_STRUCTURE",
      "SET_STRUCTURE_BELONGS_TO",
      "SET_OFFICES_PER_PAGE",
      "SET_DIVISIONS_PER_PAGE",
      "SET_DEPARTMENTS_PER_PAGE",
      "SET_GROUPS_PER_PAGE",
    ]),

    handleStructureChange(val) {
      this.SET_STRUCTURE_BELONGS_TO(val);
      this.chosenOptions = val;
    },

    async fetchChosenOptions() {
      this.newStructureType_invalid = false;
      this.SET_STRUCTURE_BELONGS_TO([]);
      if (this.newStructureType.length === 0) {
        this.SET_CHOICE_OPTIONS_FOR_STRUCTURE([]);
        this.chosenOptions = "";
      }
      this.newStructureType === "office"
        ? await this.fetchOptionsForStructure({
            parentStructure: "getCompanies",
          })
        : null;
      this.newStructureType === "division"
        ? await this.fetchOptionsForStructure({
            parentStructure: "getOfficesForOptions",
          })
        : null;
      this.newStructureType === "department"
        ? await this.fetchOptionsForStructure({
            parentStructure: "getDivisionsForOptions",
          })
        : null;
      this.newStructureType === "group"
        ? await this.fetchOptionsForStructure({
            parentStructure: "getDepartmentsForOptions",
          })
        : null;
    },

    sameName(name) {
      return !this.nameCheck.some(
        (structure) =>
          structure.name.toLowerCase() === name.toLowerCase().trim()
      );
    },
    sameOffice(street, streetNumber, city, country) {
      return this.newStructureType === "office"
        ? this.nameCheck.some((structure) => {
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
          })
        : null;
    },

    async handleCreate() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) {
        console.log(this.v$);
        return;
      }
      if (
        this.sameOffice(this.street, this.streetNumber, this.city, this.country)
      ) {
        this.pushToQueue({
          message: "Negali egzistuoti du ofisai tuo pačiu adresu",
          status: "failure",
        });
        return;
      }
      if (this.newStructureType === "group") {
        await this.createGroup({
          name: this.structureName,
          structureBelongsTo: this.structureBelongsTo,
        });
      }
      if (this.newStructureType === "division") {
        await this.createDivision({
          name: this.structureName,
          structureBelongsTo: this.structureBelongsTo,
        });
      }
      if (this.newStructureType === "office") {
        await this.createOffice({
          structureBelongsTo: this.structureBelongsTo,
          name:
            this.street +
            " " +
            this.streetNumber +
            ", " +
            this.city +
            ", " +
            this.country,
          street: this.street,
          street_number: this.streetNumber,
          city: this.city,
          country: this.country,
        });
      }
      if (this.newStructureType === "department") {
        await this.createDepartment({
          name: this.structureName,
          structureBelongsTo: this.structureBelongsTo,
        });
      }
    },

    handleCancel() {
      this.setModal({});
    },

    listenForEnter(e) {
      if (e.keyCode === 13) {
        this.handleCreate();
      }
    },
  },

  beforeDestroy() {
    window.removeEventListener("keydown", this.listenForEnter);
    pb.autoCancellation(true);
    this.SET_STRUCTURE_BELONGS_TO([]);
    this.SET_CHOICE_OPTIONS_FOR_STRUCTURE([]);
  },
};
</script>

<style scoped>
.delete {
  position: absolute !important;
  top: 5px !important;
  right: 5px !important;
}
.create {
  background: #ffffff;
}

.label {
  color: #fff !important;
}
</style>
