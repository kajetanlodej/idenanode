<!-- Home.vue -->

<template>
  <div id="homewrapper">
    <div id="status-legend">
    <div class="status-example">
      <span class="dot" id="dot-online"></span>
      <span id="status-online">Online</span>
    </div>
    <div class="status-example">
      <span class="dot" id="dot-synchronizing"></span>
      <span id="status-synchronizing">Synchronizing</span>
    </div>
    <div class="status-example">
      <span class="dot" id="dot-offline"></span>
      <span id="status-offline">Offline</span>
    </div>
  </div>

  <div id="globeContainer">
    <div id="globeViz"></div>
  </div>
  <button class="button" type="button" @click="handleRefreshClick">REFRESH</button>
  <!-- <div class="outer-reload" id="outer-reload">
    <div id="outer-icon">
      <input id="reload" type="image" src="/content/refresh-white.png" alt="refresh-button">
    </div>
    <div id="status-text">
      <span id="labelToggle">NODE STATUS</span>
    </div>
  </div> -->


  <!-- <div id="sold-keys">
    <span id="number-sold-text">API keys sold:&nbsp;</span>
    <div id="numberOfKeys">
      <span id="totalSold"> {{ transactionCount }} in total</span>
      <span id="thisEpochSold">{{ thisEpochTransactionCount }} this epoch</span>  
    </div>
  </div> -->
</div>
  </template>
  
  <style>
@import url('https://fonts.googleapis.com/css2?family=Lexend+Exa:wght@400&display=swap');

:root {
    --background: #010626;
    --pane-padding: 5px 42px;
    --online: #00FF00;
    --synchronizing: #FF681E;
    --offline: #FF000D;
    --white: white;
}

html {
    overflow-y: hidden;
    overflow-x: hidden;
    width: 100vw;
    height: 100vh;
}
#homewrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
    flex-direction: column;
    font-family: 'Lexend Exa', sans-serif;
}

#status-legend {
    display: flex;
    overflow: hidden;
    width: 50vw;
    min-height: 11vh;
    justify-content: space-evenly;
    align-items: center;
    font-size: 1.6em;
}

.status-example {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.dot {
    height: 25px;
    width: 25px;
    border-radius: 50%;
    margin: 1.4vh;

}

#dot-online {
    background-color: var(--online);
}

#status-online {
    color: var(--online);
}

#status-synchronizing {
    color: var(--synchronizing);

}

#dot-synchronizing {
    background-color: var(--synchronizing);
}

#status-offline {
    color: var(--offline);
}

#dot-offline {
    background-color: var(--offline);
}

#globeContainer:hover {
    cursor: grab;
}

#globeContainer:active {
    cursor: grabbing;
}

#labelToggle {
    margin: 10px;
    font-size: 2em;
}

#globeContainer {
    margin: 3vh;
    height: 60vh;
}

.outer-reload {
    margin: -1px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: var(--white);
    cursor: pointer;
    user-select: none;
    border: solid 1px var(--white);
    padding: 0.5em;
    padding-left: 1.1em;
    padding-right: 1.1em;
}

.outer-reload:hover {
    color: var(--background);
    background-color: var(--white);
    -webkit-text-stroke: 1px var(--background);
}

#outer-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5vh;
}

#sold-keys {
    display: flex;
    width: 90vw;
    justify-content: center;
    height: 5vh;
    font-size: 1.4em;
    color: white;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
}
#numberOfKeys{
  display: flex;
  flex-direction: column;
}

#sold-keys-reload {
    color: black;
}

@keyframes rotateAnimation {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.rotate-animation {
    animation: rotateAnimation 0.5s;
}

@media screen and (max-width: 1350px) {
    #status-legend {
        width: 90vw;
        min-height: 11vh;
        overflow: hidden;
        flex-direction: column;
        align-items: center;
        margin: 0px;
        margin-bottom: 5px;
        margin-top: 2px;
        font-size: 1.4em;
        
    }

    #labelToggle {
        font-size: 1.55em;
    }

    #globeContainer {
        margin-top: 1px;
        margin-bottom: 2px;
    }

    .dot {
        margin: 10px;
    }
}

