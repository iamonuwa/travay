<template>
  <div>
    <vue-modal :show="isOpen" @close="closeLoginModal">
      <vue-button warn @click="closeLoginModal">X</vue-button>
      <vue-grid>

        <vue-grid-row>
          <vue-grid-item fill>
            <!--TODO: Unable to use i18n here-->
            <!--<h1>{{modalHeading}}</h1>-->
          </vue-grid-item>
        </vue-grid-row>

        <template v-if="!userId" fill>
          <vue-grid-row>
            <vue-grid-item>
              <br>
              <br>
              <br>
              <vue-button @click="signInWithGoogle">
                <i class="fab fa-google"></i>
                {{ $t('App.signInModal.googleSignIn' /* Sign In with Google */) }}
              </vue-button>
            </vue-grid-item>
            <br>
            <br>
            <!--<vue-grid-item>-->
            <!--<vue-button @click="siginInWithUport">-->
            <!--<i class="fab fa-google"></i> uPort-->
            <!--</vue-button>-->
            <!--</vue-grid-item>-->

          </vue-grid-row>
        </template>

        <template v-else fill>
          <vue-grid-row>
            <vue-grid-item>
              <br>
              <br>
              <br>
              <vue-button @click="signOut">
                <i class="fab fa-sign-out"></i>
                {{ $t('App.signInModal.googleSignOut' /* Sign Out with Google */) }}
              </vue-button>
              <br>
              <br>
              <p>
                {{ $t('App.signInModal.signOutWarning' /* Remember to also sign out of MetaMask, to prevent phishing.
                Learn more about phishing here: https://fr.wikipedia.org/wiki/Hame%C3%A7onnage. */) }}</p>
            </vue-grid-item>
          </vue-grid-row>
        </template>

      </vue-grid>
    </vue-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import * as types from "../store/types";
import firebase from "firebase";
import db from "../firebaseinit-dev";
import { uuid } from "vue-uuid";
import { store } from "../store";
import truffleContract from "truffle-contract";
import EscrowContract from "../../contracts/build/contracts/Escrow.json";
import DAIContract from "../../contracts/build/contracts/DAI.json";

// import {Connect, SimpleSigner} from 'uport-connect';
// const uport = new Connect('Travay', {
//   clientId: UPORT_CONFIG.TRAVAY_UPORT_CLIENT_ID,
//   network: 'rinkeby',
//   signer: SimpleSigner(UPORT_CONFIG.TRAVAY_UPORT_SIMPLE_SIGNER)
// });

export default {
  metaInfo: {
    title: "SignInModal"
  },
  created() {
    this.updateSignInModalState("passed!");
  },
  methods: {
    /*...mapActions('signInModal', [
        'openLoginModal',
        'closeLoginModal',
        'saveUserInStorage',
        'logoutUser'
      ]),*/
    ...mapActions({
      openLoginModal: types.OPEN_LOGIN_MODAL,
      closeLoginModal: types.CLOSE_LOGIN_MODAL,
      saveUserInStorage: types.SAVE_USER_IN_STORAGE,
      logoutUser: types.LOGOUT_USER
    }),
    ...mapMutations("signInModal", ["SET_USER_DATA"]),
    ...mapMutations({
      updateSignInModalState: types.SET_SIGNIN_MODAL_OPEN
    }),
    // siginInWithUport: function () {
    //   this.closeLoginModal();
    //   uport
    //     .requestCredentials({
    //       requested: ['name', 'phone', 'country'],
    //       notifications: true // Required for UX so users don't have to scan QR per interaction
    //     })
    //     .then((credentials) => {
    //       const uid = uuid.v1();
    //       const uPortUserData = {
    //         name: credentials.name,
    //         country: credentials.country,
    //         phone: credentials.phone,
    //         address: credentials.address,
    //         uid: uuid.v1()
    //       };
    //       db
    //         .collection('users')
    //         .doc(uid)
    //         .set(uPortUserData)
    //         .then(function (docref) {
    //         })
    //         .catch(function (error) {
    //           console.error('Error adding user: ', error);
    //         });
    //       console.log('uport user data', uPortUserData);
    //       this.updateUserData(uPortUserData);
    //     });
    //   this.$router.push('/jobs');
    // },
    signInWithGoogle: function() {
      this.$ma.trackEvent({
        category: "Click",
        action: "Clicked Sign In",
        label: "Clicked Sign In",
        value: ""
      });

      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          this.closeLoginModal();
          this.updateUserData(result.user);
        })
        .catch(err => console.log(err));
    },
    signOut: function() {
      firebase
        .auth()
        .signOut()
        .then(res => {
          // console.warn('USER SHOULD BE SIGNED OUT!', res);
          this.logoutUser();
        })
        .catch(error => console.log(error));
    },
    async updateUserData(user) {
      const data = {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || null,
        name: user.name || null,
        photoURL: user.photoURL || null,
        phone: user.phone || null,
        country: user.country || null,
        address: user.address || null,
        metaMaskAddress: this.$store.state.web3.coinbase || null,
        optInTexts: user.optInTexts || null,
        subscribeToMailingList: user.subscribeToMailingList || null,
        receivedOneTimeDepositFromEF: false
      };
      try {
        const snapshot = await db
          .collection("users")
          .where("uid", "==", user.uid)
          .get();
        if (snapshot.docs.length === 0) {
          const user = await db.collection("users").add(data);
          this.saveUserAddress();
          // this.$router.push('/get-started');
          this.$router.push("/jobs");
        }
        this.user = data;
        this.saveUserInStorage(data);
        this.$router.push("/jobs");
      } catch (error) {
        console.error("error while getting user by uid", error);
      }
    },
    async saveUserAddress() {
      const data = {
        metaMaskAddress: this.$store.state.web3.coinbase
      };

      const user = await db
        .collection("users")
        .where("uid", "==", this.userId)
        .get()
        .then(snapshot => {
          snapshot.forEach(function(doc) {
            db.collection("users")
              .doc(doc.id)
              .update(data);
          });
        });
    }
  },
  computed: {
    ...mapGetters({
      userId: types.GET_USER_ID,
      isOpen: types.IS_SIGNIN_MODAL_OPEN
    }),
    modalHeading() {
      return this.userId ? "Sign Out" : "Sign In";
    }
  }
};
</script>

<style>
</style>
