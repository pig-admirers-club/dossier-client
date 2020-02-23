<template>
  <div id="topnav">
    <h4>Dossier</h4>
    <div id="topnav__buttons">
      <button  @click="redirect" v-if="!authorized" class="uk-button">
        <i class="fab fa-github"></i>
          Login With Github
      </button>
      <div v-else>
        Welcome, {{ login }}
      </div>
    </div>
  </div> 
</template>

<script lang="ts">
export default {
  async mounted() {
    await this.$store.fetchMe();
  },
  computed: {
    authorized() {
      return this.$store.authorized;
    },
    login() {
      return this.$store.me.name();
    }
  },
  methods: {
    redirect() {
      window.location.href = "/api/oauth/start"
    }
  }
}
</script>

<style scoped>
  #topnav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    max-width: 100vw;
    background-color: black;
  }
  #topnav h4 {
    color: white;
    margin: 0;
    padding: 0;
    margin-left: 20px;
  }
  #topnav__buttons {
    margin-right: 20px;
  }
</style>