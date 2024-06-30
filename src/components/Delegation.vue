<template>
  <div id="wrapper">
    <div id="prediction">
      <div id="title">
        <h3>REWARDS CALCULATION</h3>
      </div>
      <div id="stakeApy">
        <div>Stake, iDNA</div>
        <div>APY, %</div>
      </div>
      <div id="values">
        <div>
          {{ amountValue }}
        </div>
        <div>
          {{amountValue? parseFloat(
          (
            (
              (
                calcStakingReward(amountValue) +
                calcMiningReward(amountValue) +
                calcExtraFlipReward(amountValue) +
                calcInvitationReward(amountValue)
              ) * 100 / amountValue
            ) * 366
          ) / epochTime.epochDuration * 0.9 
        ).toFixed(2): 0}}
        </div>
      </div>
      <div id="calculation">
        <!-- 90% of the rewards are distributed to the delegators. The remaining 10% are distributed to the pool owner. -->
        <div class="rewards">
          <div>Mining reward:</div>
          <div>
            {{parseFloat(calcMiningReward(amountValue) * 0.9).toFixed(2)}} iDNA
          </div>
        </div>
        <div class="rewards">
          <div>Validation reward:</div>
          <div>
            {{parseFloat(calcStakingReward(amountValue) * 0.9).toFixed(2)}} iDNA
          </div>
        </div>
        <div class="rewards">
          <div>Extra flip reward:</div>
          <div>
            {{parseFloat(calcExtraFlipReward(amountValue) * 0.9).toFixed(2)}}
            iDNA
          </div>
        </div>
        <div class="rewards">
          <div>Invitation reward:</div>
          <div>
            {{parseFloat(calcInvitationReward(amountValue) * 0.9).toFixed(2)}}
            iDNA
          </div>
        </div>
        <hr />
        <div class="rewards" id="total">
          <div>Total epoch reward:</div>
          <div>
            {{parseFloat((calcMiningReward(amountValue)+calcStakingReward(amountValue)+calcExtraFlipReward(amountValue)+calcInvitationReward(amountValue))*0.9 ).toFixed(2)}}
            iDNA
          </div>
        </div>
      </div>
    </div>
    <div id="delegation">
    
    <!-- <p>Delegate using official <a href="https://app.idena.io" target="_blank">Idena web app</a></p> -->
    <!-- <button class="button" type="button" @click="delegate">DELEGATE</button> -->
        <button 
      class="button" 
      type="button" 
      v-if="!isMyPoolDelegatee" 
      @click="emitSendDelegateTx"
    >
      DELEGATE
    </button>
    <button 
      class="button" 
      type="button" 
      v-else-if="delegatee !== null && isMyPoolDelegatee" 
      @click="emitSendUnDelegateTx"
    >
      UNDELEGATE
    </button>
    <button 
      class="button" 
      type="button"
      v-else-if="delegatee === null"
      :disabled="delegatee === null" 
    >
      DELEGATE
    </button>
    
    <!-- <div id="title">
        <h3>DELEGATION ADDRESS</h3>
        
    </div> -->
    <!-- <div id ="address">
      0x4AE59825651D492134fc67ED1DD459E4F006CF93
    </div> -->
    <a href="https://scan.idena.io/pool/0x4AE59825651D492134fc67ED1DD459E4F006CF93" target="_blank">Pool details</a>
    </div>

    <div id="countdowns">
      <div id="titles">
        <div id="left">Mining rewards distribution in</div>
        <div id="right">Validation rewards distribution in</div>
      </div>

      <div id ="validation">
        <span id="clock">{{countdown }}</span>
        <span id="clock">{{ countdown1 }}</span>
      </div>
      
    </div>  

    <!-- <div id="countdown">
      <span id="clock">{{ countdown }}</span>
    </div> -->
    <!-- <div id="validation">
      <span>Until the next distribution of mining rewards</span>
      <hr id="divider" />
      <span>Validation rewards are distributed right after the validation ends</span>
    </div> -->
    <!-- <div id="delegation">
      <span>Delegate to idenanode.com pool:</span>
      <button>DELEGATE</button>
      <div id="delegationStatus">
        <span>Your Idena identity is currently</span> <span>delegated / undelegated</span>
        <span>to idenanode.com</span>
      </div>
    </div> -->

    <!-- <div id="stats">
  <div id="identityStats">
    <h2>Identity stats</h2>
      <span>Mining reward: {{ delegatorsCount }} iDNA</span>
      <span>Validation reward: {{ totalStake }} iDNA</span>
      <span>Extra flip premium: 100 iDNA </span>
      <span>Invitation reward: 100 iDNA</span>
      <span>Total rewards received: 200 iDNA </span>
      <span>Rewards last received on: 16.02.2024</span>
    </div>
    <div id="poolStats">
      <h2>Pool stats</h2>
      <span>Identities: {{ delegatorsCount }}</span>
      <span>Total stake: {{ totalStake }} iDNA</span>
    </div>
    <div id="aboutDelegation">
      <span>See <a target="_blank" href="https://www.idena.io/pl/faq#faq-delegation-1">official FAQ</a> on idena.io to learn more about delegation.</span>
      <span>Be aware that pool owner has the ability to terminate delegated identity and pocket its stake.</span>
      <span>Delegate your identity only to a trusted pool.</span>
    </div>
  </div> -->




    <!-- <div class="container">
      <ul class="nav nav-tabs">
        <li class="active">
          <a data-toggle="tab" href="#home"
            >Pool's delegators: {{ totalDelegators }} </a
          >
        </li>
        <li>
          <a data-toggle="tab" href="#menu1"
            >Receive history from idenanode.com</a
          >
        </li>

      </ul>

      <div class="tab-content" style="height: 40vh; overflow-y: auto">
        <div id="home" class="tab-pane fade in active">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Stake, iDNA</th>
                  <th>Status</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="delegator in delegators" :key="delegator.address">
                  <td>
                    <div id="user">
                      <div class="user-pic">
                        <img
                          :src="delegator.address ? `https://robohash.idena.io/${delegator.address.toLowerCase()}` : ''"
                          alt="pic"
                          width="32"
                        />
                      </div>
                      <div class="text_block text_block--ellipsis">
                        <a
                          :href="`https://scan.idena.io/address/${delegator.address}`"
                          target="_blank"
                          @click="$event.target.blur()"
                        >
                          {{ delegator.address }}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td class="rowElement">
                    {{ parseFloat(delegator.stake).toFixed(2) }}
                  </td>
                  <td class="rowElement">{{ delegator.state }}</td>
                  <td class="rowElement">{{ delegator.age }}</td>
                </tr>
              </tbody>
            </table>
            <div class="text-center">
              <button
                v-if="dataLoaded && !allDelegatorsFetched"
                @click="fetchMoreDelegators"
              >
                Show More
              </button>
            </div>
          </div>
        </div>
        <div id="menu1" class="tab-pane fade">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Transaction</th>

                  <th>Amount, iDNA</th>
                  <th style="width: 220px">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in transactions" :key="transaction.hash">
                  <td>
                    <div
                      class="text_block text_block--ellipsis"
                      style="width: 80px"
                    >
                      <a
                        :href="`https://scan.idena.io/transaction/${transaction.hash}`"
                        target="_blank"
                        @click="$event.target.blur()"
                        >{{ transaction.hash.substring(0, 8) + '...' }}</a
                      >
                    </div>
                  </td>
                  <td class="rowElement">{{transaction.amount}}</td>
                  <td class="rowElement">
                    
                    {{new Date(transaction.timestamp).toLocaleString()}}
                  </td>

                </tr>
              </tbody>
            </table>
            <div class="text-center" v-if="canFetchMore">
              <button
                v-if="dataLoaded && !allTransactionsFetched"
                @click="fetchMoreTransactions"
              >
                Show More
              </button>
            </div>
          </div>
        </div>

      </div>
    </div> -->


  </div>
