
<template>
  <div id ="delegationwrapper">
    <div id ="countdown">
      <span id="clock">{{ countdown }}</span>
      <span>Until the next distribution of rewards</span>
    </div>
    <div id="delegation">
      <span>Delegate to idenanode.com pool:</span>
    <button>Delegate</button>
    <div id="delegationStatus">
    <span>Your Idena identity is currently</span> <span>delegated/ undelegated</span> <span>to idenanode.com</span>
  </div>
  </div>
    <div id="poolStats">
      <span>Identities delegated to idenanode.com pool: {{ delegatorsCount }}</span>
      <span>Total stake delegated to idenanode.com pool: {{ totalStake }} iDNA</span>
    </div>
    <div id="aboutDelegation">
      <span>See <a target="_blank" href="https://www.idena.io/pl/faq#faq-delegation-1">official FAQ</a> on idena.io to learn more about delegation.</span>
      <span>Be aware that pool owner has the ability to terminate delegated identity and pocket its stake.</span>
      <span>Delegate your identity only to a trusted pool.</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      countdown: "",
    };
  },
  mounted() {
    this.startCountdown();
    this.getPoolStats();
  },
  methods: {
    startCountdown() {
      const countdownInterval = setInterval(() => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0); // 8:00 AM

        // Convert to CET timezone
        const cetOffset = -1; // CET is UTC+1
        const cetTomorrow = new Date(tomorrow.getTime() + cetOffset * 60 * 60 * 1000);

        let timeInSeconds = Math.floor((cetTomorrow - now) / 1000);

        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        this.countdown = `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;

        if (timeInSeconds <= 0) {
          clearInterval(countdownInterval);
          this.countdown = "00:00:00";
        }
      }, 1000);
    },
    formatTime(time) {
      return time.toString().padStart(2, "0");
    },
    getPoolStats() {
        const apiUrl = 'https://api.idena.io/api/Pool/0x4FF1F5764d4a5845E30d208717432C1d4Cac3399';
        axios.get(apiUrl)
          .then(response => {
            if (response && response.data && response.data.result) {
              this.delegatorsCount = response.data.result.size;
              this.totalStake = Math.floor(response.data.result.totalStake);
            }
            console.log('Delegators count:', this.delegatorsCount);
          })
          .catch(error => {
            console.error('Error fetching delegators count:', error);
          });
      },
  },
};
</script>      

<style>
/* h2,h1{
  color:white;
} */

span{
  color:white;

}

#delegationwrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  flex-direction: column;
  font-family: 'Lexend Exa', sans-serif;
  color: white;
}
#delegation{
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 2rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;

}

#countdown{
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 2rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
}
#poolStats
{
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 2rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
}
#clock{
  font-size: 3rem;
  font-weight: 600;
  color: white;
}

#delegationStatus{
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.2rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
}
#aboutDelegation{
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 600;
  color: white;
}
</style>