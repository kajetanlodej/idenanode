<template>
  <div id="wrapper-delegation">
  <div class="inside-wrapper">
    <div id="prediction">
      <div id="title">
        <h3>REWARDS PREDICTION</h3>
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
  {{amountValue ? (isNaN(parseFloat(this.apy * 1)) ? '0.00' : parseFloat(this.apy * 1).toFixed(2)) : '0'}}
</div>

      </div>
      <div id="calculation">
        <!-- 90% of the rewards are distributed to the delegators. The remaining 10% are distributed to the pool owner. -->
        <div class="rewards">
          <div>Mining reward:</div>
          <div>
            {{parseFloat(this.miningReward * 1).toFixed(2)}} iDNA
          </div>
        </div>
        <div class="rewards">
          <div>Validation reward:</div>
          <div>
            {{parseFloat(this.stakingReward * 1).toFixed(2)}} iDNA
          </div>
        </div>
        <div class="rewards">
          <div>Extra flip reward:</div>
          <div>
            {{parseFloat(this.extraFlipReward * 1).toFixed(2)}}
            iDNA
          </div>
        </div>
        <div class="rewards">
          <div>Invitation reward:</div>
          <div>
            {{parseFloat(this.invitationReward * 1).toFixed(2)}}
            iDNA
          </div>
        </div>
        <hr />
        <div class="rewards" id="total">
          <div>Total epoch reward:</div>
          <div>
            {{parseFloat((this.miningReward+this.stakingReward+this.extraFlipReward+this.invitationReward) * 1).toFixed(2)}}
            iDNA
          </div>
        </div>
      </div>
    </div>
    <div id="delegation">
     <div class="spinner-border text-primary" role="status">
</div>
    <span id="currentStatus" style="margin-bottom:2px" v-if="loggedAddress!== null && delegatee === null"> You are currently not delegating to any pool</span>
<span id="currentStatus" style="margin-bottom:2px" v-if="loggedAddress !== null && delegatee !== null">
  You are currently delegating to: 
  <a 
    :href="'https://scan.idena.io/pool/' + delegatee" 
    target="_blank" 
    rel="noopener noreferrer">
    <span v-if="delegatee === poolAddress">Idenanode pool</span>
    <span v-else>{{ delegatee.substring(0, 6) }}...</span>
  </a>
</span>  

<button 
      class="button" 
      style="display: flex; flex-direction: column; align-items: center;"
      type="button" 
      v-if="loggedAddress !== null && delegatee === null" 
      @click="handleDelegateClick"
      :disabled="this.delegationPopup"
    >
    <span v-if="!myDelegatee" class="buttonText">
      <span class="mainButton nav-text">DELEGATE</span>
      <span class="subButton nav-text">TO IDENANODE POOL</span>
    </span>
      <span v-if="myDelegatee" class="loader"></span>

    </button>
    
    <button 
      class="button" 
      style="display: flex; flex-direction: column; align-items: center;"
      type="button" 
      v-if="loggedAddress !== null && delegatee !== null"
      @click="handleUnDelegateClick"
      :disabled="this.delegationPopup"
    >
    <span v-if="!myDelegatee" class="buttonText">
      <span class="mainButton nav-text">UNDELEGATE</span>
      <span class="subButton nav-text">FROM CURRENT POOL</span>
    </span>  
      <span v-if="myDelegatee" class="loader"></span>

    </button>

    <!-- logged out -->
    <button  
      class="button" 
      style="display: flex; flex-direction: column; align-items: center;"
      type="button"
      v-if="loggedAddress === null"
      :disabled="true"
    >
      <span class="mainButton nav-text">DELEGATE</span>
      <span class="subButton nav-text">TO IDENANODE POOL</span>
    </button>
    <a style="margin-top:2px" v-if="delegatee != poolAddress" href="https://scan.idena.io/pool/0x4AE59825651D492134fc67ED1DD459E4F006CF93" target="_blank">Idenanode pool details</a>
    </div>
    <div id="countdowns">
      <div id="titles">
        <div id="left">Mining rewards distribution</div>
        <div id="right">Validation rewards distribution</div>
      </div>
      <div id ="validation">
        <span id="clock">{{ this.miningCountdown }}</span>
        <span id="clock">{{ this.validationCountdown}}</span>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { mapState } from 'vuex'
