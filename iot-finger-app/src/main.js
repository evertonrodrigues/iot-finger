// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueSockectIo from 'vue-socket.io';

import 'font-awesome/css/font-awesome.min.css'
import 'bulma/css/bulma.css'

Vue.config.productionTip = false;

Vue.use(VueSockectIo, process.env.SERVER_URL);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
