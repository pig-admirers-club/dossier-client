<template>
  <div v-if="busy" id="loading__modal">
    <i class="fa fa-spinner fa-spin"></i>
  </div>
</template>

<script lang="ts">
  export default {
    computed: {
      busy() {
        return this.$store.busy;
      }
    }
  }
</script>

<style scoped>
  #loading__modal {
    position: absolute;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0,0,0,.4);
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    color: white;
  }
</style>