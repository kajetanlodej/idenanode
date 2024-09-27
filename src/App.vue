<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Identity from "./components/Identity.vue";
import { Conn } from "./connection.js";
import {
  CALLBACK_URL,
  NODE_URL,
  NODE_KEY,
  AUTH_WORKER_URL,
} from "./config.js";
import {
  bufferToHex,
  ecrecover,
  toBuffer,
  fromRpcSig,
  keccak256,
  pubToAddress,
  isValidAddress,
} from "ethereumjs-util";
import { Buffer } from "buffer";
import { BN } from "bn.js";
import * as proto from "./proto/models_pb.js";
import axios from 'axios'
</script>

<template>
  <div id="wrapper">
  <header >
      <nav>
        <RouterLink to="/" style="transition: none; 
        -webkit-transform: scale(1) ;
     -moz-transform: scale(1);
       -o-transform: scale(1);
      -ms-transform: scale(1);
          transform: scale(1) ;">
          <img src="./assets/logo.png" class="logo" />
        </RouterLink>
        <RouterLink to="/">
          <span class="nav-text status-text">STATUS</span>
        </RouterLink>
        
        <RouterLink to="/delegation">
          <span class="nav-text delegation-text">DELEGATION</span>
          <svg class="nav-icon delegation-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            viewBox="0 0 16 16">
            <path
              d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708L13 11.707V14.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
            <path
              d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z" />
          </svg>
        </RouterLink>
        
        <RouterLink to="/about">
          <span class="nav-text about-text">ABOUT</span>
          <svg class="nav-icon about-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
          </svg>
        </RouterLink>


      </nav>
      
      <Identity :identity="identity" @signOut="signOut" @signIn="signIn" />
      <div id = "media" class="media">
        <a href="https://github.com/kajetanlodej/idenanode" target="_blank">
    <i class="fa fa-github"></i>
</a>
        <i class="fa fa-telegram" ></i>
      </div>
  </header>
  <RouterView/>
</div>
</template>
<script>
import { mapActions } from 'vuex';
import texture from '/src/assets/pobrane-jasne.png';

// import { update } from 'cypress/types/lodash';

