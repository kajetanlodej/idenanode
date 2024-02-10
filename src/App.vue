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
      const token = "tk-" + crypto.getRandomValues(array).toString("hex");
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
  }
}
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
