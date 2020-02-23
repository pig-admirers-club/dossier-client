<template>
  <div>
    <HeaderNav />
    <div id='container'>
      <Menu/>
      <div id="container__frame">
        <router-view></router-view>
      </div>
    </div>
    <LoadingModal />
  </div>
</template>

<script lang="ts">
  import HeaderNav from './header.vue';
  import Menu from './menu.vue';
  import LoadingModal from './util/loading-modal.vue'
  export default {
    components: {
       HeaderNav,
       Menu,
       LoadingModal
    },
    async mounted() {
      await this.$store.fetchRepos();
    },
    computed: {
      authenticated() {
        return this.$store.authenticated;
      },
      repos() {
        return this.$store.repos;
      },
      busy() {
        return this.$store.busy;
      }
    },
    methods: {
      remove(repo) {
        repo.setName('stuff');
      }
    }
  }
</script>

<style>
  body {
    margin: 0;
    padding: 0;
    font-family: 'Almarai', sans-serif;
  }
  #container {
    min-height: calc(100vh - 50px);
    width: 100%;
    display: flex;
  }
  #container__frame {
    background-color: beige;
    min-height: 100%;
    display: flex;
    width: 100%;
  }
</style>