<template>
  <li :class="{'active': activated}">
    <div class="repo__info">
      <div>
        <label class="switch">
          <input type="checkbox" @change="setActive($event)" v-model="active">
          <span class="slider"></span>
        </label>
      </div>
      <span class="repo__author" style="">
        {{ repo.owner() }} /
      </span> 
        {{ repo.name() }}
    </div>
    <div v-if="active" class="repo__links">
      <a @click="emitRepo()"><i class="fas fa-cog"></i></a>
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
    async setActive(event) {
      const id = this.repo.id();
      const checked = event.srcElement.checked;
      await checked ? this.$store.activateRepo(id) : this.$store.deactivateRepo(id);
      if (checked) {
        this.emitRepo();
      }
    },
    emitRepo() {
      this.$emit('set', this.repo)
    }
  }
}
</script>

<style>
  .repo__info {
    display: flex;
  }
  #repo__list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  #repo__list li.active {
    background-color: #fff;
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
    overflow: hidden;
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