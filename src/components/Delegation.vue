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
          {{parseFloat(
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
        ).toFixed(2)}}
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
    <div class="container">
      <ul class="nav nav-tabs">
        <li class="active">
          <a data-toggle="tab" href="#home"
            >Pool's delegators: {{ totalDelegators }}</a
          >
        </li>
        <li>
          <a data-toggle="tab" href="#menu1"
            >Receive history from idenanode.com</a
          >
        </li>
        <!-- <li><a data-toggle="tab" href="#menu2">Menu 2</a></li>
    <li><a data-toggle="tab" href="#menu3">Menu 3</a></li> -->
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
        <!-- Second tab -->
        <div id="menu1" class="tab-pane fade">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <!-- <th>From</th>
          <th>To</th> -->
                  <th>Amount, iDNA</th>
                  <th style="width: 220px">Timestamp</th>
                  <!-- <th style="width: 100px;">Type</th> -->
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

                  <!-- Similar for other columns... -->
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
        <!-- <div id="menu2" class="tab-pane fade">
      <h3>Menu 2</h3>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
    </div>
    <div id="menu3" class="tab-pane fade">
      <h3>Menu 3</h3>
      <p>Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import 'bootstrap';
export default {
  data() {
    return {
      countdown: '',
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
      amountValue: 100000, //change to take into account the amount of the user
      transactions: [],
    }
  },
  mounted() {
    this.startCountdown()
    this.fetchDelegators()
    this.fetchTotalDelegators();
    this.getData();
    this.fetchTransactions();

  },
  methods: {
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
    startCountdown() {
      const countdownInterval = setInterval(() => {
        const now = new Date()
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(8, 0, 0, 0) // 8:00 AM

        // Convert to CET timezone
        const cetOffset = -1 // CET is UTC+1
        const cetTomorrow = new Date(tomorrow.getTime() + cetOffset * 60 * 60 * 1000)

        let timeInSeconds = Math.floor((cetTomorrow - now) / 1000)

        const hours = Math.floor(timeInSeconds / 3600)
        const minutes = Math.floor((timeInSeconds % 3600) / 60)
        const seconds = timeInSeconds % 60

        this.countdown = `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`

        if (timeInSeconds <= 0) {
          clearInterval(countdownInterval)
          this.countdown = '00:00:00'
        }
      }, 1000)
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
  height: 90vh;
  flex-direction: column;
  font-family: "Lexend Exa", sans-serif;
  color: white;
}

#delegation {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
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
  font-size: 4rem;
  font-weight: 600;
  color: white;
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

button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
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

#validation {
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
a:hover {
  text-decoration: none;
}

a:focus {
  text-decoration: none;
}
</style>
