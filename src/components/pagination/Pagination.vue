<template>
  <div class="pgControl flex justify-center items-center gap-1 py-4">
    <md-button
      class="md-raised pagination-btn"
      :disabled="structure.page <= 1"
      @click="decrementPage"
    >
      <div class="text flex justify-center items-center gap-10 text-white">
        <img :src="previous" alt="two triangles pointing left" />
        PRAEITAS PUSLAPIS
      </div>
    </md-button>

    <div
      v-if="structure.page === 1 && structure.totalPages === 0"
      class="totalPages"
    >
      1/1
    </div>

    <div v-else class="totalPages">
      {{ structure.page }}/{{ structure.totalPages }}
    </div>

    <md-button
      class="md-raised pagination-btn"
      :disabled="
        structure.page >= structure.totalPages || structure.totalPages === 0
      "
      @click="incrementPage"
    >
      <div class="flex justify-center items-center gap-10 text-white">
        SEKANTIS PUSLAPIS
        <img :src="next" alt="two triangles pointing left" />
      </div>
    </md-button>
  </div>
</template>

<script>
import next from "../../assets/next.svg";
import previous from "../../assets/previous.svg";

export default {
  created() {},
  props: {
    structure: {
      default: function () {
        return {
          page: 1,
          totalPages: 1,
        };
      },
    },
  },

  data() {
    return {
      next: next,
      previous: previous,
    };
  },

  methods: {
    incrementPage() {
      this.$emit("incrementPage");
    },
    decrementPage() {
      this.$emit("decrementPage");
    },
  },
};
</script>

<style scoped>
:disabled {
  background-color: grey !important;
}
md-option {
  background-color: white !important;
  z-index: 3 !important;
}
select {
  padding: 0px 1rem;
  width: 15rem;
  background-color: transparent;
  border: 2px solid #f1f2f4;
  border-radius: 5px;
}
</style>
