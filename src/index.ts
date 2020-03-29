import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { AppStore } from './store/app';
//@ts-ignore
import Index from './components/index.vue';
//@ts-ignore
import Repos from './components/repositories/repos.vue'
Vue.config.devtools = true;
Vue.use(Vuex);
Vue.use(VueRouter);

const routes = [
  { path: '/', component: Repos },
]
const router = new VueRouter({ routes })
Vue.prototype.$store = Vue.observable(AppStore);

new Vue({
  el: '#app',
  router,
  render: h => h(Index)
})