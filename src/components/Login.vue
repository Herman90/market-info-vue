<template>
<div class="form-container">
  <form class="md-layout md-alignment-center-center" @submit.prevent="login">
  <md-card class="card md-layout-item md-size-40 md-small-size-100" ref="loginForm">
    <md-card-content>
    <span class="error" v-if="error">{{error}}</span>
    <div class="md-layout md-gutter"> 
      <div class="md-layout-item md-size-50">
        <md-field>
          <label for="username">Username</label>
          <md-input name="username" autocomplete="given-name" v-model="form.username" :disabled="sending" />
        </md-field>
      </div>

      <div class="md-layout-item md-size-50">
        <md-field>
          <label for="password">Password</label>
          <md-input type="password" name="password" autocomplete="given-name" v-model="form.password" :disabled="sending" />
        </md-field>
      </div>

      <div class="md-layout-item md-size-100">
        <md-field>
          <label for="pr">PR NUMBER</label>
          <md-input name="pr" type="number" v-model="form.prNumber" :disabled="sending" />
        </md-field>
      </div>

      <div class="md-layout-item md-size-100">
        <md-field>
          <label for="env">Environment</label>
          <md-select name="env" v-model="form.env" :disabled="true">
            <md-option value="ppe">PPE</md-option>
            <md-option value="live">LIVE</md-option>
          </md-select>
        </md-field>
      </div>
    </div>
    </md-card-content>

      <md-card-actions>
        <md-button type="submit" class="md-primary md-raised" :disabled="!canLogin">Login</md-button>
      </md-card-actions>
    </md-card>
  </form>
</div>
</template>

<script>
// import service from './../data-providers/authentication.js'; 
const { service } = require('../data-providers/authentication.js');
import store from './../store';
import { validationMixin } from 'vuelidate'

export default {
  name: 'Login',
  mixins: [validationMixin],
  beforeRouteEnter: (to, from, next) => {
    if (!store.getters.isLoggedIn) {
      next()
    } else {
      next('/market-search');
    }
  },
  created() {
    const prNumber = +this.$route.params.pr;

    this.form.prNumber = Number.isInteger(prNumber) ? prNumber : null;
  },
  data: () => ({
    form: {
      username : null,
      password: null,
      prNumber: null,
      env: 'live',
    },
    error: null,
    sending: false
  }),
  methods: {
    login: async function() {

      this.error = null;
      const { username, password, env, prNumber } = this.form;
      
      service.login(username, password, env)
        .then(session => {
          store.commit('setSession', session);
          store.commit('setUsername', username);
          store.commit('setPullRequestNumber', prNumber);
          store.commit('setEnvironment', env);

          this.$router.push({ path: `/market-search`}) 
        })
        .catch(() => {
          this.error = 'Username or Password invalid';
          this.validationFailedHandler()
        });
    },
    validationFailedHandler: function() {
      const form = this.$refs.loginForm.$el;
      form.addEventListener(
        'animationend', 
        () => form.classList.remove('failed'),
        { once: true }
      );

      form.classList.add('failed');
    }
  },
  computed: {
    canLogin: function () {
      return !!this.form.username && !!this.form.password && !!this.form.env && !!this.form.prNumber;
    }
  }
}
</script>

<style scoped>
.form-container {
  flex: 1;
  align-items: center;
  background-image: url('../assets/dollars.png');
}
.form-container form {
  height: 100%;
}
.failed {
  animation: shake 0.4s 1 linear;
  animation-timing-function: ease-in;
}
.form-container .card {
  position: relative;
  padding: 20px;
  border-radius: 5px;
  background: rgba(255,255,255,0.9);
  box-shadow: 1px 1px 6px 3px #aaa;
}

.error {
  color: red;
  text-decoration: underline;
}

@keyframes shake {
  0% {
    transform: translate(30px)
  }

  20% {
    transform: translate(-30px)
  }

  40% {
    transform: translate(20px)
  }

  60% {
    transform: translate(-20px)
  }

  70% {
    transform: translate(-10px)
  }

  90% {
    transform: translate(8)
  }

  100% {
    transform: translate(0)
  }
}
</style>