import {
  POOL_ADDRESS,
} from "../config.js";
import 'bootstrap';
import { Conn } from "../connection.js";
import {
  NODE_URL,
  NODE_KEY,
} from "../config.js";
import {
  bufferToHex,
  toBuffer,
} from "ethereumjs-util";
import { BN } from "bn.js";
import * as proto from "../proto/models_pb.js";

export default {
  data() {
      const conn = new Conn(this.connected, NODE_URL, NODE_KEY);
    return {
      poolAddress: null, // Initialize as null to avoid undefined access
      popupOpen: false,
      conn,
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
      transactions: [],
      delegateFound: false,
    }
  },
    created() {
    this.poolAddress = POOL_ADDRESS;
  },
  computed: {
    ...mapState({
      amountValue: (state) => state.stake,
      delegatee: (state) => state.delegatee,
      loggedAddress: (state) => state.loggedAddress,
      miningReward: (state) => state.miningReward,
      stakingReward: (state) => state.stakingReward,
      extraFlipReward: (state) => state.extraFlipReward,
      invitationReward: (state) => state.invitationReward,
      apy: (state) => state.apy,
      miningCountdown: (state) => state.miningDistributionCountdown,
      validationCountdown: (state) => state.stakingDistributionCountdown,
      delegationPopup: (state) => state.delegationPopup,
      myDelegatee: (state) => state.myDelegatee,
    }),
  },

  mounted() {

  },
  methods: {
       sendDelegateTx: async function () {

    const argsArray = [
      {
        index: 0,
        format: "hex",
        value: this.loggedAddress,
      },
    ];
    await this.buildTx("delegate", argsArray, 0x12);
},
...mapActions(['updateDelegationPopup', 'updateDelegateeCheck','updateDelegatee']),
    async handleDelegateClick() {
      this.updateDelegationPopup(true);
      await this.sendDelegateTx();
    },
    async handleUnDelegateClick() {
      this.updateDelegationPopup(true);
      await this.sendUnDelegateTx();
    },
    sendUnDelegateTx: async function () {
        const argsArray = [
          {
            index: 0,
            format: "hex",
            value: this.loggedAddress,
          },
        ];
        await this.buildTx("undelegate", argsArray, 0x13);
    },
    checkPendingTxs: async function () {
  try {
    // Fetch the latest pending transactions
    this.txgenerated = await this.conn.getPendingTx({
      address: this.loggedAddress // Assuming 'address' is a required field
    });
    let delegateFound = false;
    // Check if transactions are present and valid
    if (this.txgenerated && this.txgenerated.transactions ) {
      for (let tx of this.txgenerated.transactions) {
        if (tx.type === "delegate" && tx.to === POOL_ADDRESS) {
          // console.log("Transaction found:", tx);
          delegateFound = true;
          this.updateDelegateeCheck(true);
          this.updateDelegatee(tx.to);
          // console.log("updateDelegateeCheck",this.myDelegatee);
          break;
        }
        if ( tx.type === "undelegate") {
          this.updateDelegatee(null);
          this.updateDelegateeCheck(true);
          delegateFound = true;
        }
      }
      // If no matching delegate transaction is found, clear the interval
      if (!delegateFound) {
        // console.log("No matching delegate transaction found, clearing interval.");
        this.updateDelegationPopup(false);
        // console.log(this.delegationPopup)
        this.updateDelegateeCheck(false);

      }
    } else {
      // console.log("No transactions or response is invalid, clearing interval.");
      // console.log("status", this.delegationPopup);
      this.updateDelegateeCheck(false);
      this.updateDelegationPopup(false);
      // console.log("status", this.delegationPopup);

    }
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    this.updateDelegationPopup(false);
    // console.log(this.delegationPopup)
    this.updateDelegateeCheck(false);
  }
    },
  buildTx: async function (method, args, TxType) {
      const windowFeatures = "left=100,top=100,width=400,height=700";
      var popup = window.open("", "_blank",windowFeatures);
       const popupCheckInterval = setInterval(async () => {
  if (this.delegationPopup && !popup.closed) {
    console.log("Popup is open");
  } else {
    console.log("Popup is closed");
    clearInterval(popupCheckInterval);
    await this.checkPendingTxs();
    if (this.delegationPopup === true) {
      const pendingTxsInterval = setInterval(async () => {
        await this.checkPendingTxs();
        if (this.delegationPopup === false) {
          clearInterval(pendingTxsInterval);
        }
      }, 5000);
    }
  }
}, 1000);
      try {
        const maxFeeInt = 1e18;
        // console.log("maxFeeInt", maxFeeInt);
        const maxFee = new BN(maxFeeInt.toString()); //TODO: change to the max fee
        const maxFeeBytes = toBuffer(maxFee);
        const addre = POOL_ADDRESS; 
        this.epoch = (await this.conn.getEpoch()).epoch;
        this.nonce = (await this.conn.getBalance(this.loggedAddress)).nonce + 1;
        const txData = {
  type: TxType,
  maxFee: maxFeeBytes, //todo 
  nonce: this.nonce,
  epoch: this.epoch,
};
if (method !== "undelegate") {
  txData.to = toBuffer(addre);
}
const tx = proto.encodeProtoTransaction({
  data: txData,
});
        const serialized = bufferToHex(tx);
        // console.log("serialized", serialized);
        const page_url = location.protocol + "//" + location.host + location.pathname;
        const callback_url = encodeURIComponent(page_url);
        // console.log("callback", callback_url);
        const url = `https://app.idena.io/dna/raw?tx=${serialized}
        &callback_url=${callback_url}?method=${method}`;
        popup.location = url;
      } catch (e) {
        popup.close();
        console.error(e);
      }
    },
  }
}
</script>

