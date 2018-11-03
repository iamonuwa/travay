<template>
  <vue-grid>

    <vue-grid-row>
      <vue-grid-item>
        <h1>Fund Your Crypto Wallet</h1>
      </vue-grid-item>
    </vue-grid-row>

    <vue-grid-row>
      <vue-grid-item>
        <h2>Need Dai?</h2>
        <ol>
          <li>Click the button below</li>
          <li>Select the first option "MetaMask."</li>
          <li>Make sure you are on the "Main Network"</li>
          <li>Accept the prompts from MetaMask.</li>
        </ol>
        <br>
        <vue-button primary @click.prevent="buyDAI()">Buy Dai</vue-button>
      </vue-grid-item>
    </vue-grid-row>

    <vue-grid-row>
      <vue-grid-item>
        <h2>Need Ether?</h2>
        <ol>
          <li>Click the button below</li>
          <li>Select the first option "MetaMask."</li>
          <li>Make sure you are on the "Main Network"</li>
          <li>Accept the prompts from MetaMask.</li>
        </ol>
        <br>
        <vue-button primary @click.prevent="buyETH()">Buy ETH</vue-button>
      </vue-grid-item>
    </vue-grid-row>
  </vue-grid>
</template>

<script>
  export default {
    name: "get-funds",
    methods: {
      buyDAI() {
        AirSwap.Trader.render({
          // env: 'sandbox',
          env: 'production',
          mode: 'buy',
          token: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
          onCancel: function () {
            console.info('Trade was canceled.');
          },
          onComplete: function (transactionId) {
            console.info('Trade complete. Thank you, come again.');
          }
        }, 'body');
      },
      buyETH() {
        AirSwap.Trader.render({
          // env: 'sandbox',
          env: 'production',
          mode: 'buy',
          token: '0x0000000000000000000000000000000000000000',
          onCancel: function () {
            console.info('Trade was canceled.');
          },
          onComplete: function (transactionId) {
            console.info('Trade complete. Thank you, come again.');
          }
        }, 'body');
      }
    }
  }
</script>

<style scoped>

</style>
