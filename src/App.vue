<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Identity from "./components/Identity.vue";
import { Conn } from "./connection.js";
import {
  // ART_GENERATORS,
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
  intToBuffer,
} from "ethereumjs-util";
import { Buffer } from "buffer";
import { BN } from "bn.js";
import * as proto from "./proto/models_pb.js";
import axios from 'axios'
import Globe from 'globe.gl';

</script>



<template>
  <div id="wrapper">
  <header >
  <!-- <button @click="sendDelegateTx">Sign Out</button> -->
      <nav>
        <RouterLink to="/">STATUS</RouterLink>
        <RouterLink to ="/delegation">DELEGATION</RouterLink>
        
        <RouterLink to ="/about">ABOUT</RouterLink>
      </nav>
      <Identity :identity="identity" @signOut="signOut" @signIn="signIn" />

  </header>
  <RouterView/>
  
</div>

  <!-- <div id="wrapper">
    <div id="footer">
      <div id ="navigation">
      <nav id = "nav">
        <button class="btn btn-info" @click="$router.push('/')">HOME</button>
        <button class="btn btn-info" @click="$router.push('delegation')">DELEGATION</button>
      </nav>
    </div>
    <Identity :identity="identity" @signOut="signOut" @signIn="signIn" />
    </div>
    <div id = "router">
      <router-view></router-view>
    </div>  
  </div> -->
</template>




<!-- <template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template> -->
<script>
import { mapActions } from 'vuex';
// import { update } from 'cypress/types/lodash';

