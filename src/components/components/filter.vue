<template>
  <div class="md-layout-item w-full">
    <md-field :class="componentClass" v-if="!forStructure">
      <label for="structure">{{ filter_name.name }}</label>
      <md-select
        v-model="data"
        name="structure"
        id="structure"
        :placeholder="filter_name.placeholder"
        @md-selected="structureChange"
      >
        <md-option v-for="item in comp_items" :key="item.id" :value="item.id">{{
          item.name
        }}</md-option>
        <md-option v-if="filter_name.placeholder" value="">{{
          filter_name.placeholder
        }}</md-option>
      </md-select>
      <span class="md-error" v-if="error.length > 0"
        >{{ error[0].$message }}
      </span>
    </md-field>
    <md-field :class="componentClass" v-if="forStructure">
      <label for="structure">{{ filter_name.name }}</label>
      <md-select
        v-model="data"
        name="structure"
        id="structure"
        :placeholder="filter_name.placeholder"
        @md-selected="structureChange"
        multiple
      >
        <md-option v-for="item in comp_items" :key="item.id" :value="item.id">{{
          item.name
        }}</md-option>
      </md-select>
      <span class="md-error" v-if="error.length > 0"
        >{{ error[0].$message }}
      </span>
    </md-field>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    errorProps: {
      type: Array,
      default: function () {
        return [];
      },
    },
    forStructure: {
      type: Boolean,
      default: false,
    },
    items: {
      type: [Array, Object],
      default: function () {
        return [];
      },
    },
    filter_name: {
      type: Object,
      required: true,
    },
    val: {
      type: [String, Array],
      default: null,
    },
    componentClass: {
      type: Object,
      default: function () {
        return {};
      },
    },
    edit: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      comp_items: this.items,
      data: this.val,
      error: this.errorProps,
    };
  },
  computed: {
    ...mapGetters(["create"]),
  },
  methods: {
    structureChange() {
      this.$emit("structureChange", this.data);
      this.$emit("selected", this.data);
    },
  },

  watch: {
    val: {
      handler: function (val) {
        if (this.create && this.edit) {
          this.data = val;
        }
        if (!this.create && !this.edit) {
          this.data = val;
        }
      },
      immediate: true,
    },
    items: {
      handler: function (val) {
        this.comp_items = val;
      },
      immediate: true,
    },
    errorProps: {
      handler: function (val) {
        this.error = val;
      },
      immediate: true,
    },
  },
};
</script>

<style></style>
