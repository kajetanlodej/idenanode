import { createStore } from 'vuex';

export default createStore({
  state: {
    stake: 0,
    miningReward: 0,
    stakingReward: 0,
    extraFlipReward: 0,
    invitationReward: 0,
    apy: 0,
    delegatee: null, // Add delegatee to the state
    loggedAddress: null, // Add delegatee to the state
    miningDistributionCountdown: 0,
    stakingDistributionCountdown: 0,
    delegationPopup: false,
    myDelegatee: null,
    globeInicialized: null,
  },
  mutations: {
    setStake(state, stake) {
      state.stake = stake;
    },
    setMiningReward(state, miningReward) {
      state.miningReward = miningReward;
    },
    setStakingReward(state, stakingReward) {
      state.stakingReward = stakingReward;
    },
    setExtraFlipReward(state, extraFlipReward) {
      state.extraFlipReward = extraFlipReward;
    },
    setInvitationReward(state, invitationReward) {
      state.invitationReward = invitationReward;
    },
    setApy(state, apy) {
      state.apy = apy;
    },
    setDelegatee(state, delegatee) {
      state.delegatee = delegatee; // Add mutation to set delegatee
    },
    setLoggedAddress(state, loggedAddress) {
      state.loggedAddress = loggedAddress; // Add mutation to set delegatee
    },
    setMiningDistributionCountdown(state, miningDistributionCountdown) {
      state.miningDistributionCountdown = miningDistributionCountdown;
    },
    setStakingDistributionCountdown(state, stakingDistributionCountdown) {
      state.stakingDistributionCountdown = stakingDistributionCountdown;
    },
    setDelegationPopup(state, delegationPopup) {
      state.delegationPopup = delegationPopup;
    },
    setDelegateeCheck(state, myDelegatee) {
      state.myDelegatee = myDelegatee;
    },
    setGlobeInicialized(state, globeInicialized) {
      state.globeInicialized = globeInicialized;
    }
  },
  actions: {
    updateStake({ commit }, stake) {
      commit('setStake', stake);
    },
    updateMiningReward({ commit }, miningReward) {
      commit('setMiningReward', miningReward);
    },
    updateStakingReward({ commit }, stakingReward) {
      commit('setStakingReward', stakingReward);
    },
    updateExtraFlipReward({ commit }, extraFlipReward) {
      commit('setExtraFlipReward', extraFlipReward);
    },
    updateInvitationReward({ commit }, invitationReward) {
      commit('setInvitationReward', invitationReward);
    },
    updateApy({ commit }, apy) {
      commit('setApy', apy);
    },
    updateDelegatee({ commit }, delegatee) {
      commit('setDelegatee', delegatee); // Add action to update delegatee
    },
    updateLoggedAddress({ commit }, loggedAddress) {
      commit('setLoggedAddress', loggedAddress); // Add action to update delegatee
    },
    updateMiningDistributionCountdown({ commit }, miningDistributionCountdown) {
      commit('setMiningDistributionCountdown', miningDistributionCountdown);
    },
    updateStakingDistributionCountdown({ commit }, stakingDistributionCountdown) {
      commit('setStakingDistributionCountdown', stakingDistributionCountdown);
    },
    updateDelegationPopup({ commit }, delegationPopup) {
      commit('setDelegationPopup', delegationPopup);
    },
    updateDelegateeCheck({ commit }, myDelegatee) {
      commit('setDelegateeCheck', myDelegatee);
    },
    updateGlobeInicialized({ commit }, globeInicialized) {
      commit('setGlobeInicialized', globeInicialized);
    }

  },
  getters: {
    stake: (state) => state.stake,
    miningReward: (state) => state.miningReward,
    stakingReward: (state) => state.stakingReward,
    extraFlipReward: (state) => state.extraFlipReward,
    invitationReward: (state) => state.invitationReward,
    apy: (state) => state.apy,
    delegatee: (state) => state.delegatee,
    loggedAddress: (state) => state.loggedAddress,
    miningDistributionCountdown: (state) => state.miningDistributionCountdown,
    stakingDistributionCountdown: (state) => state.stakingDistributionCountdown,
    delegationPopup: (state) => state.delegationPopup,
    myDelegatee: (state) => state.myDelegatee,
    globeInicialized: (state) => state.globeInicialized,
  }
});