<style scoped>
#wrapper-delegation {
  width: 100vw;
  display: flex;
  align-items: center;  
  height: 93.2vh;
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
  height: 250px;
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

#clock {
  font-size: 3rem;
  font-weight: 200;
  color: #131313 ;
}

#countdowns {
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding-top:20px;
  padding-bottom:20px;
}

#validation {
  width: 80%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}

#titles{
  width: 80%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}

th {
  font-weight: 600;
}

button:disabled {
  background-color: #cccccc;
  color: #666666;
}

#prediction {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  justify-content: center;
  width: 800px;

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
  width: 80%;
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
  width: 60%;
  display: flex;
  flex-direction: column;
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
  min-width: 180px;
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

h3{
  margin-top: 0px;
  margin-bottom: 40px;
}

@media (max-width: 768px) {
#prediction{
  width: 100%;
  height: 320px;
}
#values {
  font-size: 2.4rem;
  font-weight: 600;
}
.inside-wrapper{
  width: 80%;
  font-size: 1.2rem;
  padding-bottom: 10vh;
}
h3{
  font-size: 1.8rem;
  margin-top: 0px;
  margin-bottom: 20px;
}
#calculation{
  width: 80%;
}
#total{
  font-size: 1.3rem;
}
#countdowns{
  width: 100%;
  font-size: 1.1rem;
}
#delegation{
  height: 150px;
}
#currentStatus {
  font-size: 1.2rem;
}
#clock{
  font-size: 1.7rem; 
}
#currentStatus {
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
}
}

.buttonText{
  display: flex;
  flex-direction: column;  
}

.loader {
    width: 24px;
    height: 24px;
    border: 3px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }
    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    } 
</style>
