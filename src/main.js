// global variables
window.endpoint = 'https://sustevents.mybluemix.net';
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate';
import * as VueGoogleMaps from 'vue2-google-maps'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/Shared/Alert.vue'
import EditMeetupDetailsDialog from './components/Meetup/Edit/EditMeetupDetailsDialog.vue'
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog.vue'
import EditMeetupTimeDialog from './components/Meetup/Edit/EditMeetupTimeDialog.vue'
import RegisterDialog from './components/Meetup/Registration/RegisterDialog.vue'
// main.js
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import VueStripeCheckout from 'vue-stripe-checkout';

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#43a047',
    secondary: '#f9a825',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
})
Vue.use(VeeValidate)

Vue.use(VueStripeCheckout, 'pk_test_f9xFVPvDUM4ObAQVmxb3wQrD00aVqrYx5v');

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBNLDwRv4ItlTJRouExNPpJokdKK859yDk',
    libraries: 'places', // This is required if you use the Autocomplete plugin
  },
})

Vue.config.productionTip = false

Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog)
Vue.component('app-meetup-register-dialog', RegisterDialog)



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyCg11-uciaNhuiPdOxk7Gq8WT7VN_Gjo4s',
      authDomain: 'sustevents.firebaseapp.com',
      databaseURL: 'https://sustevents.firebaseio.com',
      projectId: 'sustevents',
      storageBucket: 'sustevents.appspot.com',
      messagingSenderId: '292296137649'
    })
    
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
    })
    this.$store.dispatch('loadMeetups')
    
  }
})

export const db = firebase.firestore()