<template>
  <form
    action="post"
    class="flex flex-col items-center justify-start gap-14 w-fit py-16 px-32"
    style="background-color: #ffffff"
  >
    <div class="title text-4xl">Admin prisijungimas:</div>
    <div class="email flex flex-col w-full">
      <label for="email">Elektroninis paštas:</label>

      <div class="emailInput flex items-center justify-start">
        <div
          class="svg h-12 px-3 flex items-center justify-center"
          style="background-color: #f1f2f4"
        >
          <img :src="emailSvg" alt="envelope" class="w-full" />
        </div>
        <input
          type="email"
          class="h-12 px-3 flex-1"
          id="email"
          name="email"
          placeholder="Įveskite el. pašto adresą..."
          v-model="email"
          required
        />
      </div>
    </div>
    <div class="password flex flex-col w-full">
      <label for="password">Slaptažodis:</label>

      <div class="emailInput flex items-center justify-start">
        <div
          class="svg h-12 px-3 flex items-center justify-center"
          style="background-color: #f1f2f4"
        >
          <img :src="passwordSvg" alt="lock" class="w-full" />
        </div>
        <input
          v-if="!eye"
          type="password"
          class="h-12 px-3 flex-1 tracking-widest"
          id="password"
          name="password"
          placeholder="Įveskite slaptažodį..."
          v-model="password"
          required
        />
        <input
          v-else
          type="text"
          class="h-12 px-3 flex-1 tracking-widest"
          id="password"
          name="password"
          placeholder="Įveskite slaptažodį..."
          v-model="password"
          required
        />
        <div
          class="svg h-12 px-3 flex items-center justify-center"
          style="background-color: #f1f2f4"
        >
          <img
            :src="display"
            alt="lock"
            class="w-full cursor-pointer"
            @click="eyeToggle"
          />
        </div>
      </div>
    </div>
    <md-button type="submit" @click="handleSubmit" class="main-btn md-round">
      <div class="text-white px-16">PRISIJUNGTI</div>
    </md-button>
  </form>
</template>

<script>
import emailSvg from "../../assets/email.svg";
import passwordSvg from "../../assets/password.svg";
import eyeOn from "../../assets/eyeOn.svg";
import eyeOff from "../../assets/eyeOff.svg";
import { mapActions } from "vuex";

export default {
  computed: {
    display() {
      if (this.eye) {
        return eyeOff;
      } else return eyeOn;
    },
  },
  methods: {
    ...mapActions(["login", "pushToQueue"]),

    eyeToggle() {
      this.eye = !this.eye;
    },

    async handleSubmit(e) {
      e.preventDefault();
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

      if (!regex.test(this.email)) {
        this.pushToQueue({
          message: "Prašau įvesti teisingą el. paštą",
          status: "failure",
        });
        return;
      }
      if (this.password.length === 0) {
        this.pushToQueue({
          message: "Prašau įvesti slaptažodį",
          status: "failure",
        });
        return;
      }
      await this.login({
        email: this.email,
        password: this.password,
      });
    },
  },

  data() {
    return {
      eyeOn: eyeOn,
      eyeOff: eyeOff,
      email: "",
      password: "",
      emailSvg: emailSvg,
      passwordSvg: passwordSvg,
      eye: false,
    };
  },
};
</script>

<style scoped>
img {
  background-color: #f1f2f4;
}
label {
  color: #414042;
}
input {
  background-color: #f1f2f4;
}
input::placeholder {
  color: #414042;
  opacity: 1;
}
</style>
