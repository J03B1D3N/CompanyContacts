<template>
  <div
    class="form w-4/6 h-4/6 cursor-default flex items-start relative p-12 pt-12 gap-36"
  >
    <div class="contacts w-2/6">
      <h1 class="text-3xl">Redaguoti paskyrą:</h1>
      <div class="names w-full">
        <md-field :class="usernameClass">
          <label for="name">Vardas:</label>
          <md-input
            :disabled="formData.username === 'admin'"
            ref="name"
            v-model="formData.username"
            maxlength="40"
            id="name"
            placeholder="Įveskite vardą..."
            @input="formData.invalid_username = false"
          ></md-input>
          <span class="md-error" v-if="v$.formData.username.$error"
            >{{ v$.formData.username.$errors[0].$message }}
          </span>
        </md-field>
        <md-field :class="emailClass">
          <label>Elektroninis paštas:</label>
          <md-input
            disabled
            v-model="formData.email"
            maxlength="40"
            placeholder="Įveskite el. paštą..."
            @input="formData.invalid_email = false"
          ></md-input>
        </md-field>
      </div>
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

    <div class="w-2/6">
      <h1 class="text-3xl">Administracinės teisės:</h1>
      <div class="flex flex-col w-full">
        <md-checkbox
          v-model="formData.edit_employees"
          :disabled="formData.username === 'admin'"
          class="md-primary"
          >Redaguoti ir kurti kontaktus</md-checkbox
        >
        <md-checkbox
          v-model="formData.delete_employees"
          :disabled="formData.username === 'admin'"
          class="md-primary"
          >Trinti kontaktus</md-checkbox
        >
        <md-checkbox
          v-model="formData.edit_companies"
          :disabled="formData.username === 'admin'"
          class="md-primary"
          >Redaguoti ir kurti įmones</md-checkbox
        >
        <md-checkbox
          v-model="formData.delete_companies"
          :disabled="formData.username === 'admin'"
          class="md-primary"
          >Trinti įmones</md-checkbox
        >
        <md-checkbox
          v-model="formData.edit_offices"
          :disabled="formData.username === 'admin'"
          class="md-primary"
          >Redaguoti ir kurti ofisus</md-checkbox
        >
        <md-checkbox
          v-model="formData.delete_offices"
          :disabled="formData.username === 'admin'"
          class="md-primary"
          >Trinti ofisus</md-checkbox
        >
        <md-checkbox
          v-model="formData.edit_structure"
          :disabled="formData.username === 'admin'"
          class="md-primary"
          >Redaguoti ir kurti struktūras</md-checkbox
        >
        <md-checkbox
          v-model="formData.delete_structure"
          :disabled="formData.username === 'admin'"
          class="md-primary"
          >Trinti struktūras</md-checkbox
        >
      </div>
    </div>

    <div class="absolute bottom-10 right-20">
      <md-button
        class="redaguoti md-raised main-btn btn"
        @click="handleSubmit"
        :disabled="editDisabled"
        >Redaguoti</md-button
      >
    </div>
    <div class="absolute top-10 right-10">
      <md-button class="cancel md-icon-button main-btn" @click="handleCancel">
        <img :src="formData.cancel" alt="cross" />
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import cancel from "../../../assets/cancel.svg";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  sameAs,
  helpers,
} from "@vuelidate/validators";
import { textRegex } from "../validation";
import isEqual from "lodash/isEqual";
import { pb } from "../../../lib/pocketbase";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  async created() {
    this.pb.autoCancellation(false);
    window.addEventListener("keydown", this.listenForEnter);
    this.getAllUsers();
    await this.fetchPermissions(this.modal.data.permissions_id);
    this.formData.username = this.modal.data.username;
    this.formData.oldUsername = this.modal.data.username;

    this.formData.email = this.modal.data.email;
    this.modal.data.avatar
      ? (this.formData.photo = this.modal.data.avatar)
      : "Nėra įkeltos nuotraukos";
    this.formData.edit_employees = this.user_permissions.edit_employees;
    this.formData.delete_employees = this.user_permissions.delete_employees;
    this.formData.edit_companies = this.user_permissions.edit_companies;
    this.formData.delete_companies = this.user_permissions.delete_companies;
    this.formData.edit_offices = this.user_permissions.edit_offices;
    this.formData.delete_offices = this.user_permissions.delete_offices;
    this.formData.edit_structure = this.user_permissions.edit_structure;
    this.formData.delete_structure = this.user_permissions.delete_structure;
    this.SET_OLD_DATA(JSON.parse(JSON.stringify(this.$data.formData)));
  },
  mounted() {
    this.$refs.name.$el.focus();
  },
  computed: {
    ...mapGetters([
      "users",
      "modal",
      "user_permissions",
      "allUsers",
      "oldData",
    ]),
    usernameClass() {
      return { "md-invalid": this.formData.invalid_username };
    },
    emailClass() {
      return { "md-invalid": this.formData.invalid_email };
    },
  },
  methods: {
    ...mapActions([
      "pushToQueue",
      "updateUser",
      "setModal",
      "fetchPermissions",
      "getAllUsers",
    ]),
    ...mapMutations(["SET_OLD_DATA"]),
    handleUpload() {
      this.$refs.fileUpload.click();
    },

    updateUpload(event) {
      if (!event.target.files[0]) {
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
      }

      this.formData.photo = event.target.files[0].name;
    },

    async handleSubmit() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) {
        return;
      }

      const updateAccount = new FormData();
      updateAccount.append("username", this.formData.username);
      updateAccount.append("permissions_id", this.modal.data.permissions_id);

      const permissions = {
        edit_employees: this.formData.edit_employees,
        delete_employees: this.formData.delete_employees,
        edit_companies: this.formData.edit_companies,
        delete_companies: this.formData.delete_companies,
        edit_offices: this.formData.edit_offices,
        delete_offices: this.formData.delete_offices,
        edit_structure: this.formData.edit_structure,
        delete_structure: this.formData.delete_structure,
      };

      this.$refs.fileUpload.files[0]
        ? updateAccount.append("avatar", this.$refs.fileUpload.files[0])
        : null;

      this.updateUser({
        user: {
          id: this.modal.data.id,
          data: updateAccount,
        },
        permissions: {
          id: this.modal.data.permissions_id,
          data: permissions,
        },
      });
    },

    handleCancel() {
      this.setModal({});
    },
    listenForEnter(e) {
      if (e.keyCode === 13) {
        this.handleSubmit();
      }
    },
    emailTaken(email) {
      return this.allUsers.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );
    },
    usernameTaken(username) {
      return username === this.formData.oldUsername
        ? true
        : !this.allUsers.some(
            (user) => user.username.toLowerCase() === username.toLowerCase()
          );
    },
  },

  data() {
    return {
      formData: {
        photo: "Nėra įkeltos nuotraukos",
        username: "",
        oldUsername: "",
        email: "",

        edit_employees: false,
        delete_employees: false,
        edit_companies: false,
        delete_companies: false,
        edit_offices: false,
        delete_offices: false,
        edit_structure: false,
        delete_structure: false,
        cancel,

        invalid_username: false,
        invalid_email: false,
        invalid_password: false,
        invalid_passwordConfirm: false,
        invalid_oldPassword: false,
      },
      editDisabled: true,
      pb,
    };
  },
  validations() {
    return {
      formData: {
        username: {
          required: helpers.withMessage("Įveskite vardą", required),
          isText: helpers.withMessage("Įveskite teisingą vardą", textRegex),
          usernameTaken: helpers.withMessage(
            "Šis vardas yra užimtas",
            this.usernameTaken
          ),
          minLength: helpers.withMessage(
            "Vardas turi būti ne trumpesnis nei 3 raidės",
            minLength(3)
          ),
        },
        email: {
          required: helpers.withMessage("Įveskite elektroninį paštą", required),
          email: helpers.withMessage(
            "Įveskite teisingą elektroninį paštą",
            email
          ),
          emailTaken: helpers.withMessage(
            "Šis elektroninis paštas yra užimtas",
            this.emailTaken
          ),
        },
      },
    };
  },
  watch: {
    formData: {
      handler(newData) {
        isEqual(newData, this.oldData)
          ? (this.editDisabled = true)
          : (this.editDisabled = false);
      },
      deep: true,
    },
    v$(newval) {
      this.v$.formData.username.$error
        ? (this.formData.invalid_username = true)
        : null;
      this.v$.formData.email.$error
        ? (this.formData.invalid_email = true)
        : null;
    },
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.listenForEnter);
    this.pb.autoCancellation(true);
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
  top: 50px !important;
  width: 155px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
