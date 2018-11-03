<template>
  <div :class="$style.sponsorModal">
    <vue-modal class="loading-parent" :show="show" @close="(isLoading) ? $emit('update:show', true) : $emit('update:show', false)">
      <loading
        :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="fullPage">
      </loading>
      <vue-button warn @click="(isLoading) ? $emit('update:show', true) : $emit('update:show', false)">X</vue-button>

      <vue-input
        name="sponsorAmount"
        id="sponsorAmount"
        required
        placeholder="Enter Amount"
        validation="required"
        type="number"
        @change="checkBalance"
        v-model="sponsorAmount"/>

      <vue-button primary @click.prevent.stop="sponsorJob">Sponsor</vue-button>

      <br>
      <br>

      <p>{{ $t('App.job.sponsorDescription' /* Job sponsorship is where anyone in the world can donate and contribute to the workplace ecosystem. Choosing to sponsor ensures transparency in funds donated and incentives job workers to continue to perform and accept jobs. */) }}</p>

      <br>
      <br>
      <!--TODO: fix: modal overlay remains after navigating to new page-->
      <!--<p>You will need Dai to Sponsor a Job. You can get some <router-link :to="'/get-funds'">{{-->
      <!--$t('App.footer.getStartedGuide' /* Get Started */) }}</router-link>.-->
      <!--</p>-->

    </vue-modal>
  </div>
</template>

<script>
import { store } from "../store";
import * as types from "../store/types";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { NETWORKS } from "../util/constants/networks";
import truffleContract from "truffle-contract";
import EscrowContract from "../../contracts/build/contracts/Escrow.json";
import DAIContract from "../../contracts/build/contracts/DAI.json";
import Loading from "vue-loading-overlay";

export default {
  name: "SponsorModal",
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    job: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  components: {
    Loading
  },
  data() {
    return {
      isLoading: false,
      fullPage: true,
      sponsorAmount: "",
      taskId: ""
    };
  },
  methods: {
    ...mapActions({
      openNetworkModal: types.OPEN_NETWORK_MODAL
    }),
    async checkBalance() {
      this.isLoading = true;
      const DAI = truffleContract(DAIContract);
      DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);
      const DAIInstance = await DAI.deployed();
      DAI.defaults({
        from: this.$store.state.web3.web3Instance().eth.coinbase
      });
      web3.eth.getAccounts((error, accounts) => {
        const daiBalance = DAIInstance.balanceOf(accounts[0]);
        daiBalance.then(balance => {
          if (balance / Math.pow(10, 18) < this.sponsorAmount) {
            EventBus.$emit("notification.add", {
              id: 1,
              title: this.$t(
                "App.helloMetaMask.account" /* Ethereum Account */
              ),
              text: this.$t(
                "App.insufficient.daiBalance" /* You don't have enough funds to perform this transaction.  */
              )
            });
            this.isLoading = false;
            return false;
          }
        });
      });
    },
    sponsorJob() {
      this.isLoading = true;

      this.sponsorAmountToEscrow()
        .then(result => {
          this.$emit("sponsorSubmit", this.sponsorAmount);
          this.sponsorAmount = "";
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    async sponsorAmountToEscrow() {
      this.$ma.trackEvent({
        category: "Click",
        action: "Sponsor a Job",
        label: "Sponsor a Job",
        value: ""
      });

      if (this.$store.state.web3.balance <= 0) {
        EventBus.$emit("notification.add", {
          id: 1,
          title: this.$t("App.helloMetaMask.account"),
          text: this.$t("App.insufficient.etherBalance")
        });
        return false;
      }

      return new Promise(async (resolve, reject) => {
        const Escrow = truffleContract(EscrowContract);
        const DAI = truffleContract(DAIContract);

        window.Escrow = Escrow;
        Escrow.setProvider(
          this.$store.state.web3.web3Instance().currentProvider
        );
        Escrow.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });
        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);

        const EscrowInstance = await Escrow.deployed();
        const DAIInstance = await DAI.deployed();

        window.EscrowInstance = EscrowInstance;
        const pool = EscrowInstance.address;

        DAI.setProvider(this.$store.state.web3.web3Instance().currentProvider);
        DAI.defaults({
          from: this.$store.state.web3.web3Instance().eth.coinbase
        });

        web3.eth.getAccounts(async (err, accounts) => {
          const JobID = this.job.taskId;
          const payment = this.sponsorAmount * 10 ** 18;
          const sponsor = accounts[0];
          const sender = accounts[0];

          web3.eth.getGasPrice(async (err, gasPrice) => {
            gasPrice = gasPrice.toNumber();

            console.log("Gas Price ", gasPrice);

            try {
              const approveGas = await DAIInstance.approve.estimateGas(
                EscrowInstance.address,
                payment,
                {
                  from: sender
                }
              );

              console.log("Gas calcuated for Approve ", approveGas);

              await DAIInstance.approve(EscrowInstance.address, payment, {
                from: sender,
                gas: approveGas,
                gasPrice: gasPrice
              });

              const result = await EscrowInstance.sponsorDAI(JobID, payment, {
                from: sponsor
              });
              resolve(result);
            } catch (error) {
              reject(error);
            }
          });
        });
      });
    }
  }
};
</script>

<style lang="scss" module>
.sponsorModal {
  display: block;
}
.loading-parent {
  position: relative;
  z-index: 999;
  height: 2em;
  width: 2em;
  overflow: show;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
