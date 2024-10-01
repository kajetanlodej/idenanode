<template>
<div id ="aboutwrapper">
    <div class="section" id="first-section">
    <h1>Services</h1>
    <span>
Idenanode.com offers two main services: shared node access, connecting users to the Idena blockchain without the need to manage their own node, and mining node delegation, enabling users to delegate their identity for participation in network security. Shared node access can be purchased through the official shared node marketplace built into the Idena web app.</span>
</div>
    <div class="section">
    <h1>Rewards distribution</h1>
    <span>Mining rewards are distributed every 24 hours at exactly 6 AM UTC. Validation rewards are distributed 15 minutes after the end of each validation.</span>
    </div>
    <div class="section">
    <h1>Fees</h1>
    <span>
The distribution of mining rewards follows a 90/10 split, with 90% allocated to the delegatee and 10% to the pool owner. Additionally, all other rewards (validation, invite, extra flip) go directly to the user, with no fees applied.</span>
    </div>
    <div class="section" style="margin-bottom: 0px;">
    <h1>Disclaimer</h1>
    <span>
No keys are transferred to the pool, but the owner can manage delegated identities, including terminating them and risking your stake. Delegate only to trusted pools. You can change your delegation in the next epoch.</span>
    </div>
</div>
</template>

<style scoped>
#aboutwrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 93.2vh;
    width: 100vw;
    flex-direction: column;
    font-family: 'Lexend Exa', sans-serif;
}

a {
  color: #0866ff;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #0056b3; 
}

a:active {
  color: #011531; /* Change the link color when it's active */
}

.section{
    width: 800px;
    padding: 20px;
    border-radius: 10px;
    background-color: var(--white);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

h1{
    margin-bottom: 10px;
    margin-top: 0px;
    font-size: 2.5rem
}

@media (max-width: 768px) {
#aboutwrapper{
  padding-bottom: 10vh;
}
.section{
  width: 80%;
  font-size: 1.2rem;
  padding: 15px;
  overflow-y: scroll;
  max-height: 140px;
}
h1{
  font-size: 1.7rem;
  margin-bottom: 5px;
  margin-top:0px;
}
}

</style>