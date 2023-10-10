<template>
  <div
    class="notifications absolute w-full h-28 flex justify-center items-center gap-10 top-16 p-6"
  >
    <Notification
      v-for="notification in notifications"
      :key="notification.id"
      :class="
        notification.status === 'success'
          ? 'bg-teal-100 border-teal-500 text-teal-900'
          : 'bg-red-100 border-red-500 text-red-900'
      "
      :notification="notification"
    ></Notification>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Notification from "./notification.vue";

export default {
  components: {
    Notification,
  },

  computed: {
    ...mapGetters(["notifications"]),
  },
};
</script>

<style scoped>
.notifications {
  left: 50%;
  transform: translateX(-50%) !important;
  z-index: 26 !important;
}
</style>
