<template>
<div id ="aboutwrapper">
    <div>
    <h1>Services</h1>
    <span>Offering two primary services, idenanode.com provides both shared node and mining node for delegation. The shared node service connects users to the Idena blockchain, enabling network participation without the need to manage a node individually. Meanwhile, the mining node for delegation service allows users to delegate their identity, ensuring active participation in securing the network.</span>
    <div id="access">Delegation and access to the shared node can both be managed through the official Idena web app, including the marketplace within the app for purchasing shared node access.</div>
    <div id="access">The source code for this web app can be viewed <a href="https://github.com/kajetanlodej/idenanode" target="_blank">here</a>.</div>

</div>
    <div>
    <h1>Rewards distribution</h1>
    <span>Mining rewards are distributed every 24 hours at exactly 6 AM UTC. Validation rewards are distributed 15 minutes after the end of each validation.</span>
    <div id="access">The source code for rewards distribution can be viewed <a href="https://github.com/kajetanlodej/poolSendingRewardsJS" target="_blank">here</a>.</div>
    </div>
    <div>
    <h1>Fees</h1>
    <span>The distribution of mining rewards follows a 92/8 split, with 92% allocated to the delegatee and 8% to the pool owner. Additionally, all validation rewards go directly to the user, with no fees applied. The pool owner does not receive any portion of the validation rewards, only 8% of the total mining rewards.</span>
    </div>
    <div>
    <h1>Disclaimer</h1>
    <span>No keys are transferred from the delegatees to the pool. Although please note that the pool owner has the authority to manage delegated identities, which includes the possibility of terminating your identity and resulting in the loss of your stake. Therefore, it's crucial to delegate to pool owners you trust. Should you wish to change your delegation, you can do so in the next epoch.</span>
    </div>
</div>
</template>

<style scoped>

#aboutwrapper{
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 90vh;
    flex-direction: column;
    font-family: 'Lexend Exa', sans-serif;
    padding-bottom: 50px;
}
#access{
    margin-top: 1rem;
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

</style>