export default {
  name: "App",

  components: {
    Identity,
  },
  data: function () {
    const conn = new Conn(this.connected, NODE_URL, NODE_KEY);
    const address = null;
    return {
      conn,
      address,
      identity: { state: "Undefined", address: address },
      epoch: 0,
      generating: false,
      inft: {
        balance: 0,
        minted: "",
        tokensOwned: [],
        tokenUris: {},
        tokenPngs: {},
        recentlyMinted: [],
      },
      STAKING_POWER: 0.9,
      waitingForReceipt: null,
    };
  },
  methods: {
    signIn: function () {
      this.signOut();
      //crypto strong random values (10)
      const array = new Uint32Array(1);
      const token = "tkn-" + crypto.getRandomValues(array).toString("hex");
      const url = `https://app.idena.io/dna/signin
?callback_url=${CALLBACK_URL}signin?token=${token}
&token=${token}
&callback_target=_self
&nonce_endpoint=${AUTH_WORKER_URL}%2FgetToken
&authentication_endpoint=${AUTH_WORKER_URL}%2Fauthenticate`;
      const windowFeatures = "left=100,top=100,width=400,height=700";
      var popup = window.open("", "_blank",windowFeatures);
      popup.location = url;
    },

    fetchSignature: async function (token) {
      window.document.body.style.visibility = "hidden";
      const response = await fetch(
        "https://auth.idenanode.com/getSignature",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );
      const data = await response.json();
      window.close();
      console.log("data", data);
      return data.signature;
    },
    recoverAddress: function (signature) {
      const nonce = "signin-uwu";
      const nonceHash = keccak256(keccak256(Buffer.from(nonce, "utf-8")));
      const { v, r, s } = fromRpcSig(signature);
      const pubKey = ecrecover(nonceHash, v, r, s);
      const addrBuf = pubToAddress(pubKey);
      const addr = bufferToHex(addrBuf);
      return addr;
    },
    signOut: function () {
      history.pushState("", document.title, "/");
      this.address = null;
      this.identity = { state: "Undefined", address: null };
      this.inft.balance = 0;
      this.inft.minted = null;
      this.inft.tokensOwned = [];
      localStorage.removeItem("address");
      this.delegatee = null;
      this.updateStake(0);
      this.updateDelegatee(null);
      this.updateLoggedAddress(null);
      this.updateMiningReward(0);
      this.updateApy(0);
      this.updateStakingReward(0);
      this.updateExtraFlipReward(0);
      this.updateInvitationReward(0);
      this.updateDelegateeCheck(false);
    },
    sendDelegateTx: async function () {
    const argsArray = [
      {
        index: 0,
        format: "hex",
        value: this.address, // Assuming the sender's address needs to be included
      },
    ];
    await this.buildTx("delegate", argsArray, 0x12);
},
    sendUnDelegateTx: async function () {
        const argsArray = [
          {
            index: 0,
            format: "hex",
            value: this.address, // Assuming the sender's address needs to be included
          },
        ];
        await this.buildTx("delegate", argsArray, 0x13);
    },
  buildTx: async function (method, args, TxType, amountInt = 0) {
      var popup = window.open("", "_blank");
      this.generating = true;
      console.log(method, args);
      try {
        const maxFeeInt = 1e18;
        console.log("maxFeeInt", maxFeeInt);
        const maxFee = new BN(maxFeeInt.toString());
        const amount = new BN(`${amountInt}000000000000000000`);
        const amountBytes = toBuffer(amount);
        const maxFeeBytes = toBuffer(maxFee);
        console.log("amount", amount.toString(), amountBytes);
        console.log("maxFee", maxFee.toString(), maxFeeBytes);
        const addre = "0x71eecdf6414eda0be975c2b748a74ca5018460e4";
        this.epoch = (await this.conn.getEpoch()).epoch;
        this.nonce = (await this.conn.getBalance(this.address)).nonce + 1;
        console.log("nonce", this.nonce);
        console.log("lolz",this.epoch);
        const tx = proto.encodeProtoTransaction({
          data: {
            type: TxType,
            to: toBuffer(addre),
            amount: amountBytes,
            maxFee: maxFeeBytes,
            nonce: this.nonce,
            epoch: this.epoch,
          },
        });
        const serialized = bufferToHex(tx);
        console.log("serialized", serialized);
        const page_url =
          location.protocol + "//" + location.host + location.pathname;
        const callback_url = encodeURIComponent(page_url);
        console.log("callback", callback_url);
        const url = `https://app.idena.io/dna/raw?tx=${serialized}
        &callback_url=${callback_url}?method=${method}`;
        popup.location = url;
      } catch (e) {
        popup.close();
        console.error(e);
      }
      this.generating = false;
    },
    ...mapActions(['updateStake', 'updateDelegatee','updateLoggedAddress','updateMiningReward','updateStakingReward','updateExtraFlipReward','updateInvitationReward','updateApy','updateMiningDistributionCountdown','updateStakingDistributionCountdown','updateDelegateeCheck','updateGlobeInicialized']),
    initAddress: async function () {
      console.log("initAddress");
      if (this.address) {
        console.log("address", this.address);
        this.identity = await this.conn.getIdentity(this.address);
        this.updateLoggedAddress(this.address);
        console.log(this.loggedAddress,"LOGGGGGGEDADDD");
        this.updateDelegatee(null); //Fix the empty delegatee
        this.updateDelegatee(await this.identity.delegatee);
        console.log("delegateeeeeeeeeeeeeeeeeeeeeeeee",await this.identity.delegatee);
        this.stake = Number.parseFloat(this.identity.stake).toFixed(2);
        console.log("stakes", this.stake);
        this.updateStake(this.stake);
        console.log("calling getData");
        this.getData();
        this.epoch = (await this.conn.getEpoch()).epoch;
      }
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
        this.updateStakingDistributionCountdown(this.countdown1);
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
        this.updateMiningDistributionCountdown(this.countdown);

        if (timeInSeconds <= 0) {
          clearInterval(this.countdownInterval);
          this.countdown = '00:00:00';
          this.updateMiningDistributionCountdown(this.countdown); //potrzebne to tutaj?
          this.startCountdown(); // Restart the countdown for the next day
        }
      }, 1000);
      console.log("countdown prosto z metodu startCountdown", this.countdown);
      this.updateMiningDistributionCountdown(this.countdown);
    },
    formatTime(time) {
      return time.toString().padStart(2, '0')
    },

    async getData() {
      console.log("CALLING GETDATA FROM APP.VUE")
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
        console.log("results epochtime from app.data",this.epochTime.epochDuration, this.epochTime.epochLeftPercent, this.epochTime.epochLeft, this.epochTime.epochLeftUnit);
        this.updateMiningReward(this.calcMiningReward(this.stake));
        console.log("callingcalcMiningReward", this.calcMiningReward(this.stake));
        this.updateStakingReward(this.calcStakingReward(this.stake));
        this.updateExtraFlipReward(this.calcExtraFlipReward(this.stake));
        this.updateInvitationReward(this.calcInvitationReward(this.stake));
        this.updateApy((
            (
              (
                this.calcMiningReward(this.stake) +
                this.calcStakingReward(this.stake) +
                this.calcExtraFlipReward(this.stake) +
                this.calcInvitationReward(this.stake)
              ) * 100 / this.stake
            ) * 366
          ) / this.epochTime.epochDuration);



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
    console.log("calling calcMiningReward");
    return this.calculateEstimatedMiningReward(myStakeWeight, this.averageMinerWeight, this.onlineSize, this.epochTime.epochDuration);
  },

    onStorageUpdate(event) {
      if (event.key === "address") {
        console.log("storage update", event.newValue);
        this.address = event.newValue;
      }
    },
    getFromCache: async function (store, key) {
      try {
        return await (await dbPromise).get(store, key);
      } catch (e) {
        console.error("Error while getting from cache:", e);
        return null;
      }
    },
    storeInCache: async function (store, key, value) {
      try {
        await (await dbPromise).put(store, value, key);
      } catch (e) {
        console.error("Error while storing in cache:", e);
      }
    },
  },
  mounted() {
    this.fetchValidationTime();
    console.log("starting mining countdown");
    this.startCountdown();
    console.log(this.countdown);
    if (localStorage.address != null) {
      console.log("address in storage", localStorage.address);
      if (isValidAddress(localStorage.address) == false) {
        console.warn("Invalid address in storage!");
        this.signOut();
        return;
      }
      this.address = localStorage.address;
    }
    window.addEventListener("storage", this.onStorageUpdate);
    // this.fetchRecentlyMinted();
  },
  beforeDestroy() {
    window.removeEventListener("storage", this.onStorageUpdate);
  },
  watch: {
    address(newAddress) {
      console.log("watch newAddress", newAddress);
      if (isValidAddress(newAddress) == false) {
        console.warn("Invalid address!");
        this.signOut();
        return;
      }
      localStorage.address = newAddress;
      this.initAddress();
    },
  },
 
  created: async function () {
    const url = new URLSearchParams(window.location.search);
    const path = location.pathname.slice(1);
    if (path == "signin") {
      const token = url.get("token");
      console.log("sign in", token);
      if (!token) {
        console.error("No token");
        return;
      }
      const signature = await this.fetchSignature(token);
      localStorage.address = this.recoverAddress(signature);
      this.address = localStorage.address;
      history.pushState("", document.title, "/");
    } else if (path == "reset" || path == "resetAll") {
      localStorage.clear();
      this.signOut();
      if (path == "resetAll") {
        await (await dbPromise).clear("tokenUris");
        await (await dbPromise).clear("tokenPngs");
      }
      history.pushState("", document.title, "/");
    } else if (path) {
      console.log("got path", path);
      const txHash = url.get("tx");
      if (!txHash) {
        console.error("No TX hash");
        return;
      }
      const receipt = await this.waitForReceipt(txHash);
      history.pushState("", document.title, "/");
      if (receipt.success == false) {
        console.error("TX failed", receipt);
        return;
      }
      if (path == "generate" || path == "regenerate") {
        let tokenId = null;
        for (const event of receipt.events) {
          if (event.event == "GeneratedArt") {
            tokenId = event.args[1];
            console.log("generated", tokenId);
          } else if (
            event.event == "Transfer" &&
            event.args[1] == this.address
          ) {
            tokenId = event.args[2];
            this.inft.tokensOwned.push(tokenId);
            console.log("transferred", tokenId);
            break;
          }
        }
        if (tokenId == null || tokenId == ZERO_TOKEN) {
          console.error("Failed to get tokenId", tokenId);
          return;
        }
        await this.fetchTokenUris([tokenId], true);
        this.inft.balance = await this.conn.getTokenBalance(this.address);
        this.inft.minted = await this.conn.getMintedBy(this.address);
      } else if (path == "transferFrom" || path == "burn") {
        if (receipt.success) {
          this.inft.balance -= 1;
          const transferArgs = receipt.events[0].args;
          if (transferArgs[1] != this.address.toString()) {
            this.inft.tokensOwned = this.inft.tokensOwned.filter(
              (token) => token != transferArgs[2]
            );
          }
        }
      }
    }
  },
  destroyed: function () {
    console.log("destroyed");
    this.conn.stop();
  },
};
</script>

