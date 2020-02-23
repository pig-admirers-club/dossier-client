<template>
  <div id="repo__container">
    <div id="repo__list">
      <div id="repo__list__title">
        <h3>REPOSITORIES</h3>
      </div>
      <ul>
        <Repo v-for="repo in repos"
          :activated="isActive(repo)"
          :repo="repo"
          v-bind:key="repo.id()"
          @set="setRepo(repo)"
        />
      </ul>
    </div>

    <div id="report__edit" v-if="!!activeRepo">
      <div id="report__edit__title">
        <h3>REPORTS for {{ activeRepo.owner() }} / {{ activeRepo.name() }}</h3>
      </div>
      <div class="report__edit__body">
        <div class="edit-report-menu">
          <ul>
            <li><span>Gilded Rose Automation</span> <span class="icons"><a><i class="fas fa-cog"></i></a></span></li>
            <li><span>Gilded Rose Unit Tests</span> <span class="icons"><a><i class="fas fa-cog"></i></a></span></li>
          </ul>
        </div>
        <div class="edit-report-container">
          <div class="edit-report-form" style="padding: 20px;">
            <form class="uk-form-stacked">
              <div>
                <label class="uk-form-label">What is the name of your test suite?</label>
                <div class="uk-form-control">
                  <input class="uk-input uk-width-1-1">
                </div>
              </div>
              <div class="uk-width">
                <label class="uk-form-label">What language / framework are your tests written in?</label>
                <div class="uk-form-control">
                  <select class="uk-select uk-width-1-1">
                    <option>Ruby & Cucumber</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div class="edit-report-buttons">
            <button class='uk-button uk-button-danger'>Delete</button>
            <button class="uk-button uk-button-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Repo from './repo.vue';
  export default {
    components: {
      Repo,
    },
    async mounted() {
      this.$store.fetchRepos();
    },
    computed: {
      repos() {
        return this.$store.repos;
      },
      activeRepo() {
        return this.$store.activeRepo
      }
    },
    methods: {
      setRepo(repo) {
        this.$store.setActiveRepo(repo);
      },
      isActive(repo) {
        if (this.activeRepo && this.activeRepo.id() === repo.id()) {
          return true;
        }
        return false;
      }
    }
  }
</script>

<style scoped>
  #repo__container {
    display: flex;
    width: 100%;
  }
  #repo__list ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  #repo__list {
    width: 600px;
    max-width: 600px;
    min-height: 100%;
    border-right: 1px solid #ccc;
  }

  #repo__list__title h3, #report__edit__title h3 {
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    padding: 15px 0px;
    margin: 0;
    font-size: 20px;
    display: flex;
    font-style: italic;
    border-bottom: 1px solid #ccc;
  }

  #report__edit {
    background-color: white;
    height: 100%;
    width: calc(100% - 600px);
  }
  .report__edit__body {
    display: flex;
    height: calc(100% - 51px);
  }
  .edit-report-menu {
    width: 300px;
    background-color: blanchedalmond;
    height: 100%;
    border-right: 1px solid #ccc;
  }
  .edit-report-menu ul {
    padding: 0;
    margin: 0;
  }
  .edit-report-menu ul li {
    display: flex;
    justify-content: space-between;
    height: 30px;
    padding: 10px;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-style:italic;
    font-weight: 100;
    border-bottom: 1px solid #ccc;
  }
  .edit-report-container {
    height: 100%;
    width: calc(100% - 301px);
  }
  .edit-report-form {
    height: calc(100% - 100px);
    display: flex;
    justify-content: center;
  }
  .edit-report-buttons {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content:space-around;
    background-color: #ccc;
  }
  .icon {
    height: 100%;
  }
  form div {
    margin-bottom: 10px;
  }
  @media screen and (max-width: 1200px) {
    #repo__list {
      width: 300px;
    }
    #repo__edit {
      width: 100%;
    }
  }
</style>