@media screen and (max-height: 865px) {
    #status-legend {
        order: -4;
        font-size: 1em;
        flex-direction: row;
    }

    .outer-reload {
        flex-shrink: 0;
        margin: 10px;
        order: -3;
    }

    #sold-keys {
        order: -4;
        font-size: 1.2em;
        margin:0px;

    }

    .status-example{
        flex-direction: column;
    }
    .dot{
        min-width: 25px;
        min-height: 25px;
        height: 25px;
        width: 25px;
        border-radius: 50%;
        margin: 1.4vh;
    }

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

#hoverStats{
  font-family: 'Lexend Exa', sans-serif;
  background-color: #f0f2f5;
  padding-right:10px;
  padding-left:10px;
  color:#131313;
}

#hoverTitle{
  display: flex;
  justify-content: center;
  align-items: center;
}


</style>

<script>
// import { Globe } from 'globe.gl';
import axios from 'axios';
//import Globe from 'globe.gl';
import Globe from 'globe.gl';
import * as THREE from '//unpkg.com/three/build/three.module.js';

export default {
  data() {
    return {
      //reloadImageUrl: '/content/refresh-white.png',
      transactionCount: 0,
      thisEpochTransactionCount: 0,
      labelfont: null,
      world: null,
      globeInitialized: false
    };
  },
  mounted() {
      this.initGlobe();
      this.countTransactions();
      // this.loadMapData();
      // this.loadFontData();
      // Initialize the globe after loading the data
      // this.initGlobe();
      // Other initialization logic
      this.handleRefreshClick();
      this.loadTransactionCount();
  },
  beforeUnmount() {
  //TODO: CHECK IF WORLD IS INITIAIZED AND ONLY AFTER THAT DESTROY
  // This hook is called right before the component is unmounted
  console.log('Cleaning globe before unmounting component');
  this.cleanupGlobe();
},
  methods: {
    cleanupGlobe() {
    // Check if the globe is initialized before attempting to clean up
      // Pause animation and clear data layers
      this.world.pauseAnimation();
      this.world.pointsData([]);
      this.world.arcsData([]);
      this.world.polygonsData([]);
      this.world.pathsData([]);
      this.world.hexBinPointsData([]);
      this.world.hexPolygonsData([]);
      this.world.labelsData([]);
      this.world.customLayerData([]);
    },
    // async loadFontData() {
    //   return axios.get('/src/assets/font.json')
    //     .then(response => {
    //       // if (!response.ok) {
    //       //   throw new Error('Network response was not ok');
    //       // }
    //       this.labelfont = response.data;
    //       this.world.labelTypeFace(this.labelfont);
    //     })
    //     .catch(error => {
    //       console.error('Error fetching labelfont:', error);
    //       throw error;
    //     });
    // },
    // loadMapData() {
    //   return axios.get('/src/assets/ne_110m_admin_0_countries.geojson')
    //     .then(res => {
    //       const countries = res.data;
    //       this.world.polygonsData(countries.features);
    //     })
    //     .catch(error => {
    //       console.error('Error fetching map data:', error);
    //       throw error;
    //     });
    // },
    initGlobe() {
      const width = document.documentElement.clientWidth * 0.65;
      const height = document.documentElement.clientHeight * 0.6;

      this.world = Globe({ animateIn: false, waitForGlobeReady: true })
        (document.getElementById('globeViz'))
        .width(width)
        .height(height)
         .globeImageUrl('/src/assets/pobrane-jasne.png')
         //.globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .pointOfView({ lat: 51, lng: 9, altitude: 1.6 }) // aim at Germany
        // .polygonAltitude(0.05)
        // .polygonCapColor(() => '#056CF2')
        // .polygonSideColor(() => 'rgba(0, 0, 0, 0)')
        // .polygonCapCurvatureResolution(5)
        .labelsData([
          {
            lat: 51,
            lng: 10,
            text: 'Germany',
            altitude: 0.059,
            dotradius: 1.2,
            size: 1.2,
            color: '#0000001', // Set the color to black (#000000) for the first label
            desc: 'Shared  node'
          },
          { //Background
            lat: 51.2,
            lng: 10,
            text: 'Germany',
            altitude: 0.06,
            dotradius: 1.2,
            size: 1.25,
            color: '#000000',
            desc: 'Shared  node'

          },
          // { 
          //   lat: 52.5,
          //   lng: 19,
          //   text: 'Poland',
          //   altitude: 0.06,
          //   dotradius: 1.2,
          //   size: 1.2,
          //   color: '#000000',
          //   desc: 'Mining  node'
          // }
        ]).labelLat(d => d.lat)
        .labelLng(d => d.lng)
        .labelText(d => d.text)
        .labelSize(d => d.size) // Adjust label size as needed
        .labelDotRadius(d => d.dotradius)
        .labelAltitude(d => d.altitude) // Set label altitude from the data
        .labelColor(d => d.color)
        // .polygonStrokeColor(() => '#f0f2f5')
        .labelLabel(d => `
        <div id="hoverStats">
        <div id="hoverTitle"><b>${d.desc}</b></div>
        <div id="numberOfKeys">
          API keys sold:
        <span id="totalSold"> ${this.transactionCount} in total</span>
        <span id="thisEpochSold">${this.thisEpochTransactionCount} this epoch</span>  
    </div>
        
        </div>
      `)
        .backgroundColor('#f0f2f5');

    //   const globeMaterial = this.world.globeMaterial();
    //   globeMaterial.bumpScale = 10;
    //   new THREE.TextureLoader().load('/src/assets/pobrane-jasne.png', texture => {
    //   globeMaterial.specularMap = texture;
    //   globeMaterial.specular = new THREE.Color('grey');
    //   globeMaterial.shininess = 15;
    // });



      // fetch('/src/assets/font.json')
      //   .then(response => {
      //     if (!response.ok) {
      //       throw new Error('Network response was not ok');
      //     }
      //     return response.json();
      //   })
      //   .then(data => {
      //     this.labelfont = data;
      //     this.world.labelTypeFace(this.labelfont);
      //   })
      //   .catch(error => {
      //     console.error('Error fetching labelfont:', error);
      //   });

      // fetch('/src/assets/simplifiedmap.geojson')
      //   .then(res => res.json())
      //   .then(countries => {
      //     this.world.polygonsData(countries.features);
      //   })
      //   .catch(error => {
      //     console.error('Error fetching map data:', error);
      //   });
    },
    // loadFontData() {
    //   axios.get('/src/assets/font.json')
    //     .then(response => {
    //       if (response && response.data) {
    //         this.labelfont = response.data;
    //         this.world.labelTypeFace(this.labelfont);
    //       }
    //     })
    //     .catch(error => {
    //       console.error('Error fetching labelfont:', error);
    //     });
    // },
//     loadMapData() {
//     fetch('./assets/simplifiedmap.geojson')
//     .then(res => res.json())
//     .then(countries => {
//       if (this.world) {
//         this.world.polygonsData(countries.features);
//       } else {
//         console.error('Globe not initialized');
//       }
//     })
//     .catch(error => {
//       console.error('Error fetching map data:', error);
//     });
// },
async getEpochValidationTime() {
    try {
      const currentEpoch = await axios.get("https://api.idena.io/api/Epoch/Last");
      //const currentValidationTime = currentEpoch.data.result.validationTime;
      const currentEpochNumber = currentEpoch.data.result.epoch;
      const lastEpochNumber = currentEpochNumber - 1;
      const lastEpoch = await axios.get("https://api.idena.io/api/Epoch/" + lastEpochNumber)
      const lastValidationTime = lastEpoch.data.result.validationTime;
      console.log(lastValidationTime);
      return new Date(lastValidationTime);
    } catch (error) {
      this.error = "Error fetching epoch validation time: " + error.message;
      throw error;
    }
  },
  async countTransactions() {
try {
  this.error = null;
  const validationTime = await this.getEpochValidationTime();
  console.log("Validation Time:", validationTime);
  let thisEpochTransactionCount = 0;
  let continuationToken = null;

  for (let i = 0; i < 3; i++) {
    console.log("Iteration:", i + 1);
    let apiUrl = "https://api.idena.io/api/Address/0x344a09ec5b9b5debc5a889837c50c66c8a78f04d/Txs?limit=100";
    if (continuationToken) {
      apiUrl += `&continuationToken=${continuationToken}`;
    }
    const response = await axios.get(apiUrl);
    const transactions = response.data.result;
    console.log("Transactions:", transactions);

    for (const transaction of transactions) {
      const txTimestamp = new Date(transaction.timestamp);
      if (txTimestamp > validationTime) {
        const amount = parseFloat(transaction.amount);
        if ([0.01, 1, 3, 5].includes(amount)) {
          thisEpochTransactionCount++;
        }
      }
    }
    
    if (response.data.continuationToken) {
      continuationToken = response.data.continuationToken;
    } else {
      console.log("No continuation token found. Exiting loop.");
      break;
    }
    //dont go into next iteration if there are < 100 transactions in 100 element batch
    if (thisEpochTransactionCount < (i+1) * 100 ){
      break;
    }
  }

  this.thisEpochTransactionCount = thisEpochTransactionCount;
  console.log("Total transactions:", this.thisEpochTransactionCount);

} catch (error) {
  this.error = "Error counting transactions: " + error.message;
}
},


    loadTransactionCount() {
      const apiUrl = 'https://api.idena.io/api/address/0x344a09ec5b9b5debc5a889837c50c66c8a78f04d/txs/count';
      axios.get(apiUrl)
        .then(response => {
          if (response && response.data && response.data.result) {
            this.transactionCount = response.data.result - 59;
          }
        })
        .catch(error => {
          console.error('Error fetching transaction count:', error);
        });
    },
    makeSyncingRequest() {
      const rpcEndpoint = 'https://idenanode.com';
      const payload = {
        method: 'bcn_syncing',
        params: [],
        id: 1,
        key: '22ref1stat122',
      };

      return axios.post(rpcEndpoint, payload)
        .then(response => response.data)
        .catch(error => {
          console.error('Error:', error);
          throw error;
        });
    },
    handleRefreshClick() {
         //world.labelColor(() => 'rgba(0, 0, 0, 1)');

      this.world.labelColor(d => {
        if (d.text === 'Germany' && d.color !== '#000000') {
          return 'rgba(0, 0, 0, 0.6)'; // Keep the shadow 0.6 opacity on refresh
        }
      });

      this.makeSyncingRequest()
        .then(data => {
          console.log(data);
          // Determine color based on 'syncing' field
          const labelColor = data.result.syncing ? '#FF681E' : '#00FF00';
          // Update label colors
          this.world.labelColor(d => {
            if (d.text === 'Germany' && d.color !== '#000000') {
              return 'rgba(0, 0, 0, 0.6)'; // Keep the 'Germany' label black
            } else if (d.text === 'Germany') {
              return labelColor; // Change color for the 'Another Label'
            } else {
              return d.color; // Keep other labels' color as is
            }
          });
        })
        .catch(error => {
          console.error('Error:', error);
          // Offline color
          const offlineColor = '#FF000D';

          // Update label colors
          this.world.labelColor(d => {
            if (d.text === 'Germany' && d.color !== '#000000') {
              return 'rgba(0, 0, 0, 0.6)'; // Keep the 'Germany' label black
            } else if (d.text === 'Germany') {
              return offlineColor; // Change color for the 'Another Label'
            } else {
              return d.color; // Keep other labels' color as is
            }
          });
        });
    },
    handleReloadClick() {
      // Implement handleReloadClick function here
    },
    resizeGlobe() {
      // Implement resizeGlobe function here
    },
  },
  watch: {
    transactionCount() {
      // Handle any side effects when transaction count changes
    }
  }
};
</script>
