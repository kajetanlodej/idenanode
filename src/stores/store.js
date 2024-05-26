import { createStore } from 'vuex';

export default createStore({
  state: {
    stake: 0
  },
  mutations: {
    setStake(state, stake) {
      state.stake = stake;
    }
  },
  actions: {
    updateStake({ commit }, stake) {
      commit('setStake', stake);
    }
  },
  getters: {
    stake: (state) => state.stake
  }
});