</template>
<script>
import { EventBus } from '../eventBus.js'

import { mapState } from 'vuex'
import axios from 'axios'
import {
  // ART_GENERATORS,
  POOL_ADDRESS,
} from "../config.js";
import 'bootstrap';
export default {
  props: {
    sendDelegateTx: Function,
    sendUnDelegateTx: Function,
  },
  data() {
    return {
      countdown: '00:00:00',
      countdown1: '00:00:00:00',
      countdownInterval: null,
      validationTime: null,
      delegators: [],
      canFetchMore: true,
      continuationToken: null,
      limit: 30,
      allDelegatorsFetched: false,
      allTransactionsFetched: false,
      totalDelegators: 0,
      dataLoaded: false,
      // Staking stats
      weight: null,
      totalShares: null,
      averageMinerWeight: null,
      rewardFund: {},
      rewardWeight: {},
      onlineSize: null,
      epochRewardFund: null,
      totalStake: null,
      epochNum: null,
      epochTime: {},
      STAKING_POWER: 0.9,
      //amountValue: 100000, //change to take into account the amount of the user
      transactions: [],
    }
  },
  computed: {
    ...mapState({
      amountValue: (state) => state.stake,
      delegatee: (state) => state.delegatee
    }),
    isMyPoolDelegatee() {
      console.log("1 i 2",this.delegatee, POOL_ADDRESS);
      console.log("rownasie",this.delegatee === POOL_ADDRESS)
      return this.delegatee === POOL_ADDRESS;
    }
  },

  mounted() {
    this.fetchValidationTime();
    this.startCountdown()
    this.fetchDelegators()
    this.fetchTotalDelegators();
    this.getData();
    this.fetchTransactions();

  },
  methods: {
    emitSendDelegateTx() {
      EventBus.$emit('sendDelegateTx');
    },
    emitSendUnDelegateTx() {
      EventBus.$emit('sendUnDelegateTx');
    },
    async getData() {
      try {
        const coinsResponse = await axios.get('https://api.idena.io/api/coins');
        const stakingResponse = await axios.get('https://api.idena.io/api/staking');
        const onlineResponse = await axios.get('https://api.idena.io/api/onlineminers/count');
        const epochResponse = await axios.get('https://api.idena.io/api/epoch/last');
        const epochNumber = epochResponse.data.result.epoch - 1;
        const prevEpochResponse = await axios.get(`https://api.idena.io/api/epoch/${epochNumber}`);
        const rewardsResponse = await axios.get(`https://api.idena.io/api/epoch/${epochNumber}/rewardssummary`);

        const epochStart = new Date(prevEpochResponse.data.result.validationTime);
        const epochEnd = new Date(epochResponse.data.result.validationTime);
        const nowDate = new Date();
        const epochDuration = Math.round(Math.abs((epochEnd.getTime() - epochStart.getTime()) / 86400000));
        const epochDurationMinutes = epochDuration * 24 * 60;
        const epochLeftMinutes = Math.round(Math.max(0, ((epochEnd.getTime() - nowDate.getTime()) / 86400000) * 24 * 60));
        const epochLeftPercent = Math.min(99, (epochLeftMinutes / epochDurationMinutes) * 100);
        const epochLeft = epochLeftMinutes < 60 ? epochLeftMinutes : epochLeftMinutes > 24 * 60 ? Math.round(epochLeftMinutes / 24 / 60) : Math.round(epochLeftMinutes / 60);
        const epochLeftUnit = epochLeftMinutes < 60 ? 'Minutes' : epochLeftMinutes > 24 * 60 ? 'Days' : 'Hours';

        this.weight = stakingResponse.data.result.weight;
        this.totalShares = stakingResponse.data.result.minersWeight;
        this.averageMinerWeight = stakingResponse.data.result.averageMinerWeight;
        this.rewardFund = {
          extraFlips: rewardsResponse.data.result.extraFlips,
          invitations: rewardsResponse.data.result.invitations,
        };
        this.rewardWeight = {
          extraFlips: stakingResponse.data.result.extraFlipsWeight,
          invitations: stakingResponse.data.result.invitationsWeight,
        };
        this.onlineSize = onlineResponse.data.result;
        this.epochRewardFund = rewardsResponse.data.result.staking && rewardsResponse.data.result.staking > 0 ? rewardsResponse.data.result.staking : rewardsResponse.data.result.validation * this.STAKING_POWER;
        this.totalStake = coinsResponse.data.result.totalStake;
        this.epochNum = epochResponse.data.result.epoch;
        this.epochTime = {
          epochDuration,
          epochLeftPercent,
          epochLeft,
          epochLeftUnit,
        };
      } catch (e) {
        console.error('cannot fetch API', e);
      }
    },
    calculateEstimatedMiningReward(stakeWeight, averageMinerWeight, onlineMinersCount, epochDays) {
    const proposerOnlyReward = (6 * stakeWeight * 20) / (stakeWeight * 20 + averageMinerWeight * 100);
    const committeeOnlyReward = (6 * stakeWeight) / (stakeWeight + averageMinerWeight * 119);
    const proposerAndCommitteeReward = (6 * stakeWeight * 21) / (stakeWeight * 21 + averageMinerWeight * 99);

    const proposerProbability = 1 / onlineMinersCount;
    const committeeProbability = Math.min(100, onlineMinersCount) / onlineMinersCount;

    const proposerOnlyProbability = proposerProbability * (1 - committeeProbability);
    const committeeOnlyProbability = committeeProbability * (1 - proposerProbability);
    const proposerAndCommitteeProbability = proposerOnlyProbability * committeeOnlyProbability;

    return ((85000 * epochDays) / 21.0) * (proposerOnlyProbability * proposerOnlyReward + committeeOnlyProbability * committeeOnlyReward + proposerAndCommitteeProbability * proposerAndCommitteeReward);
  },
    calcStakingReward(amount) {
    return (amount ** this.STAKING_POWER / (amount ** this.STAKING_POWER + this.weight)) * this.epochRewardFund;
  },
  calcExtraFlipReward(amount) {
    return (amount ** this.STAKING_POWER / this.rewardWeight.extraFlips) * this.rewardFund.extraFlips;
  },
  calcInvitationReward(amount) {
    return (amount ** this.STAKING_POWER / this.rewardWeight.invitations) * this.rewardFund.invitations;
  },
  calcMiningReward(amount) {
    const myStakeWeight = amount ** this.STAKING_POWER;
    return this.calculateEstimatedMiningReward(myStakeWeight, this.averageMinerWeight, this.onlineSize, this.epochTime.epochDuration);
  },

    async fetchValidationTime() {
      try {
        const response = await axios.get('https://api.idena.io/api/Epoch/Last');
        const validationTime = new Date(response.data.result.validationTime);
        validationTime.setMinutes(validationTime.getMinutes() + 45);
        this.validationTime = validationTime;
        this.startValidationCountdown();
      } catch (error) {
        console.error('Error fetching validation time:', error);
      }
    },
    startValidationCountdown() {
      this.countdownInterval = setInterval(() => {
        const now = new Date();
        const timeDifference = this.validationTime - now;
        let timeInSeconds = Math.floor(timeDifference / 1000);

        if (timeInSeconds <= 0) {
          clearInterval(this.countdownInterval);
          this.countdown1 = '00:00:00:00';
          return;
        }

        const days = Math.floor(timeInSeconds / (3600 * 24));
        const hours = Math.floor((timeInSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        this.countdown1 = `${this.formatTime(days)}:${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
      }, 1000);
    },
  
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        const now = new Date();
        const nowUTC = new Date(now.toISOString().slice(0, -1) + 'Z');
        const nextSixAMUTC = new Date(nowUTC);

        if (nowUTC.getUTCHours() >= 6) {
          nextSixAMUTC.setUTCDate(nowUTC.getUTCDate() + 1);
        }
        nextSixAMUTC.setUTCHours(6, 0, 0, 0);

        const timeDifference = nextSixAMUTC - nowUTC;
        let timeInSeconds = Math.floor(timeDifference / 1000);

        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        this.countdown = `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;

        if (timeInSeconds <= 0) {
          clearInterval(this.countdownInterval);
          this.countdown = '00:00:00';
          this.startCountdown(); // Restart the countdown for the next day
        }
      }, 1000);
    },
    formatTime(time) {
      return time.toString().padStart(2, '0')
    },
    getPoolStats() {
      const apiUrl = 'https://api.idena.io/api/Pool/0x4FF1F5764d4a5845E30d208717432C1d4Cac3399'
      axios
        .get(apiUrl)
        .then((response) => {
          if (response && response.data && response.data.result) {
            this.delegatorsCount = response.data.result.size
            this.totalStake = Math.floor(response.data.result.totalStake)
          }
          console.log('Delegators count:', this.delegatorsCount)
        })
        .catch((error) => {
          console.error('Error fetching delegators count:', error)
        })
    },
    tabClicked (selectedTab) {
      console.log('Current tab re-clicked:' + selectedTab.tab.name)
    },
    tabChanged (selectedTab) {
      console.log('Tab changed to:' + selectedTab.tab.name)
    },
    async fetchDelegators() {
  const response = await axios.get(`https://api.idena.io/api/Pool/0x17b851A11f7d37054928BEf47F0F22166d433917/Delegators`, {
    params: {
      limit: this.limit,
      continuationToken: this.continuationToken,
    },
  });

  // Filter out the 'length' property
  const delegators = response.data.result.filter(item => item !== 'length');

  this.delegators = [...this.delegators, ...delegators];
  console.log(delegators);
  console.log(delegators.length)
  if (response.data.continuationToken) {
    this.continuationToken = response.data.continuationToken;
  } else {
    this.allDelegatorsFetched = true;
  }
  this.dataLoaded = true;
},
  async fetchTotalDelegators() {
    const response = await axios.get(`https://api.idena.io/api/Pool/0x17b851A11f7d37054928BEf47F0F22166d433917/Delegators/Count`);
    this.totalDelegators = response.data.result;
    console.log(response.data.result);
  },
  fetchMoreDelegators() {
    if (!this.allDelegatorsFetched) {
      this.fetchDelegators();
    }
  },
  fetchMoreTransactions() {
    if (!this.allTransactionsFetched) {
      this.fetchTransactions();
    }
  },
  async fetchTransactions() {
    const response = await axios.get(`https://api.idena.io/api/Address/0x344a09ec5b9b5debc5a889837c50c66c8a78f04d/Txs`, {
    params: {
      limit: this.limit,
      continuationToken: this.continuationToken,
    },
  });
      const transactions = response.data.result
      console.log(transactions);

      this.transactions = [...this.transactions, ...transactions];
      console.log(transactions);
      if (response.data.continuationToken) {
    this.continuationToken = response.data.continuationToken;
  } else {
    this.allTransactionsFetched = true;
  }
  this.dataLoaded = true;
      // this.canFetchMore = !!response.continuationToken;
    },


  }
}

</script>

<style scoped>
/* h2,h1{
  color:white;
} */

/* span {
  color: white;
} */

#wrapper {
  display: flex;
  justify-content: center;  
  height: 90vh;
  flex-direction: column;
  font-family: "Lexend Exa", sans-serif;
  color: #131313;
  justify-content: center;
}

#delegation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  height: 30vh;
  font-weight: 600;
  color: #131313;
}

#countdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
}

#poolStats {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
}

#clock {
  font-size: 3rem;
  font-weight: 200;
  color: #131313 ;
}

#delegationStatus {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.2rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
}

#aboutDelegation {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
}



#identityStats {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
  border-right: solid;
}

#poolStats {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
}

#stats {
  width: 100%;
  display: flex;
  flex-direction: row;
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
  justify-content: center;
}

#countdowns {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

#validation {
  width: 60%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}
#titles{
  width: 60%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;

}

#mining {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

#divider {
  width: 100%;
  margin: 2px;
}
.container {
  margin-top: 2rem;
  width: 100%;
  height: 40%;
  color: white;
}
#user {
  display: flex;
  align-items: center;
}
.rowElement {
  vertical-align: middle;
}
th {
  font-weight: 600;
}
button:disabled {
  background-color: #cccccc;
  color: #666666;
}
.user-pic {
  margin-right: 10px;
  border-radius: 50%;
  background-color: white;
}
.tab-content {
  --s: 30px; /* the size on the corner */
  --t: 1px; /* the thickness of the border */
  --g: 20px; /* the gap between the border and image */

  /* padding: calc(var(--g) + var(--t));
  outline: var(--t) solid white; 
  outline-offset: calc(-1*var(--t));
  mask:
    conic-gradient(at var(--s) var(--s),#0000 75%,#000 0)
    0 0/calc(100% - var(--s)) calc(100% - var(--s)),
    linear-gradient(#000 0 0) content-box; */
  /* transition: .4s; */
}
#prediction {
  height: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
}
#stakeApy,
#values {
  width: 60%;
  display: flex;
  justify-content: space-between;
}
#values {
  font-size: 3rem;
  font-weight: 600;
}
#stakeApy {
  color: grey;
}
#calculation {
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-top: 2rem;
  justify-content: space-between;
}

.rewards {
  display: flex;
  justify-content: space-between;
}
#total {
  font-size: 1.75rem;
}
.nav-tabs {
  border-bottom: none;
}
a {
  color: #0866ff;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #0056b3; 
}

a:active {
  color: #011531; /* Change the link color when it's active */
}
#address {
  margin-bottom: 0px;
  font-size: 1.9rem;
  font-weight: 500;

}

#left{
  text-align: left;
}
#right{
  text-align: right;
}
.button {
  align-items: center;
  background-color: #0A66C2;
  border: 0;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  font-weight: 300;
  justify-content: center;
  line-height: 20px;
  max-width: 480px;
  min-height: 40px;
  min-width: 0px;
  overflow: hidden;
  padding: 0px;
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
  touch-action: manipulation;
  transition: background-color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, box-shadow 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
}

.button:hover
 { 
  background-color: #09223b;
  color: #ffffff;
}

.button:active {
  background: #09223b;
  color: rgb(255, 255, 255, .7);
}

.button:disabled { 
  cursor: not-allowed;
  background: rgba(0, 0, 0, .08);
  color: rgba(0, 0, 0, .3);
}
</style>
