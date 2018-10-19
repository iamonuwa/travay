import * as types from '../types'
import {commit} from 'lodash'

const state = {
  cookieConsentVersion: ''
};
const getters = {
  [types.SET_COOKIE_CONSENT_VERSION](state) {
    return state.cookieConsentVersion;
  }
};
const actions = {};
const mutations = {
  [types.SET_COOKIE_CONSENT_VERSION](state, payload) {
  },
  SET_COOKIE_CONSENT_VERSION(state, payload) {
    state.cookieConsentVersion = version;
  },
};

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
