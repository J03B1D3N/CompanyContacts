<template>
  <div
    class="form w-4/6 h-4/6 cursor-default flex items-start relative p-12 pt-24 gap-16"
  >
    <div class="contacts w-2/6">
      <h1 class="text-3xl">Sukurti kontaką:</h1>
      <div class="names w-full">
        <md-field :class="nameClass">
          <label for="name">Vardas:</label>
          <md-input
            v-model="formData.name"
            maxlength="40"
            id="name"
            placeholder="Įveskite vardą..."
            @input="invalid_name = false"
          ></md-input>
          <span class="md-error" v-if="v$.formData.name.$error"
            >{{ v$.formData.name.$errors[0].$message }}
          </span>
        </md-field>
        <md-field :class="surnameClass">
          <label>Pavardė:</label>
          <md-input
            v-model="formData.surname"
            maxlength="40"
            placeholder="Įveskite pavardę..."
            @input="invalid_surname = false"
          ></md-input>
          <span class="md-error" v-if="v$.formData.surname.$error"
            >{{ v$.formData.surname.$errors[0].$message }}
          </span>
        </md-field>
        <md-field :class="positionClass">
          <label>Pozicija:</label>
          <md-input
            v-model="formData.position"
            maxlength="40"
            placeholder="Įveskite poziciją..."
            @input="invalid_position = false"
          ></md-input>
          <span class="md-error" v-if="v$.formData.position.$error"
            >{{ v$.formData.position.$errors[0].$message }}
          </span>
        </md-field>
      </div>

      <div>
        <h1 class="text-xl">Kontaktinė informacija:</h1>
        <div>
          <md-field :class="emailClass">
            <label>Elektroninis paštas:</label>
            <md-input
              v-model="formData.email"
              maxlength="40"
              placeholder="Įveskite elektroninį paštą..."
              @input="invalid_email = false"
            ></md-input>
            <span class="md-error" v-if="v$.formData.email.$error"
              >{{ v$.formData.email.$errors[0].$message }}
            </span>
          </md-field>
          <md-field :class="phoneClass">
            <label>Telefono numeris:</label>
            <md-input
              v-model="formData.phone_number"
              maxlength="17"
              placeholder="Įveskite telefono numerį..."
              @input="invalid_phone = false"
            ></md-input>
            <span class="md-error" v-if="v$.formData.phone_number.$error"
              >{{ v$.formData.phone_number.$errors[0].$message }}
            </span>
          </md-field>
        </div>
      </div>
    </div>

    <div class="w-2/6">
      <h1 class="text-3xl">Įmonės detalės:</h1>
      <div class="md-layout md-gutter flex flex-col items-center w-full">
        <FilterVue
          :items="companies.items"
          :filter_name="{
            placeholder: 'Pasirinkite kompaniją...',
            name: 'Kompanija',
          }"
          :val="selectedCompany"
          :edit="true"
          :componentClass="companyClass"
          @structureChange="handleCompanyChange"
          @selected="$event ? (invalid_company = false) : null"
          :error-props="
            Object.keys(v$).length > 0 ? v$.formData.company.$errors : []
          "
        />

        <FilterVue
          :items="offices.items"
          :filter_name="{
            placeholder: 'Pasirinkite ofisą...',
            name: 'Ofisas',
          }"
          :val="selectedOffice"
          :edit="true"
          :componentClass="officeClass"
          @structureChange="handleOfficeChange"
          @selected="$event ? (invalid_office = false) : null"
          :error-props="
            Object.keys(v$).length > 0 ? v$.formData.office.$errors : []
          "
        />

        <FilterVue
          :items="divisions.items"
          :filter_name="{
            placeholder: 'Pasirinkite padalinį...',
            name: 'Padalinys',
          }"
          :val="selectedDivision"
          :edit="true"
          :componentClass="divisionClass"
          @structureChange="handleDivisionChange"
          @selected="$event ? (invalid_division = false) : null"
          :error-props="
            Object.keys(v$).length > 0 ? v$.formData.division.$errors : []
          "
        />

        <FilterVue
          :items="departments.items"
          :filter_name="{
            placeholder: 'Pasirinkite skyrių...',
            name: 'Skyrius',
          }"
          :val="selectedDepartment"
          :edit="true"
          @structureChange="handleDepartmentChange"
        />

        <FilterVue
          :items="groups.items"
          :filter_name="{
            placeholder: 'Pasirinkite grupę...',
            name: 'Grupė',
          }"
          :val="selectedGroup"
          :edit="true"
          @structureChange="handleGroupChange"
        />
        <div class="upload flex gap-5 items-center justify-center relative">
          <md-button
            class="w-56 md-raised main-btn relative btn"
            @click="handleUpload"
          >
            <label for="fileUpload" class="w-full cursor-pointer" @click.stop>
              Įkelti nuotrauką
              <input
                type="file"
                id="fileUpload"
                style="display: none"
                ref="fileUpload"
                accept=".jpg, .jpeg, .png"
                size="524288"
                @change="updateUpload"
              />
            </label>
          </md-button>
          <div class="status absolute overflow-hidden turnicate">
            {{ formData.photo }}
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-10 right-20">
      <md-button
        class="redaguoti md-raised main-btn btn"
        :disabled="editDisabled"
        @click="handleSubmit"
        >Redaguoti</md-button
      >
    </div>
    <div class="absolute top-10 right-10">
      <md-button class="cancel md-icon-button main-btn" @click="handleCancel">
        <img :src="cancel" alt="cross" />
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import cancel from "../../../assets/cancel.svg";
import FilterVue from "../../components/filter.vue";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import {
  textRegex,
  phoneRegex,
  emailRegex,
  positionRegex,
} from "./../validation";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      formData: {
        photo: "Nėra įkeltos nuotraukos",
        name: "",
        surname: "",
        position: "",
        email: "",
        phone_number: "",
        company: "",
        office: "",
        division: "",
        department: "",
        group: "",
      },
      editDisabled: true,
      cancel,
      invalid_name: false,
      invalid_surname: false,
      invalid_position: false,
      invalid_email: false,
      invalid_phone: false,

      invalid_company: false,
      invalid_office: false,
      invalid_division: false,
    };
  },
  validations() {
    return {
      formData: {
        name: {
          required: helpers.withMessage("Įveskite vardą", required),
          textRegex: helpers.withMessage("Įveskite teisingą vardą", textRegex),
        },
        surname: {
          required: helpers.withMessage("Įveskite pavardę", required),
          textRegex: helpers.withMessage(
            "Įveskite teisingą pavardę",
            textRegex
          ),
        },
        position: {
          required: helpers.withMessage("Įveskite poziciją", required),
          positionRegex: helpers.withMessage(
            "Įveskite teisingą poziciją",
            positionRegex
          ),
        },
        email: {
          required: helpers.withMessage("Įveskite elektroninį paštą", required),
          emailRegex: helpers.withMessage(
            "Įveskite teisingą elektroninį paštą",
            emailRegex
          ),
        },
        phone_number: {
          required: helpers.withMessage("Įveskite telefono numerį", required),
          phoneRegex: helpers.withMessage(
            "Įveskite teisingą telefono numerį",
            phoneRegex
          ),
        },
        company: {
          required: helpers.withMessage("Pasirinkite kompaniją", required),
        },
        office: {
          required: helpers.withMessage("Pasirinkite ofisą", required),
        },
        division: {
          required: helpers.withMessage("Pasirinkite padalinį", required),
        },
      },
    };
  },
  watch: {
    formData: {
      handler(newData) {
        this.objectsHaveSameValues(newData, this.oldEmployeeData)
          ? (this.editDisabled = true)
          : (this.editDisabled = false);
      },
      deep: true,
    },
    v$(newval) {
      this.v$.formData.name.$error ? (this.invalid_name = true) : null;
      this.v$.formData.surname.$error ? (this.invalid_surname = true) : null;
      this.v$.formData.position.$error ? (this.invalid_position = true) : null;
      this.v$.formData.email.$error ? (this.invalid_email = true) : null;
      this.v$.formData.phone_number.$error ? (this.invalid_phone = true) : null;
      this.v$.formData.company.$error ? (this.invalid_company = true) : null;
      this.v$.formData.office.$error ? (this.invalid_office = true) : null;
      this.v$.formData.division.$error ? (this.invalid_division = true) : null;
    },
  },
  components: {
    FilterVue,
  },
  computed: {
    ...mapGetters([
      "companies",
      "departments",
      "offices",
      "groups",
      "divisions",
      "modal",
      "selectedCompany",
      "selectedOffice",
      "selectedDivision",
      "selectedDepartment",
      "selectedGroup",
      "filter",
      "create",
      "oldEmployeeData",
    ]),

    nameClass() {
      return { "md-invalid": this.invalid_name };
    },
    surnameClass() {
      return { "md-invalid": this.invalid_surname };
    },
    positionClass() {
      return { "md-invalid": this.invalid_position };
    },
    emailClass() {
      return { "md-invalid": this.invalid_email };
    },
    phoneClass() {
      return { "md-invalid": this.invalid_phone };
    },
    companyClass() {
      return { "md-invalid": this.invalid_company };
    },
    officeClass() {
      return { "md-invalid": this.invalid_office };
    },
    divisionClass() {
      return { "md-invalid": this.invalid_division };
    },
  },

  methods: {
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
    ...mapMutations([
      "SET_SELECTED_COMPANY",
      "SET_SELECTED_OFFICE",
      "SET_SELECTED_DIVISION",
      "SET_SELECTED_DEPARTMENT",
      "SET_SELECTED_GROUP",
      "CREATE_TOGGLE",
      "SET_OFFICES",
      "SET_DIVISIONS",
      "SET_DEPARTMENTS",
      "SET_GROUPS",
      "SET_OLD_EMPLOYEE_DATA",
    ]),

    ...mapActions([
      "getCompanies",
      "getCompanies_officesById",
      "getOffices_divisionsById",
      "getDivisions_departmentsById",
      "getDepartments_groupsById",
      "setModal",
      "updateEmployee",
      "pushToQueue",
    ]),
    updateUpload(event) {
      if (!event.target.files[0].type.startsWith("image/")) {
        this.pushToQueue({
          message: "Prašau įkelti nuotraukos tipo failus: .jpg, .png. webp",
          status: "failure",
        });
        event.target.value = "";
        return;
      }
      if (event.target.files[0].size > 524288) {
        this.pushToQueue({
          message: "Įkelta nuotrauka turi būti mažesnė nei 0.5mb",
          status: "failure",
        });
        event.target.value = "";
        return;
      }
      this.formData.photo = event.target.files[0].name;
    },

    handleCompanyChange(value) {
      if (this.create) {
        this.SET_OFFICES([]);
        this.SET_SELECTED_COMPANY(value);
        this.SET_SELECTED_OFFICE(null);
        this.formData.company = value;
        if (value !== null) {
          this.getCompanies_officesById(value);
        }
      }
    },
    handleOfficeChange(value) {
      if (this.create) {
        this.SET_DIVISIONS([]);
        this.SET_SELECTED_OFFICE(value);
        this.SET_SELECTED_DIVISION(null);
        this.formData.office = value;

        if (value !== null) {
          this.getOffices_divisionsById(value);
        }
      }
    },
    handleDivisionChange(value) {
      if (this.create) {
        this.SET_DEPARTMENTS([]);
        this.SET_SELECTED_DIVISION(value);
        this.SET_SELECTED_DEPARTMENT(null);
        this.formData.division = value;

        if (value !== null) {
          this.getDivisions_departmentsById(value);
        }
      }
    },
    handleDepartmentChange(value) {
      if (this.create) {
        this.SET_GROUPS([]);
        this.SET_SELECTED_DEPARTMENT(value);
        this.SET_SELECTED_GROUP(null);
        this.formData.department = value;

        if (value !== null) {
          this.getDepartments_groupsById(value);
        }
      }
    },
    handleGroupChange(value) {
      if (this.create) {
        this.formData.group = value;
        this.SET_SELECTED_GROUP(value);
      }
    },
    handleUpload() {
      this.$refs.fileUpload.click();
    },

    async handleSubmit() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) {
        console.log(this.v$);
        return;
      }

      const formData = new FormData();
      formData.append("name", this.formData.name);
      formData.append("surname", this.formData.surname);
      formData.append("email", this.formData.email);
      formData.append("phone_number", this.formData.phone_number);
      formData.append("position", this.formData.position);
      formData.append("company_id", this.selectedCompany);
      formData.append("office_id", this.selectedOffice);
      formData.append("division_id", this.selectedDivision);

      this.selectedDepartment
        ? formData.append("department_id", this.selectedDepartment)
        : formData.append("department_id", "");
      this.selectedGroup
        ? formData.append("group_id", this.selectedGroup)
        : formData.append("group_id", "");

      this.$refs.fileUpload.files[0]
        ? formData.append("photo", this.$refs.fileUpload.files[0])
        : null;

      const employee = {
        id: this.modal.data.id,
        data: formData,
      };
      await this.updateEmployee(employee);
    },

    handleCancel() {
      this.setModal({});
    },
  },

  created() {
    this.formData.photo = this.modal.data.photo;
    this.formData.name = this.modal.data.name;
    this.formData.surname = this.modal.data.surname;
    this.formData.position = this.modal.data.position;
    this.formData.email = this.modal.data.email;
    this.formData.phone_number = this.modal.data.phone_number;
    this.formData.company = this.modal.data.company_id;
    this.formData.office = this.modal.data.office_id;
    this.formData.division = this.modal.data.division_id;
    this.formData.department = this.modal.data.department_id;
    this.formData.group = this.modal.data.group_id;
    this.SET_OLD_EMPLOYEE_DATA(JSON.parse(JSON.stringify(this.$data.formData)));
    this.SET_SELECTED_COMPANY(this.modal.data.company_id);
    this.SET_SELECTED_OFFICE(this.modal.data.office_id);
    this.SET_SELECTED_DIVISION(this.modal.data.division_id);
    this.modal.data.department_id
      ? this.SET_SELECTED_DEPARTMENT(this.modal.data.department_id)
      : null;
    this.modal.data.group_id
      ? this.SET_SELECTED_GROUP(this.modal.data.group_id)
      : null;

    this.getCompanies_officesById(this.modal.data.company_id);
    this.getOffices_divisionsById(this.modal.data.office_id);
    this.getDivisions_departmentsById(this.modal.data.division_id);
    this.modal.data.department_id
      ? this.getDepartments_groupsById(this.modal.data.department_id)
      : null;
  },

  beforeDestroy() {
    this.SET_OFFICES([]);
    this.SET_DIVISIONS([]);
    this.SET_DEPARTMENTS([]);
    this.SET_GROUPS([]);
    if (this.filter.company) {
      this.SET_SELECTED_COMPANY(this.filter.company);
      this.getCompanies_officesById(this.filter.company);
    } else {
      this.SET_SELECTED_COMPANY(null);
    }
    if (this.filter.office) {
      this.SET_SELECTED_OFFICE(this.filter.office);
      this.getOffices_divisionsById(this.filter.office);
    } else {
      this.SET_SELECTED_OFFICE(null);
    }
    if (this.filter.division) {
      this.SET_SELECTED_DIVISION(this.filter.division);
      this.getDivisions_departmentsById(this.filter.division);
    } else {
      this.SET_SELECTED_DIVISION(null);
    }
    if (this.filter.department) {
      this.SET_SELECTED_DEPARTMENT(this.filter.department);
      this.getDepartments_groupsById(this.filter.department);
    } else {
      this.SET_SELECTED_DEPARTMENT(null);
    }
    if (this.filter.group) {
      this.SET_SELECTED_GROUP(this.filter.group);
    } else {
      this.SET_SELECTED_GROUP(null);
    }
    this.CREATE_TOGGLE();
  },
};
</script>

<style scoped>
button:disabled {
  background-color: grey !important;
}
.redaguoti,
.photo {
  width: 20rem !important;
}
.form {
  background-color: white;
}
.status {
  right: -160px !important;
  width: 155px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
