<template>
    <div class="" id="signin">
      <div v-if="!signedIn" class="identity">
        <div class="avatar-wrapper">
          <img src="../assets/signedOut.png" class="avatar rounded" />
        </div>
        <button
        style="display: flex; flex-direction: column; align-items: center;  "
        id="button-signin"
        class="button"
        type="button"
        v-on:click="$emit('signIn')"
      >
        <span class="mainButton nav-text button-text" >SIGN IN</span>
        <span class="subButton nav-text button-text">WITH IDENA</span>
        <!-- SVG Icon for SIGN IN -->
        <svg
          class="signin-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
          />
          <path
            fill-rule="evenodd"
            d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
          />
        </svg>
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
        <button  style="width: 150px;" class="button" type="button" @click.stop="$emit('signOut')">
          LOG OUT
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
    width: 50vw;
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
    justify-content: right;
    padding-right: 1.5rem;
  }
  
  .avatar-wrapper {
    height: 40px;
    width: 40px;
    margin-right: 1.5rem;
    
  }
  
  .avatar {
    height: 100%;
    width: 100%;
    /* box-shadow: #09223b 0px 0px 1px 0px; */
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
  border-radius: 7px;

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
 .subButton {
  font-size: 10px;

   margin-top: -2px;
}
  
.mainButton {
margin-bottom: -2px;
margin-top: 2px;
}
.signin-icon {
  display: none;
  width: 16px; /* Original size */
  height: 16px; /* Original size */
  transform: scale(1.5); /* 2x scale */
}
@media (min-width: 769px) {
#button-signin {
  width: 150px;
}
}
@media (max-width: 768px) {
  /* Adjust size for mobile view */
    .button-text{
    display: none;
  }
    .signin-icon{
    display: inline-block;
    margin-right: 4px;
  }

}


  </style>
  