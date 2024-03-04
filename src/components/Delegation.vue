
<template>
  <div id="delegationwrapper">
    <div id="countdown">
      <span id="clock">{{ countdown }}</span>
    </div>
    <div id="validation">
      <span>Until the next distribution of mining rewards</span>
      <hr id="divider" />
      <span>Validation rewards are distributed right after the validation ends</span>
    </div>
    <div id="delegation">
      <span>Delegate to idenanode.com pool:</span>
      <button>DELEGATE</button>
      <div id="delegationStatus">
        <span>Your Idena identity is currently</span> <span>delegated / undelegated</span>
        <span>to idenanode.com</span>
      </div>
    </div>
  </div>

    <!-- <div id="stats">
  <div id="identityStats">
    <h2>Identity stats</h2>
      <span>Mining reward: {{ delegatorsCount }} iDNA</span>
      <span>Validation reward: {{ totalStake }} iDNA</span>
      <span>Extra flip premium: 100 iDNA </span>
      <span>Invitation reward: 100 iDNA</span>
      <span>Total rewards received: 200 iDNA </span>
      <span>Rewards last received on: 16.02.2024</span>
    </div>
    <div id="poolStats">
      <h2>Pool stats</h2>
      <span>Identities: {{ delegatorsCount }}</span>
      <span>Total stake: {{ totalStake }} iDNA</span>
    </div>
    <div id="aboutDelegation">
      <span>See <a target="_blank" href="https://www.idena.io/pl/faq#faq-delegation-1">official FAQ</a> on idena.io to learn more about delegation.</span>
      <span>Be aware that pool owner has the ability to terminate delegated identity and pocket its stake.</span>
      <span>Delegate your identity only to a trusted pool.</span>
    </div>
  </div> -->
  <div class="container">

  <ul class="nav nav-tabs">
    <li class="active"><a data-toggle="tab" href="#home">Pool's delegators</a></li>
    <li><a data-toggle="tab" href="#menu1">Payout history</a></li>
    <!-- <li><a data-toggle="tab" href="#menu2">Menu 2</a></li>
    <li><a data-toggle="tab" href="#menu3">Menu 3</a></li> -->
  </ul>

  <div class="tab-content" style="height: 40vh; overflow-y: auto;">
    <div id="home" class="tab-pane fade in active">
      <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>Address</th>
          <th>Stake, iDNA</th>
          <th>Status</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="delegator in delegators" :key="delegator.address" >
          <td>
            <div id = "user">
            <div class="user-pic">
              <img :src="delegator.address ? `https://robohash.idena.io/${delegator.address.toLowerCase()}` : ''" alt="pic" width="32" />            </div>
            <div class="text_block text_block--ellipsis">
              <router-link :to="`/address/${delegator.address}`">
                {{ delegator.address }}
              </router-link>
            </div>
          </div>
          </td>
          <td class="rowElement">{{ parseFloat(delegator.stake).toFixed(2) }}</td>
          <td class="rowElement">{{ delegator.state }}</td>
          <td class="rowElement">{{ delegator.age }}</td>
        </tr>
      </tbody>
    </table>
    <div class="text-center" v-if="canFetchMore">
      <button type="button" class="btn btn-small" @click="fetchMore">
        Show more
      </button>
    </div>
  </div>
    </div>
    <div id="menu1" class="tab-pane fade">
      <h3>Menu 1</h3>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </div>
    <!-- <div id="menu2" class="tab-pane fade">
      <h3>Menu 2</h3>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
    </div>
    <div id="menu3" class="tab-pane fade">
      <h3>Menu 3</h3>
      <p>Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    </div> -->
  </div>
</div>
</template>
<script>
import axios from 'axios'
import 'bootstrap';
export default {
  data() {
    return {
      countdown: '',
      delegators: [],
      canFetchMore: true,
      continuationToken: null,
    }
  },
  mounted() {
    this.startCountdown()
    this.fetchDelegators()
  },
  methods: {
    startCountdown() {
      const countdownInterval = setInterval(() => {
        const now = new Date()
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(8, 0, 0, 0) // 8:00 AM

        // Convert to CET timezone
        const cetOffset = -1 // CET is UTC+1
        const cetTomorrow = new Date(tomorrow.getTime() + cetOffset * 60 * 60 * 1000)

        let timeInSeconds = Math.floor((cetTomorrow - now) / 1000)

        const hours = Math.floor(timeInSeconds / 3600)
        const minutes = Math.floor((timeInSeconds % 3600) / 60)
        const seconds = timeInSeconds % 60

        this.countdown = `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`

        if (timeInSeconds <= 0) {
          clearInterval(countdownInterval)
          this.countdown = '00:00:00'
        }
      }, 1000)
    },
    formatTime(time) {
      return time.toString().padStart(2, '0')
    },
    getPoolStats() {
      const apiUrl = 'https://api.idena.io/api/Pool/0x4FF1F5764d4a5845E30d208717432C1d4Cac3399'
      axios
        .get(apiUrl)
        .then((response) => {
          if (response && response.data && response.data.result) {
            this.delegatorsCount = response.data.result.size
            this.totalStake = Math.floor(response.data.result.totalStake)
          }
          console.log('Delegators count:', this.delegatorsCount)
        })
        .catch((error) => {
          console.error('Error fetching delegators count:', error)
        })
    },
    tabClicked (selectedTab) {
      console.log('Current tab re-clicked:' + selectedTab.tab.name)
    },
    tabChanged (selectedTab) {
      console.log('Tab changed to:' + selectedTab.tab.name)
    },
    async fetchDelegators() {
  const response = await axios.get(`https://api.idena.io/api/Pool/0x17b851A11f7d37054928BEf47F0F22166d433917/Delegators`, {
    params: {
      limit: 30,
    },
  });

  this.delegators = response.data.result;
  console.log(response.data.result);
},
    fetchMore() {
      this.fetchDelegators();
    },
  }
}
</script>

<style scoped>
/* h2,h1{
  color:white;
} */

span {
  color: white;
}

#delegationwrapper {
  display: flex;
  justify-content: center;
  height: 40vh;
  flex-direction: column;
  font-family: 'Lexend Exa', sans-serif;
  color: white;
}

#delegation {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
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

#poolStats {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
}

#clock {
  font-size: 4rem;
  font-weight: 600;
  color: white;
}

#delegationStatus {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.2rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
}

#aboutDelegation {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
}

button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
}

#identityStats {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
  border-right: solid;
}

#poolStats {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
}

#stats {
  width: 100%;
  display: flex;
  flex-direction: row;
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
  justify-content: center;
}

#validation {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

#divider {
  width: 100%;
}
.container{
  width: 100%;
  height: 50vh;
  color: white;
}
#user{
  display: flex;
  align-items: center;
}
.rowElement{
  vertical-align: middle;
}
th{
  font-weight: 900;
}
</style>
