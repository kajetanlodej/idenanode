<template>
    <div class="" id="signin">
      <div v-if="!signedIn" class="identity">
        <div class="avatar-wrapper">
          <img src="../assets/signedOut.png" class="avatar rounded" />
        </div>
        <button
          style="width: 25%"
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
          <!-- <div id="id-state">
            {{ identity.state }}
            <br />
            <div class="address text-truncate">
              {{ identity.address }}
            </div>
          </div> -->
        </div>
        <button style="width: 25%" class="btn btn-outline-danger" @click.stop="$emit('signOut')">
          SIGN OUT
          <!-- <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg> -->
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

  .text-truncate{
    color:white;
  }
  
  /* #id-state{
    color:white;
  } */
  
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
  