<style scoped> /*TODO: SCOPED?*/

#wrapper{
  width: 100vw;
  height: 100vh - 65px;
  display: flex;
  flex-direction: column;
}

header {
  width: 100%;
  height: 65px;
  display: flex;
  flex-direction: row;
  background-color: white;
/* border-bottom: solid red 1px; */
box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
}

nav{
  width: 50%;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 200px
  
}

nav a {
  margin-right: 15px;
  transition: transform 0.15s linear;
  backface-visibility: hidden;
  -webkit-font-smoothing: subpixel-antialiased;
  will-change: transform;  
  text-decoration: none;
}
nav a:hover {
  color: #0866ff;

}
nav a.router-link-exact-active {
  color: #0866ff;
  -webkit-transform: scale(1.1) translate3d( 0, 0, 0) perspective(1px);
     -moz-transform: scale(1.1) translate3d( 0, 0, 0) perspective(1px);
       -o-transform: scale(1.1) translate3d( 0, 0, 0) perspective(1px);
      -ms-transform: scale(1.1) translate3d( 0, 0, 0) perspective(1px);
          transform: scale(1.1) translate3d( 0, 0, 0) perspective(1px);
}

.logo{
  width: 40px;
  height: 40px;
  transition:none;
  margin-right: 30px;
}

