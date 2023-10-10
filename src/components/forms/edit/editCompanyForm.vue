<template>
  <div
    class="form cursor-default w-full flex items-center justify-center"
    v-if="Object.keys(modal).length > 0"
  >
    <div class="edit w-2/6 h-2/6 px-12 py-12 relative">
      <h1 class="text-3xl">Redaguoti įmonę:</h1>
      <div class="input flex flex-col">
        <md-field :class="companyClass">
          <label>Įmonės pavadinimas:</label>
          <md-input
            :placeholder="'Įveskite kompanijos pavadinimą...'"
            v-model="companyName"
            ref="companyInput"
            @keydown="listenForEnter"
            maxlength="128"
          ></md-input>
          <span class="md-error" v-if="v$.companyName.$error"
            >{{ v$.companyName.$errors[0].$message }}
          </span>
        </md-field>
      </div>
      <md-button
        class="md-raised main-btn btn"
        :disabled="editDisabled"
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
import { mapActions, mapGetters } from "vuex";
import cancel from "../../../assets/cancel.svg";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { companyRegex } from "./../validation";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  computed: {
    ...mapGetters(["modal", "companies", "companiesNameCheck"]),
    companyClass() {
      return { "md-invalid": this.companyName_invalid };
    },
  },
  methods: {
    ...mapActions(["setModal", "updateCompany", "pushToQueue"]),

    sameName(name) {
      if (Object.keys(this.companiesNameCheck).length === 0) {
        return true;
      }
      if (this.companies.items.length > 0) {
        return !this.companiesNameCheck.items.some(
          (company) => company.name.toLowerCase() === name.toLowerCase()
        );
      } else return true;
    },

    updated_at() {
      const now = new Date();
      const isoTimestamp = now.toISOString();
      return isoTimestamp;
    },

    async handleEdit() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) {
        console.log(this.v$);
        this.$refs.companyInput.$el.focus();
        return;
      }
      const updateCompany = {
        id: this.modal.data.id,
        data: {
          collectionId: this.modal.data.collectionId,
          collectionName: this.modal.data.collectionName,
          created: this.modal.data.created,
          id: this.modal.data.id,
          name: this.companyName,
          updated: this.updated_at(),
        },
      };
      this.updateCompany(updateCompany);
      this.setModal({});
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

  data() {
    return {
      companyName: "",
      oldCompanyName: "",
      companyName_invalid: false,
      editDisabled: true,
      cancel,
    };
  },
  validations() {
    return {
      companyName: {
        required: helpers.withMessage(
          "Įveskite kompanijos pavadinimą",
          required
        ),
        sameName: helpers.withMessage(
          "Negali egzistuoti 2 kompanijos tuo pačiu pavadinimu",
          this.sameName
        ),
        companyRegex: helpers.withMessage(
          "Įveskite teisingą kompanijos pavadinimą",
          companyRegex
        ),
      },
    };
  },
  watch: {
    companyName: {
      handler(newVal) {
        newVal === this.oldCompanyName
          ? (this.editDisabled = true)
          : (this.editDisabled = false);
      },
    },
    v$(newval) {
      this.v$.companyName.$error ? (this.companyName_invalid = true) : null;
    },
  },

  created() {
    this.companyName = this.modal.data.name;
    this.oldCompanyName = this.modal.data.name;
  },

  mounted() {
    this.$refs.companyInput.$el.focus();
  },
};
</script>

<style scoped>
button:disabled {
  background-color: grey !important;
}
.delete {
  position: absolute !important;
  top: 5px !important;
  right: 5px !important;
}
.edit {
  background: #ffffff;
}
</style>
