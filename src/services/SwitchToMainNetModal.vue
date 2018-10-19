<template>
  <div :class="$style.switchToMainNetModal">
    <vue-modal :show="show" @close="closeNetworkModal">
      <vue-button warn @click="closeNetworkModal">X</vue-button>

      <h2>{{ $t('App.job.mainNetModalTitle' /* Switch to Main Network */) }}</h2>

      <p>{{ $t('App.job.mainNetModalDescription' /* Please go to MetaMask and switch to the "Main Network" to process
        your transaction. */) }}</p><br>

      <p>{{ $t('App.getStarted.installExtension' /* extension */) }} <a
        href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask"
        target="_blank">MetaMask</a>.</p>

    </vue-modal>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
  import * as types from '../store/types'
  import {store} from '../store';

  export default {
    name: 'SwitchToMainNetModal',
    created() {
      this.updateMainnetModalState()
    },
    methods: {
       ...mapActions({
        openNetworkModal: types.OPEN_NETWORK_MODAL,
        closeNetworkModal: types.CLOSE_NETWORK_MODAL,
      }),
      ...mapMutations({
        updateMainnetModalState: types.SET_NETWORK_MODAL_OPEN
      })
    },
    computed: {
      ...mapGetters({
        show: types.IS_NETWORK_MODAL_OPEN
      }),
    }
  };
</script>

<style lang="scss" module>
  .switchToMainNetModal {
    display: block;
  }
</style>
