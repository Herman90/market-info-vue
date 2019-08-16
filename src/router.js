import Login from './components/Login.vue';
import MarketSearch from './components/MarketSearch.vue';
import VueRouter from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter);

const routes = [
  { path: '/pr/:pr?', component: Login },
  { 
    path: '/market-search', 
    component: MarketSearch
  }
];

const router = new VueRouter({
  routes
})

export default router;

