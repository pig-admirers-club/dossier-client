<template>
  <li :class="{'active': activated, 'repo__list__item': true}">
    <div class="repo__info">
      <span class="repo__author" style="">
        {{ repo.owner() }} / 
      </span> 
         {{ repo.name() }}

         <span class="badge" v-if="repo.reports().length > 0">
           <em>{{ repo.reports().length }}</em>
         </span>
    </div>
    <div v-if="!activated" class="repo__links">
      <div
        class="settings__button"
       @click="emitRepo(repo)"
      >
        <i class="fas fa-cog"></i>
       </div>
    </div>
  </li>
</template>

<script lang="ts">
export default {
  props: ['repo', 'activated'],
  computed: {
    active() {
      return this.repo.active();
    }
  },
  methods: {
    emitRepo(value) {
      this.$emit('set', value)
    }
  }
}
</script>

<style>
  .badge {
    margin-left: 10px;
    font-weight: bold;
  }
  .settings__button {
    width: 50px;
    height: 50px;
    background-color: #F7F6EE;
    border-left: 1px dashed #84A295;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #84A295;
    font-size: 15px;
    font-weight: bold;
  }
  .settings__button:hover {
    background-color: #CC968F;
    color: #333;
    cursor: pointer;
  }
  .repo__info {
    display: flex;
  }
  #repo__list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .repo__list__item.active {
    background-color: #fff;
  }
  .repo__list__item {
    height: 30px;
    padding: 10px 0px 10px 10px;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-style:italic;
    font-weight: 100;
    background-color: #EAE6DA;
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
</style>