.status-icon {
  display: none;
  width: 16px; /* Original size */
  height: 16px; /* Original size */
  transform: scale(1.5); /* 2x scale */
}
.delegation-icon {
  display: none;
  width: 16px; /* Original size */
  height: 16px; /* Original size */
  transform: scale(1.5); /* 2x scale */
}
.about-icon {
  display: none;
  width: 16px; /* Original size */
  height: 16px; /* Original size */
  transform: scale(1.5); /* 2x scale */
}

.status-text {
  display: inline-block;
}
.delegation-text {
  display: inline-block;
}
.status-text {
  display: inline-block;
}

#media{
display: flex; flex-direction: row; height: 100%; align-items: center; justify-content: center; margin-top: 0px; margin-right: 15px; 
}

@media (max-width: 768px) {
  .status-text{
    display: none;
  }
  .delegation-text{
    display: none;
  }
  .about-text{
    display: none;
  }
  .logo{
    margin-right: 0px;
  }
  #media{
    flex-direction: column; padding-left: 12px; padding-right: 12px;
  }
  nav{
    padding-left:15px;
  }

  .identity{
    margin-right: 0px;
    padding-right: 0px;
  }
  .fa-github{
    margin-right: 0rem;
  }
  .status-icon{
    display: inline-block;
    margin-right: 20px;
    margin-left: 0px;
  }
  .delegation-icon{
    display: inline-block;
    margin-right: 20px;
    margin-top: 5px;
  }
  .about-icon{
    display: inline-block;
    margin-right: 20px;
    margin-top: 5px;

  }
  i{
    margin-right: 0px;
  }

}

.menu-icon {
  display: none;
  font-size: 30px;
  cursor: pointer;
}
.fa-github{
  font-size:25px;color:#0866ff; height: 25px; width: 25px; margin-right: 0px; padding-left: 1px;
}

.fa-telegram
{
  margin-left:3px;font-size:21px;color:#0866ff;margin-right:3px;
}
</style>
