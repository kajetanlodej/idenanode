<template>
    <div class="" id="signin">
      <div v-if="!signedIn" class="identity">
        <div class="avatar-wrapper">
          <img src="../assets/signedOut.png" class="avatar rounded" />
        </div>
        <button
          style="width:25%;"
          class="button" 
          type="button"
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
        <button style="width:25%;" class="button" type="button" @click.stop="$emit('signOut')">
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
  
  <style >

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
    margin-right: 1rem;
    
  }
  
  .avatar {
    height: 100%;
    width: 100%;
    box-shadow: #09223b 0px 0px 3px 0px;
    border-radius: 50%;
    background-color: #f0f2f5;
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
  