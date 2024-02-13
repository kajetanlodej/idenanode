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

</script>



<template>
  <div id="wrapper">
  <header>
      <nav>
        <RouterLink to="/">HOME</RouterLink>
        <RouterLink to ="/delegation">DELEGATION</RouterLink>
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
    buildTx: async function (method, args) {
      var popup = window.open("", "_blank");
      this.generating = true;
      console.log(method, args);
      try {
        const balance = await this.conn.getBalance(this.address);
        const nonce = balance.nonce + 1;
        // const nonce = 1;
        console.log(nonce, this.epoch);
        const payload = proto.encodeProtoCallContractAttachment({
          method,
          args: argsToSlice(args),
        });
        console.log(payload);
        console.log(bufferToHex(payload));
        const maxFee = new BN("10000000000000000000");
        const maxFeeBytes = toBuffer(maxFee);

        const tx = proto.encodeProtoTransaction({
          data: {
            type: 16,
            to: INFT_CONTRACT.buf,
            maxFee: maxFeeBytes,
            nonce: nonce,
            epoch: this.epoch,
            payload: payload,
          },
        });
        const serialized = bufferToHex(tx);
        console.log("serialized", serialized);
        const url = `https://app.idena.io/dna/raw?tx=${serialized}
        &callback_url=${CALLBACK_URL}${method}`;
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
    initAddress: async function () {
      console.log("initAddress");
      if (this.address) {
        console.log("address", this.address);
        this.identity = await this.conn.getIdentity(this.address);
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
    this.fetchRecentlyMinted();
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

header{
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
