<template>
  <div
    class="form w-4/6 h-4/6 cursor-default flex items-start relative p-12 pt-12 gap-36"
  >
    <div class="contacts w-2/6">
      <h1 class="text-3xl">Sukurti naują paskyrą:</h1>
      <div class="names w-full">
        <md-field :class="usernameClass">
          <label for="name">Vardas:</label>
          <md-input
            ref="name"
            v-model="username"
            maxlength="40"
            id="name"
            placeholder="Įveskite vardą..."
            @input="invalid_username = false"
          ></md-input>
          <span class="md-error" v-if="v$.username.$error"
            >{{ v$.username.$errors[0].$message }}
          </span>
        </md-field>
        <md-field :class="emailClass">
          <label>Elektroninis paštas:</label>
          <md-input
            v-model="email"
            maxlength="40"
            placeholder="Įveskite el. paštą..."
            @input="invalid_email = false"
          ></md-input>
          <span class="md-error" v-if="v$.email.$error"
            >{{ v$.email.$errors[0].$message }}
          </span>
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
          {{ photo }}
        </div>
      </div>
    </div>

    <div class="w-2/6">
      <h1 class="text-3xl">Administracinės teisės:</h1>
      <div class="flex flex-col w-full">
        <md-checkbox v-model="edit_employees" class="md-primary"
          >Redaguoti ir kurti kontaktus</md-checkbox
        >
        <md-checkbox v-model="delete_employees" class="md-primary"
          >Trinti kontaktus</md-checkbox
        >
        <md-checkbox v-model="edit_companies" class="md-primary"
          >Redaguoti ir kurti įmones</md-checkbox
        >
        <md-checkbox v-model="delete_companies" class="md-primary"
          >Trinti įmones</md-checkbox
        >
        <md-checkbox v-model="edit_offices" class="md-primary"
          >Redaguoti ir kurti ofisus</md-checkbox
        >
        <md-checkbox v-model="delete_offices" class="md-primary"
          >Trinti ofisus</md-checkbox
        >
        <md-checkbox v-model="edit_structure" class="md-primary"
          >Redaguoti ir kurti struktūras</md-checkbox
        >
        <md-checkbox v-model="delete_structure" class="md-primary"
          >Trinti struktūras</md-checkbox
        >
      </div>
    </div>

    <div class="absolute bottom-10 right-20">
      <md-button class="redaguoti md-raised main-btn btn" @click="handleSubmit"
        >Sukurti</md-button
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
import { mapActions, mapGetters } from "vuex";
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
import { pb } from "../../../lib/pocketbase";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  created() {
    window.addEventListener("keydown", this.listenForEnter);
    this.getAllUsers();
    this.pb.autoCancellation(false);
  },
  mounted() {
    this.$refs.name.$el.focus();
  },
  computed: {
    ...mapGetters(["users", "allUsers"]),
    usernameClass() {
      return { "md-invalid": this.invalid_username };
    },
    emailClass() {
      return { "md-invalid": this.invalid_email };
    },
  },

  methods: {
    ...mapActions(["pushToQueue", "createUser", "setModal", "getAllUsers"]),
    handleUpload() {
      this.$refs.fileUpload.click();
    },

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
      this.photo = event.target.files[0].name;
    },

    async handleSubmit() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) {
        return;
      }

      const newAccount = new FormData();
      newAccount.append("username", this.username);
      newAccount.append("email", this.email);
      newAccount.append("password", "asdasdasd");
      newAccount.append("passwordConfirm", "asdasdasd");
      newAccount.append("emailVisibility", true);

      const permissions = {
        edit_employees: this.edit_employees,
        delete_employees: this.delete_employees,
        edit_companies: this.edit_companies,
        delete_companies: this.delete_companies,
        edit_offices: this.edit_offices,
        delete_offices: this.delete_offices,
        edit_structure: this.edit_structure,
        delete_structure: this.delete_structure,
        read_permissions: true,
        edit_permissions: false,
        delete_permissions: false,
      };

      this.$refs.fileUpload.files[0]
        ? newAccount.append("avatar", this.$refs.fileUpload.files[0])
        : null;

      this.createUser({ newAccount: newAccount, permissions: permissions });
    },
    usernameTaken(username) {
      return !this.allUsers.some(
        (user) => user.username.toLowerCase() === username.toLowerCase()
      );
    },
    emailTaken(email) {
      return !this.allUsers.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );
    },
    handleCancel() {
      this.setModal({});
    },
    listenForEnter(e) {
      if (e.keyCode === 13) {
        this.handleSubmit();
      }
    },
  },

  data() {
    return {
      photo: "Nėra įkeltos nuotraukos",
      username: "",
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

      pb,
    };
  },
  validations() {
    return {
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
    };
  },
  watch: {
    v$(newval) {
      this.v$.username.$error ? (this.invalid_username = true) : null;
      this.v$.email.$error ? (this.invalid_email = true) : null;
    },
  },

  beforeDestroy() {
    window.removeEventListener("keydown", this.listenForEnter);
    this.pb.autoCancellation(true);
  },
};
</script>

<style scoped>
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
