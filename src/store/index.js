import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import getWeb3 from '../util/getWeb3';
import pollWeb3 from '../util/pollWeb3';
import getContract from '../util/getContract';
import signInModal from './modules/signInModal';

Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: true,
  state,
  getters: {

  },
  mutations: {
    registerWeb3Instance(state, payload) {
      // console.log('registerWeb3instance Mutation being executed', payload);
      let result = payload;
      let web3Copy = state.web3;
      web3Copy.coinbase = result.coinbase;
      web3Copy.networkId = result.networkId;
      web3Copy.balance = parseInt(result.balance, 10);
      web3Copy.isInjected = result.injectedWeb3;
      web3Copy.web3Instance = result.web3;
      state.web3 = web3Copy;
      pollWeb3();
    },
    pollWeb3Instance(state, payload) {
      // console.log('pollWeb3Instance mutation being executed', payload);
      state.web3.coinbase = payload.coinbase;
      state.web3.balance = parseInt(payload.balance, 10);
    },
    registerContractInstance(state, payload) {
      console.log('Escrow contract instance: ', payload);
      state.contractInstance = () => payload;
    }
  },
  actions: {
    registerWeb3({ commit }) {
      // console.log('registerWeb3 Action being executed');
      getWeb3
        .then(result => {
          // console.log('committing result to registerWeb3Instance mutation');
          commit('registerWeb3Instance', result);
        })
        .catch(error => {
          console.log('error in action registerWeb3', error);
        });
    },
    pollWeb3({ commit }, payload) {
      // console.log('pollWeb3 action being executed');
      commit('pollWeb3Instance', payload);
    },
    getContractInstance({ commit }) {
      getContract
        .then(result => {
          commit('registerContractInstance', result);
        })
        .catch(e => console.log(e));
    }
  },
  modules: {
    signInModal
  }
});

/*
state - stores the data
getters - functions which return something from the state
actions - do all the logic you need like async calls, etc and then commit mutations
mutations - it should only update the state, no side effects, state is received as a first parameter
*/
