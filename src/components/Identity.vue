<template>
    <div class="" id="signin">
      <div v-if="!signedIn" class="identity">
        <div class="avatar-wrapper">
          <img src="../assets/signedOut.png" class="avatar rounded" />
        </div>
        <button
          style="width: 20%"
          class="btn btn-success"
          v-on:click="$emit('signIn')"
        >
          SIGN IN
        </button>
      </div>
      <div v-else class="identity">
        <div class="avatar-wrapper">
          <img
            :src="'https://robohash.org/' + identity.address"
            class="avatar rounded"
          />
        </div>
        <div class="text-truncate">
          <div>
            {{ identity.state }}
            <br />
            <div class="address text-truncate">
              {{ identity.address }}
            </div>
          </div>
        </div>
        <button class="btn btn-outline-danger" @click.stop="$emit('signOut')">
          <!-- <b-icon-x /> --> 
        </button>
      </div>
    </div>
  </template>
  
  <script>
  // X icon bootstrap-vue not compatibile with vue 3
//   import { BIconX } from "bootstrap-vue";
  
  export default {
    name: "Identity",
    // components: {
    //   BIconX,
    // },
    props: {
      identity: Object,
    },
    data: () => {
      return {};
    },
    methods: {},
    computed: {
      signedIn() {
        return this.identity != null && this.identity.address != null;
      },
    },
  };
  </script>
  
  <style scoped>
  
  #signin{
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .identity {
    height: 6vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .avatar-wrapper {
    height: 50px;
    width: 50px;
    margin-right: 0.5rem;
    
  }
  
  .avatar {
    height: 100%;
    width: 100%;
    background-color: #010626;
    
  }
  
  .address {
    color: grey;
  }
  
  .conn-btn {
    height: 3rem;
  }
  
  .load-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
  
  
  </style>
  