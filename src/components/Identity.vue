<template>
    <div class="" id="signin">
      <div v-if="!signedIn" class="identity">
        <div class="avatar-wrapper">
          <img src="../assets/signedOut.png" class="avatar rounded" />
        </div>
        <button
        style="display: flex; flex-direction: column; align-items: center;"
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

        <button id="button-signout"
 style="display: flex; flex-direction: column; align-items: center;" class="button" type="button" @click.stop="$emit('signOut')">
                  <span class="nav-text button-text" >LOG OUT</span>
                  <!-- SVG Icon for LOG OUT -->
        <svg
          class="signin-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
  <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
        </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Identity",
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

  <style>
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
    border-radius: 50%;
    background-color: #f0f2f5;
  }
  
.signin-icon {
  display: none;
  width: 16px;
  height: 16px;
  transform: scale(1.5);
}

@media (min-width: 769px) {
  #button-signin {
    width: 150px;
  }
  #button-signout{
    width: 150px;
  }
}

@media (max-width: 768px) {
  .button-text{
    display: none;
  }
  .signin-icon{
    display: inline-block;
    margin-right: 4px;
  }
}
  </style>
  