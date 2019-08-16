import Vuex from 'vuex';
import Vue from 'vue';
import VuexPersist from 'vuex-persist';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'market-info-login',
  storage: sessionStorage
});

const defaultState = {
  session: null,
  username: null,
  pullRequestNumber: null,
  environment: null,
  market: null
};

const store = new Vuex.Store({
  state: Object.create(defaultState),
  getters: {
    isLoggedIn: state => {
      return !!state.session && !!state.username && !!state.environment && !!state.pullRequestNumber;
    }
  },
  mutations: {
    setSession(state, session) {
      state.session = session;
    },
    setUsername(state, username) {
      state.username = username;
    },
    setPullRequestNumber(state, prNumber) {
      state.pullRequestNumber = prNumber;
    },
    setEnvironment(state, env) {
      state.environment = env;
    },
    setMarket(state, market) {
      state.market = market;
    },
    resetState(state) {
      Object.assign(state, defaultState);
    }
  },
  actions: {
    setSession(context) {
      context.commit('setSession');
    }
  },
  plugins: [vuexPersist.plugin]
});

export default store;