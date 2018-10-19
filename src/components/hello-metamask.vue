<template>
  <vue-grid class='metamask-info'>

    <vue-grid-row v-if="isInjected">
      <vue-grid-item>
        <p id="has-metamask"><i aria-hidden="true" class="fa fa-check"></i> MetaMask {{
          $t('App.helloMetaMask.installed' /* Installed */) }}</p>
        <p>{{ $t('App.helloMetaMask.network' /* Network */) }}: <strong>{{ network }}</strong></p>
        <p v-if="network !== 'Main Ethereum Network'"> {{
          $t('App.helloMetaMask.notMainNet') /* You are not currently on the Main Network, please switch to the Main
          Network to use this application. */}}</p>
        <p v-else></p>
        <p>{{ $t('App.helloMetaMask.account' /* Ethereum Account */) }}: {{ coinbase }}</p>
        <!--<p>{{ $t('App.helloMetaMask.balance' /* Balance */) }}: {{ balance }} Wei // {{ ethBalance }} Eth</p>-->
      </vue-grid-item>
    </vue-grid-row>

    <vue-grid-row v-else id="no-metamask">
      <vue-grid-item>
        <p><i aria-hidden="true" class="fa fa-times"></i>{{ $t('App.helloMetaMask.unlockMetaMask' /* Please Unlock
          MetaMask */) }}</p>
      </vue-grid-item>
    </vue-grid-row>

    <!--<vue-button class="metamask-button">{{ $t('App.helloMetaMask.connectMetaMaskButton' /* CONNECT METAMASK */)-->
      <!--}}</vue-button>-->

  </vue-grid>
</template>

<script>
  import {NETWORKS} from "../util/constants/networks";
  import {mapState} from "vuex";

  export default {
    metaInfo: {
      title: "Metamask in Travay",
      meta: [
        {
          name: "",
          content: ""
        }
      ]
    },
    methods: {
      openConsent() {
        window.ethereum.enable()
      }
    },
    name: "hello-metamask",
    computed: mapState({
      isInjected: state => state.web3.isInjected,
      network: state => NETWORKS[state.web3.networkId],
      coinbase: state => state.web3.coinbase,
      balance: state => state.web3.balance,
      ethBalance: state => {
        if (state.web3.web3Instance !== null)
          return state.web3.web3Instance().fromWei(state.web3.balance, "ether");
      }
    })
  };
</script>

<style scoped>
  .metamask-info {
    text-align: center;
    margin-top: 50px;
  }

  .metamask-button {
    width: auto;
    height: auto;
    box-shadow: 0 11px 24px rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    background-image: linear-gradient(167deg, #f8911e 0%, #e8821e 48%, #d46d18 100%);
  }

  #has-metamask {
    color: green;
  }

  #no-metamask {
    color: red;
  }
</style>
