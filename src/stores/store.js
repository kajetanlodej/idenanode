import { createStore } from 'vuex';

export default createStore({
  state: {
    stake: 0,
    delegatee: null // Add delegatee to the state

  },
  mutations: {
    setStake(state, stake) {
      state.stake = stake;
    },
    setDelegatee(state, delegatee) {
      state.delegatee = delegatee; // Add mutation to set delegatee
    }
  },
  actions: {
    updateStake({ commit }, stake) {
      commit('setStake', stake);
    },
    updateDelegatee({ commit }, delegatee) {
      commit('setDelegatee', delegatee); // Add action to update delegatee
    }
  },
  getters: {
    stake: (state) => state.stake,
    delegatee: (state) => state.delegatee
  }
});
