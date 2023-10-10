<template>
  <div class="border-t-4 rounded-b px-4 py-3 shadow-md" role="alert">
    <div class="flex gap-4 items-center">
      <div class="py-1">
        <button class="p-2 rounded-full" @click="handleClick">
          <img
            :src="notificationCancel"
            alt="x"
            :class="notification.status === 'failure' ? 'failure' : 'success'"
          />
        </button>
      </div>
      <div>
        <p class="font-bold">
          {{ notification.status === "success" ? "Atlikta" : "Klaida" }}
        </p>
        <p class="text-sm">{{ notification.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import notificationCancel from "../../assets/notificationCancel.svg";
export default {
  data() {
    return {
      notificationCancel,
    };
  },
  methods: {
    ...mapMutations(["SHIFT_QUEUE", "SHIFT_NOTIFICATION"]),
    ...mapMutations(["CLOSE_NOTIFICATION"]),
    handleClick() {
      this.CLOSE_NOTIFICATION(this.notification.id);
    },
  },

  computed: {
    ...mapGetters(["queue"]),
  },

  props: ["notification"],

  async created() {
    setTimeout(() => {
      this.CLOSE_NOTIFICATION(this.notification.id);
    }, 6000);
  },

  beforeDestroy() {
    this.queue.length > 0 ? this.SHIFT_QUEUE() : null;
  },
};
</script>

<style scoped>
.failure {
  filter: invert(12%) sepia(48%) saturate(3852%) hue-rotate(344deg)
    brightness(109%) contrast(93%);
}
.success {
  filter: invert(23%) sepia(52%) saturate(559%) hue-rotate(127deg)
    brightness(92%) contrast(94%);
}
button {
  transition: 0.5s;
}
button:hover {
  background: rgba(189, 189, 189, 0.2) !important;
  transform: rotate(180deg);
}
</style>
