<template>
  <div :class="$style.getFundsModal">
    <vue-modal :show="show" @close="$emit('update:show', false)">

      <vue-grid-row>
        <vue-grid-item>
          <h1>Fund Your Crypto Wallet</h1>
        </vue-grid-item>
      </vue-grid-row>

      <vue-grid-row>
        <vue-grid-item>
          <h2>Have Ether and need Dai?</h2>
          <ol>
            <li>Click the button below</li>
            <li>Select the first option "MetaMask."</li>
            <li>Make sure you are on the "Main Network"</li>
            <li>Accept the prompts from MetaMask.</li>
          </ol>
          <br>
          <vue-button primary @click.prevent="buy()">Buy Dai</vue-button>
        </vue-grid-item>
      </vue-grid-row>

      <vue-grid-row>
        <vue-grid-item>
          <h2>Have Dai and need Ether?</h2>
          <ol>
            <li>Click the button below</li>
            <li>Select the first option "MetaMask."</li>
            <li>Make sure you are on the "Main Network"</li>
            <li>Accept the prompts from MetaMask.</li>
          </ol>
          <br>
          <vue-button primary @click.prevent="buy()">Buy Dai</vue-button>
        </vue-grid-item>
      </vue-grid-row>

    </vue-modal>
  </div>
</template>

<script>
  import {store} from '../store';

  export default {
    name: 'GetFundsModal',
    props: {
      show: {
        type: Boolean,
        required: true,
        default: false
      },
      job: {
        type: Object,
        required: true,
        default: () => {
        }
      }
    },
    data() {
      return {
        sponsorAmount: '',
        taskId: "",
      };
    },
    computed: {},
    methods: {

    }
  };
</script>

<style lang="scss" module>
  .getFundsModal {
    display: block;
  }
</style>
