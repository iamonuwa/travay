<template>
  <div id="app" :class="$style.app">
    <navbar/>
    <hello-metamask/>
    <hello-firefox/>
    <router-view :class="$style.content"/>
    <travay-footer />
    <br>
    <!-- TODO: fix cookie consent -->
    <!--<vue-cookie-consent-->
      <!--current-version="1.0.0"-->
      <!--:cookie-consent-version="cookieConsentVersion"-->
      <!--:set-cookie-consent-version="setCookieConsentVersion">-->
      <!--This uses cookies.-->
    <!--</vue-cookie-consent>-->
  </div>
</template>

<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex'
  import {store} from './store';
  import HelloMetamask from '@/components/hello-metamask'
  import HelloFirefox from '@/components/hello-firefox'
  import Navbar from '@/components/navbar'
  import TravayFooter from '@/components/travay-footer'
  import SignInModal from './services/SignInModal'
  import { doChangeLocale }  from './util/i18n';

  export default {
  name: 'App',
  beforeCreate () {
    this.$store.dispatch('registerWeb3');
  },
  components: {
    'navbar': Navbar,
    'hello-metamask': HelloMetamask,
    'hello-firefox': HelloFirefox,
    'travay-footer': TravayFooter,
    'signInModal': SignInModal
  },
  computed: {
    ...mapGetters('signInModal', ['userId']),
    ...mapGetters('app', ['cookieConsentVersion']),
  },
  methods: {
    ...mapActions('signInModal', ['openLoginModal', 'saveUserInStorage']),
    ...mapActions('app', ['setCookieConsentVersion']),
    signInClicked() {
      this.navBarClose();
      this.openLoginModal();
    },
    localeSwitch(locale) {
      doChangeLocale(locale)
        .catch((error) => console.log(error));
      this.navBarClose();
    },
    navBarClose() {
      EventBus.$emit('navbar.close');
    }
  },
  created() {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        this.saveUserInStorage(JSON.parse(userData));
      }
    } catch (err) {
      console.log('err when trying to get user data from storage', err);
    }
  }
}
</script>

<style lang="scss" module>
  @import "./theme/reset";
  @import "./theme/typo";
  @import "./theme/global";
  @import url($google-font);

  .app {
    min-height:     100vh;
    display:        flex;
    flex-direction: column;
  }

  .content {
    flex: 1;
    margin-top: 80px;
  }

</style>
