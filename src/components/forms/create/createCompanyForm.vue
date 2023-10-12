<template>
  <div class="form cursor-default w-full flex items-center justify-center">
    <div class="edit w-2/6 h-2/6 px-12 py-12 relative">
      <h1 class="text-3xl">Pridėkite naują įmonę:</h1>
      <div class="input flex flex-col">
        <md-field :class="companyClass">
          <label>Įmonės pavadinimas:</label>
          <md-input
            :placeholder="'Įveskite kompanijos pavadinimą...'"
            v-model="companyName"
            ref="companyInput"
            maxlength="128"
          ></md-input>
          <span class="md-error" v-if="v$.companyName.$error"
            >{{ v$.companyName.$errors[0].$message }}
          </span>
        </md-field>
      </div>
      <md-button
        type="submit"
        class="md-raised main-btn btn"
        @click="handleCreate"
        >Pridėti</md-button
      >
      <md-button
        class="md-icon-button main-btn delete btn"
        @click="handleCancel"
      >
        <img :src="cancel" alt="an x" />
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import cancel from "../../../assets/cancel.svg";
import { pb } from "../../../lib/pocketbase";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { companyRegex } from "./../validation";
export default {
  created() {
    pb.autoCancellation(false);
    window.addEventListener("keydown", this.listenForEnter);
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      companyName: "",
      companyName_invalid: false,
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
    v$(newval) {
      this.v$.companyName.$error ? (this.companyName_invalid = true) : null;
    },
  },

  computed: {
    ...mapGetters(["modal", "companies", "companiesNameCheck"]),
    companyClass() {
      return { "md-invalid": this.companyName_invalid };
    },
  },
  methods: {
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

    ...mapActions(["setModal", "createCompany"]),

    async handleCreate() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) {
        console.log(this.v$);
        this.$refs.companyInput.$el.focus();
        return;
      }
      const newCompany = {
        name: this.companyName,
      };
      await this.createCompany(newCompany);
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

  mounted() {
    this.$refs.companyInput.$el.focus();
  },
  beforeDestroy() {
    pb.autoCancellation(true);
    window.removeEventListener("keydown", this.listenForEnter);
  },
};
</script>

<style scoped>
.delete {
  position: absolute !important;
  top: 5px !important;
  right: 5px !important;
}
.edit {
  background: #ffffff;
}
</style>
