<template>
  <div id="repo__container" v-if="repos.length > 0">
    <div id="repo__list">
      <div id="repo__list__title">
        <h3>REPOSITORIES</h3>
      </div>
      <ul>
        <div id="repo__pagination">
          <ul class="uk-pagination uk-flex-center">
            <li v-if="canPreviousPage()" class="uk-pagination-previous">
              <a href="#" @click="fetchPrevious()">
                <i class="fas fa-angle-double-left"></i>
              </a>
            </li>
            <li v-for="page in pages"
              v-bind:key="page"
              :class="pageClass(page)">
              <a href="#" @click="fetchPage(page)">{{ page }}</a>
            </li>
            <li v-if="canNextPage()" class="uk-pagination-previous">
              <a href="#" @click="fetchNext()">
                <i class="fas fa-angle-double-right"></i>
              </a>
            </li>
          </ul>
        </div>
        <Repo v-for="repo in repos"
          :activated="isActive(repo)"
          :repo="repo"
          v-bind:key="repo.id()"
          @set="setRepo($event)"
        />
      </ul>
    </div>

    <div id="report__edit" v-if="!!activeRepo">
      <div id="report__edit__title">
        <h3>REPORTS for {{ activeRepo.owner() }} / {{ activeRepo.name() }}</h3>
      </div>
      <div class="report__edit__body">
        <div class="edit-report-menu" :style="{ 'width': menuWidth }">
          <ul v-if="activeRepo">
            
            <li v-if="isNewReport">
              <span>{{ newReportName }}</span> 
              <div class="settings__button" @click="setNewReport(false)">
                  <i class="fas fa-times"></i>
              </div>
            </li>
            <div v-for="report in activeRepo.reports()" v-bind:key="report.id">
              <li>
                <span>{{ report.name }}</span>
                <div v-if="(report.id != activeAccordion) && !isNewReport" 
                  @click="openAccordion(report.id)" class="settings__button">
                  <a><i class="fas fa-eye"></i></a>
                </div>
                <div v-else-if="(report.id == activeAccordion) && !isNewReport" class="settings__button" @click="openAccordion(null)">
                    <i class="fas fa-eye-slash"></i>
                </div>
              </li>
              <div :class="getAccordionClass(report.id)">
For working with {{ report.framework }}, it's easy!
In your Gemfile:
<Prism language="ruby">gem 'dossier'</Prism>

At the very top of your env.rb: 
<Prism language="ruby">require 'dossier'</Prism>

Then run cucumber with DOSSIER_TOKEN set
<Prism language="bash">DOSSIER_TOKEN={{ report.token }} cucumber -f Dossier::Formatter </Prism>

and visit your <a :href="`/ruby-cucumber/${report.id}`">report!</a>
              </div>
            </div>
            <li v-if="!isNewReport" style="display:flex; justify-content: center;">
              <button @click.prevent="setNewReport(true)" class="uk-button uk-button-primary">New report</button>
            </li>
          </ul>
        </div>
        <div v-if="isNewReport" class="edit-report-container">
          <div class="edit-report-form" style="padding: 20px;">
            <form @submit.prevent class="uk-form-stacked" style="width:100%;">
              <div>
                <label class="uk-form-label">What is the name of your test suite?</label>
                <div class="uk-form-control">
                  <input :class="{'uk-input': true, 'uk-width-1-1': true, 'uk-form-danger': !!errors.name}" v-model="newReportName">
                  <span v-if="errors.name" class="validation-error">{{ errors.name }}</span>
                </div>
              </div>
              <div class="uk-width">
                <label class="uk-form-label">What language / framework are your tests written in?</label>
                <div class="uk-form-control">
                  <select class="uk-select uk-width-1-1" v-model="newReportFramework">
                    <option value="RubyCucumber">Ruby & Cucumber</option>
                  </select>
                </div>
              </div>
              <button @click.prevent="saveNewReport()" class="uk-button uk-button-primary">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Repo from './repo.vue';
  import Prism from 'vue-prism-component';
  export default {
    data() {
      return { isNewReport: false, activeAccordion: null }
    },
    components: {
      Repo,
      Prism
    },
    async mounted() {
      await this.$store.fetchRepos();
    },
    computed: {
      errors() {
        return this.$store.errors.newReport;
      },
      menuWidth() {
        return this.isNewReport ? '300px' : '100%';
      },
      repos() {
        return this.$store.repos;
      },
      activeRepo() {
        return this.$store.activeRepo
      },
      pages() {
        return [...Array(this.$store.repoPager.pages()).keys()].map((i) => i+1);
      },
      newReportName: {
        set(value) {
          this.$store.newReport.name = value
        },
        get() {
          return this.$store.newReport.name
        }
      },
      newReportFramework: {
        set(value) {
          this.$store.newReport.framework = value;
        },
        get() {
          return this.$store.newReport.framework;
        }
      }
    },
    methods: {
      canNextPage() {
        return !(this.$store.repoPager.getPage() === this.$store.repoPager.pages())
      },
      canPreviousPage() {
        return !(this.$store.repoPager.getPage() == 1)
      },
      setRepo(repo) {
        this.$store.setActiveRepo(repo);
        this.$store.resetReport();
        this.setNewReport(false);
      },
      isActive(repo) {
        if (this.activeRepo && this.activeRepo.id() === repo.id()) {
          return true;
        }
        return false;
      },
      pageClass(page) {
        if (page == this.$store.repoPager.currentPage) {
          return { 
            'uk-active': true,
            'uk-disabled': true
          }
        }
      },
      async fetchPage(page) {
        this.setRepo(null);
        this.$store.repoPager.setPage(page);
        await this.$store.fetchRepos(false);
      },
      fetchPrevious() {
        this.fetchPage(this.$store.repoPager.currentPage - 1);
      },
      fetchNext() {
        this.fetchPage(this.$store.repoPager.currentPage + 1);
      },
      async saveNewReport() {
        const saved = await this.$store.saveReport();
        if (saved) {
          await this.$store.fetchRepos(false);
          this.setNewReport(false);
          this.$store.resetReport();
        }
      },
      setNewReport(val) {
        this.$store.clearErrors('newReport');
        this.isNewReport = val;
        this.$store.resetReport();
        this.openAccordion(null)
      },
      openAccordion(id) {
        this.activeAccordion = id;
      }, 
      getAccordionClass(id) {
        const klass = ['accordion-content']
        if (!(this.activeAccordion === id)) {
          klass.push('closed');
        }
        return klass;
      }
    }
  }
</script>

<style scoped>
  .validation-error {
    font-size: smaller;
    color: red;
  }
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

  #repo__pagination {
    height: 50px;
    background-color: #E3FFF6;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #ccc;
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
  .accordion-content {
    height: 400px;
    background-color: white;
    padding: 20px;
    border-bottom: 1px solid #ccc;
    transition: height .2s;
    visibility: visible;
  }

  .accordion-content.closed {
    visibility: hidden;
    transition: height .2s;
    padding: 0;
    line-height: 0;
    height: 0;
    overflow: hidden;
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
    transition: width .2s;
  }
  .edit-report-menu ul {
    padding: 0;
    margin: 0;
  }
  .edit-report-menu ul li {
    display: flex;
    justify-content: space-between;
    height: 30px;
    padding: 10px 0px 10px 10px;
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
  @media screen and (max-width: 1200px) {
    #repo__list {
      width: 300px;
    }
    #repo__edit {
      width: 100%;
    }
    #report__edit {
      width: 100%;
    }
  }
</style>