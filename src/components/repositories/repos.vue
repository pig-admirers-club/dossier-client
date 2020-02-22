<template>
  <div id="repo__list">
    <div class="repo__list__title">
      <h3>REPOSITORIES</h3>
    </div>
    <ul>
      <li v-for="repo in repos" v-bind:key="repo.id()">
        <div>
          <label class="switch">
            <input type="checkbox">
            <span class="slider"></span>
          </label>
        </div>
        <span class="repo__author" style="">
          {{ repo.owner() }} /
        </span> 
          {{ repo.name() }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  export default {
    async mounted() {
      this.$store.fetchRepos();
    },
    computed: {
      repos() {
        return this.$store.repos;
      },
    },
  }
</script>

<style scoped>

  #repo__list {
    width: 600px;
    max-width: 600px;
    min-height: 100%;
    border-right: 1px solid #ccc;
  }
  
  #repo__list li {
    display: flex;
    align-items: center;
  }
  #repo__list li {
    height: 30px;
    padding: 10px;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-style:italic;
    font-weight: 100;
    border-bottom: 1px solid #ccc;
  }
  #repo__list h3 {
    padding: 15px 0px;
    margin: 0;
    font-size: 20px;
    display: flex;
    font-style:italic;
    justify-content: center;
  }

  .repo__author {
    font-weight: bold;
    font-style:normal; 
    text-transform: uppercase; 
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 35px;
    height: 22px;
    margin-right: 10px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 15px;
    width: 15px;
    left: 2px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #2196F3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(15px);
    -ms-transform: translateX(15px);
    transform: translateX(15px);
  }
</style>