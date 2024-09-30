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
</div>
  </template>
  
  <style>

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
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 93.2vh;
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
        /* flex-direction: column; */
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
@media (max-width: 768px) {
  #homewrapper{
      padding-bottom: 10vh;
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
  background-color: #fff;
  padding-right:10px;
  padding-left:10px;
  color:#131313;
  border-radius: 7px;
  border: 2px solid #0A66C2;
}

#hoverTitle{
  display: flex;
  justify-content: center;
  align-items: center;
  color:#0A66C2;
}
</style>

<script >
import axios from 'axios';
import Globe from 'globe.gl';
import texture from '/src/assets/pobrane-jasne.png';
import { POOL_ADDRESS, NODE_URL, NODE_KEY } from '@/config';
import { Conn } from "@/connection";

export default {
  data: function() {
    const conn = new Conn(this.connected, NODE_URL, NODE_KEY);

    return {
      conn,
    };
  },
  mounted() {
      this.initGlobe();
      this.handleRefreshClick();
  },
  beforeUnmount() {
  this.cleanupGlobe();
},
  methods: {
    cleanupGlobe() {
      // Pause animation and clear data layers
      this.world.pauseAnimation();
      this.world.pointsData([]);
      this.world.arcsData([]);
      // this.world.polygonsData([]);
      this.world.pathsData([]);
      this.world.hexBinPointsData([]);
      this.world.hexPolygonsData([]);
      // this.world.labelsData([]);
      this.world.customLayerData([]);
    },
    initGlobe() {
      const width = window.innerWidth * 0.8;
      const height = window.innerHeight * 0.6;
      this.world = Globe({ animateIn: false, waitForGlobeReady: true })
        (document.getElementById('globeViz'))
        .width(width)
        .height(height)
        .globeImageUrl(texture)
        .pointOfView({ lat: 54, lng: 18, altitude: 1.69 })
        .polygonAltitude(0.05)
        .polygonCapColor(() => '#056CF2')
        .polygonSideColor(() => 'rgba(0, 0, 0, 0)')
        .polygonCapCurvatureResolution(5)
        .labelsData([
          {
            lat: 51,
            lng: 10,
            text: 'Germany',
            altitude: 0.059,
            dotradius: 1.2,
            size: 1.2,
            color: '#0000001',
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
          { 
            lat: 52.5,
            lng: 19,
            text: 'Poland',
            altitude: 0.06,
            dotradius: 1.2,
            size: 1.2,
            color: '#0000002',
            desc: 'Mining  node'
          },
          { //Background
            lat: 52.4,
            lng: 19,
            text: 'Poland',
            altitude: 0.059,
            dotradius: 1.2,
            size: 1.25,
            color: '#000000',
            desc: 'Mining  node'
          }
        ]).labelLat(d => d.lat)
        .labelLng(d => d.lng)
        .labelText(d => d.text)
        .labelSize(d => d.size) // Adjust label size as needed
        .labelDotRadius(d => d.dotradius)
        .labelAltitude(d => d.altitude) // Set label altitude from the data
        .labelColor(d => d.color)
        .polygonStrokeColor(() => '#f0f2f5')
        .labelLabel(d => `
        <div id="hoverStats">
        <div id="hoverTitle"><b>${d.desc}</b></div>
        </div>
      `)
        .backgroundColor('#f0f2f5');
    
      fetch('/src/assets/simplifiedmap.geojson')
        .then(res => res.json())
        .then(countries => {
          this.world.polygonsData(countries.features);
        })
        .catch(error => {
          console.error('Error fetching map data:', error);
        });
    },
    makeSyncingRequest() {
      const rpcEndpoint = 'https://idenanode.com';
      const payload = {
        method: 'bcn_syncing',
        params: [],
        id: 1,
        key: NODE_KEY,
      };
      return axios.post(rpcEndpoint, payload)
        .then(response => response.data)
        .catch(error => {
          console.error('Error:', error);
          throw error;
        });
    },
    makeSyncingRequestMining: async function(){
      return (await this.conn.getIdentity(POOL_ADDRESS));
    },
    handleRefreshClick() {
      this.world.labelColor(d => {
        if (d.text === 'Germany' && d.color !== '#000000') {
          return 'rgba(0, 0, 0, 1)'; // Keep the shadow 0.6 opacity on refresh
        }
      });
      this.makeSyncingRequest()
        .then(data => {
          const labelColor = data.result.syncing ? '#FF681E' : '#00FF00';
          (this.world.labelsData())[0].color = labelColor;
          this.world.labelColor(d => {
            if (d.text === 'Germany' && d.color !== '#000000') {
              return 'rgba(0, 0, 0, 1)'; 
            } else if (d.text === 'Germany') {
                const labelColorMining = data.online ? '#00FF00' : '#FF000D';
               (this.world.labelsData())[2].color = labelColorMining;
              return labelColor; 
            } else {
              return d.color;
            }
          });
        })
        .catch(error => {
          console.error('Error:', error);
          const offlineColor = '#FF000D';
          this.world.labelColor(d => {
            if (d.text === 'Germany' && d.color !== '#000000') {
              return 'rgba(0, 0, 0, 1)'; 
            } else if (d.text === 'Germany') {
              (this.world.labelsData())[2].color = '#000000';
              return offlineColor; 
            } else {
              return d.color;
            }
          });
        });
      this.makeSyncingRequestMining()
      .then (data => {
        const labelColor = data.online ? '#00FF00' : '#FF000D';
        (this.world.labelsData())[2].color = labelColor;
      })
    },
  },
};
</script>
