<template>
  <div class="edit">
  <md-button v-if="svgEdit" class="md-icon-button md-raised secondary-bg" @click.prevent>
        <md-icon>
          <img :src="svgEdit" alt="pencil">
        </md-icon>
    </md-button>
    <md-button v-else-if="edit" class="md-icon-button md-raised secondary-bg" @click.prevent>
    {{edit}}
    </md-button>
  </div>
</template>

<script>

export default {

  props: ["edit", "svgEdit"],

}
</script>

<style>

</style>