export default {
  name: "App",

  components: {
    Identity,
    // iNFT,
    // BCollapse,
    // BIconChevronDown,
    // BIconChevronUp,
  },
  data: function () {
    const conn = new Conn(this.connected, NODE_URL, NODE_KEY);
    const address = null;
    // const address = "0x00000000c911117a28a5f3e87c37d4c914c9b80a";
    // localStorage.address = address;
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
      //window.location.href = url;
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
    },
    sendGenerateTx: async function () {
      const args = [
        {
          index: 0,
          format: "hex",
          value: ART_GENERATORS[this.selectedGenerator].toString(),
        },
      ];
      await this.buildTx("generate", args);
    },
    sendRegenerateTx: async function (args) {
      const argsArray = [
        {
          index: 0,
          format: "hex",
          value: args.tokenId,
        },
        {
          index: 1,
          format: "hex",
          value: ART_GENERATORS[this.selectedGenerator].toString(),
        },
      ];
      await this.buildTx("regenerate", argsArray);
    },
    sendTransferTx: async function (args) {
      const argsArray = [
        {
          index: 0,
          format: "hex",
          value: this.address,
        },
        {
          index: 1,
          format: "hex",
          value: args.to,
        },
        {
          index: 2,
          format: "hex",
          value: args.tokenId,
        },
      ];
      await this.buildTx("transferFrom", argsArray);
    },
    sendBurnTx: async function (args) {
      const argsArray = [
        {
          index: 0,
          format: "hex",
          value: args.tokenId,
        },
      ];
      await this.buildTx("burn", argsArray);
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
        // const nonce = this.addressNonce + 1;
        // console.log("nonce", nonce);
        const maxFeeInt = 1e18;
        console.log("maxFeeInt", maxFeeInt);
        const maxFee = new BN(maxFeeInt.toString());
        // const payload = proto.encodeProtoCallContractAttachment({
        //   method,
        //   args: argsToSlice(args),
        // });
        // console.log(payload);
        // console.log(bufferToHex(payload));
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
            // payload: payload,
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

    waitForReceipt: async function (hash) {
      this.waitingForReceipt = hash;
      while (true) {
        try {
          const receipt = await this.conn.getTxReceipt(hash);
          if (receipt) {
            this.waitingForReceipt = null;
            return receipt;
          }
        } catch (e) {
          console.error(e);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    },
    ...mapActions(['updateStake', 'updateDelegatee','updateLoggedAddress','updateMiningReward','updateStakingReward','updateExtraFlipReward','updateInvitationReward','updateApy','updateMiningDistributionCountdown','updateStakingDistributionCountdown']),
    initAddress: async function () {
      console.log("initAddress");
      if (this.address) {
        console.log("address", this.address);
        this.identity = await this.conn.getIdentity(this.address);
        this.updateLoggedAddress(this.address);
        console.log(this.loggedAddress,"LOGGGGGGEDADDD");
        // localStorage.delegatee = this.identity.delegatee;
        // console.log("identitySTORAGEDELEGATEE", localStorage.delegatee);
        this.updateDelegatee(this.identity.delegatee);
        
        this.stake = Number.parseFloat(this.identity.stake).toFixed(2);
        console.log("stakes", this.stake);
        this.updateStake(this.stake);
        console.log("calling getData");
        this.getData();

        // this.updateMiningReward(this.calcMiningReward(this.stake));
        // console.log("callingcalcMiningReward", this.calcMiningReward(this.stake));
        // this.updateStakingReward(this.calcStakingReward(this.stake));
        // this.updateExtraFlipReward(this.calcExtraFlipReward(this.stake));
        // this.updateInvitationReward(this.calcInvitationReward(this.stake));
        // this.updateApy((
        //     (
        //       (
        //         this.calcMiningReward(this.stake) +
        //         this.calcStakingReward(this.stake) +
        //         this.calcExtraFlipReward(this.stake) +
        //         this.calcInvitationReward(this.stake)
        //       ) * 100 / this.stake
        //     ) * 366
        //   ) / this.epochTime.epochDuration);
        //   console.log("apy z komponentu App.vue", ((
        //     (
        //       (
        //         this.stakingReward +
        //         this.miningReward +
        //         this.extraFlipReward +
        //         this.invitationReward
        //       ) * 100 / this.stake
        //     ) * 366
        //   ) / this.epochTime.epochDuration));
        // console.log("apy z komponentu App.vue", this.apy);
        // this.identity.state = "Human";
        // this.identity.address = this.address;
        this.inft.balance = await this.conn.getTokenBalance(this.address);
        this.inft.minted = await this.conn.getMintedBy(this.address);
        this.epoch = (await this.conn.getEpoch()).epoch;
        // this.epoch = 0;
        if (this.inft.balance > 0) {
          this.inft.tokensOwned = await this.conn.getTokensOwnedBy(
            this.address,
            this.inft.balance
          );
          await this.fetchTokenUris(this.inft.tokensOwned);
        } else {
          this.inft.tokensOwned = [];
        }
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
        // console.log("countdown1 z metody startValidationCouuntdown", this.countdown1); //sprawdzic to czy sie wywoluje w kosnoli
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
    
    fetchTokenUris: async function (tokenIds, force = false) {
      for (const tokenId of tokenIds) {
        let tokenUri = await this.getFromCache("tokenUris", tokenId);
        let tokenPng = await this.getFromCache("tokenPngs", tokenId);

        if (
          tokenUri == null ||
          tokenPng == null ||
          tokenUri == "null" ||
          force
        ) {
          console.warn("uncached tokenUri", tokenId, tokenUri);
          tokenUri = await this.conn.getTokenURI(tokenId);
          tokenPng = await rasterize(tokenUri);
          await this.storeInCache("tokenUris", tokenId, tokenUri);
          await this.storeInCache("tokenPngs", tokenId, tokenPng);
        }
        this.$set(this.inft.tokenPngs, tokenId, tokenPng);
        this.$set(this.inft.tokenUris, tokenId, tokenUri);
      }
    },
    fetchRecentlyMinted: async function (amount = 5) {
      let supply = await this.conn.readCall("totalSupply");
      console.log("supply", supply, "amount", amount);
      const buf = Buffer.from(supply.slice(2), "hex").reverse();
      supply = parseInt(buf.toString("hex"), 16);
      console.log("supplyNum", supply);
      let lastRecentId =
        this.inft.recentlyMinted[this.inft.recentlyMinted.length - 1] ||
        supply + 1;
      console.log("lastRecentId", lastRecentId);
      for (let i = 0; i < amount; i++) {
        const tokenId = lastRecentId - 1;
        if (tokenId <= 0) {
          break;
        }
        const tokenIdHex = this.tokenIdToHex(tokenId);
        console.log("tokenId", tokenId, tokenIdHex);
        // TODO: Check for burn
        await this.fetchTokenUris([tokenIdHex]);
        this.inft.recentlyMinted.push(tokenId);
        lastRecentId = tokenId;
      }
    },
    openTokenOwner: async function (tokenId) {
      var popup = window.open("", "_blank");
      const owner = await this.conn.getTokenOwner(tokenId);
      popup.location = `https://scan.idena.io/identity/${owner}`;
    },
    setGenerator(name) {
      this.selectedGenerator = name;
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

//   async fetchGeoJsonData() {
//   fetch('/src/assets/simplifiedmap.geojson')
//         .then(res => res.json())
//         .then(countries => {
//           this.updateGeoJsonData(countries.features);
//           // console.log(countries.features, "country features")
//         })
//         .catch(error => {
//           console.error('Error fetching map data:', error);
//         });
// },
  
    refreshURI: async function (tokenId) {
      await this.fetchTokenUris([tokenId], true);
    },
    tokenIdToHex(tokenId) {
      if (typeof tokenId !== "number") {
        return null;
        // tokenId = parseInt(tokenId, 16);
      }
      return (
        "0x" + intToBuffer(tokenId).reverse().toString("hex").padEnd(16, "0")
      );
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
    //this.loadMapData();
    this.fetchValidationTime();
    console.log("fetching geojson data");
    // this.fetchGeoJsonData();
    // this.startCountdown();

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
  computed: {
    canMint: function () {
      if (!this.address) {
        return false;
      }
      if (STATES_CAN_MINT.indexOf(this.identity.state) == -1) {
        return false;
      }
      if (this.inft.minted == null || this.inft.minted != ZERO_TOKEN) {
        return false;
      }
      return true;
    },
    waitingForReceiptLink() {
      return `https://scan.idena.io/transaction/${this.waitingForReceipt}`;
    },
    waitingForReceiptShortHash() {
      // leave only first 4 and last 4 chars
      const shortHash =
        this.waitingForReceipt.slice(0, 6) +
        ".." +
        this.waitingForReceipt.slice(-4);
      return shortHash;
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
  width: 65vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;

}

nav{
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  
}

nav a {
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
/* body{
  display: flex;
  flex-direction: column;
} */
 /* header {
  line-height: 1.5;
  height:10vh;
} */
/*
.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
