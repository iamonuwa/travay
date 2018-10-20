// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */

import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store/'
import VueUI from 'vue-ui/dist/vue-ui.common';
import 'vue-ui/dist/vue-ui.css';
import 'vue-loading-overlay/dist/vue-loading.min.css';
import { userRole } from './directives/userRole'
import VueMultianalytics from 'vue-multianalytics'
import InstantSearch from 'vue-instantsearch';
import VueI18n from 'vue-i18n'
import enlocale from '../i18n/en.json';
import htlocale from '../i18n/ht.json';
import frlocale from '../i18n/fr.json';

Vue.directive('userRole', userRole);

Vue.use(VueI18n);

const messages = {
  en: enlocale,
  ht: htlocale,
  fr: frlocale
};

const dateTimeFormats = {
  'en': {
    datePicker: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  },
  'ht': {
    datePicker: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  },
  'fr': {
    datePicker: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  }
};

// Create VueI18n instance with options
export const i18n = new VueI18n({
  locale: 'en', // set default locale
  messages,
  dateTimeFormats
});

window['$d'] = i18n.d.bind(i18n);
window['$t'] = i18n.t.bind(i18n);
window['$i18n'] = i18n;

Vue.use(VueUI, {
  store,
  i18n,
});

// vue-multianalytics
let gaConfig = {
  appName: 'Travay',
  appVersion: '0.0.1',
  // trackingId: 'UA-71718222-9', // Prod
  trackingId: 'UA-71718222-10', // Dev
  debug: true, // Whether or not display console logs debugs (optional)
};

let mixpanelConfig = {
  // token: '4be6f13d7bef9dab00a44273cade05a3' // Prod
  token: '3bfe6ae0af73a824d94cfc4ec8c4d4b8' // Dev
};

Vue.use(VueMultianalytics, {
  modules: {
    ga: gaConfig,
    mixpanel: mixpanelConfig
  }
});

Vue.use(InstantSearch);

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
});

const prod = process.env.NODE_ENV === 'production';
const shouldSW = 'serviceWorker' in navigator && prod;

if (shouldSW) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    }).then((reg) => {
      console.log('Service worker registered');
    }).catch(e => console.log('Error during service worker registration: ', e))
  });
  window.addEventListener('beforeinstallprompt', (e) => {
    e.userChoice.then((choice) => {
      if (choice.outcome === 'dismissed') {
        console.log('User cancelled homescreen install');
      } else {
        console.log('User added app to homescreen');
      }
    })
  })
}
