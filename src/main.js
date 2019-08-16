import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material';
import VueDragResize from 'vue-drag-resize';
import router from './router';


Vue.config.productionTip = false

Vue.use(VueMaterial);
Vue.component('vue-drag-resize', VueDragResize);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
