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

@media screen and (max-width: 1350px) {
    #status-legend {
        width: 90vw;
        min-height: 11vh;
        overflow: hidden;
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

#hoverStats{
  font-family: 'Lexend Exa', sans-serif;
  background-color: var(--color-background);
  padding-right:10px;
  padding-left:10px;
  border-radius: 7px;
  border: 2px solid var(--blue);
}

#hoverTitle{
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--blue);
}
</style>

<script >
import axios from 'axios';
import { POOL_ADDRESS, NODE_URL, NODE_KEY } from '@/config';
import { Conn } from "@/connection";
import Globe from 'globe.gl';
import texture from '/src/assets/mapLight.png';
import simplifiedMap from 'src/assets/simplifiedMap.json';
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
        .polygonSideColor(() => 'rgba(0, 0, 0, 0.05)')
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
        .labelSize(d => d.size)
        .labelDotRadius(d => d.dotradius)
        .labelAltitude(d => d.altitude)
        .labelColor(d => d.color)
        .polygonStrokeColor(() => '#f0f2f5')
        .labelLabel(d => `
        <div id="hoverStats">
        <div id="hoverTitle"><b>${d.desc}</b></div>
        </div>
      `)
        .backgroundColor('#f0f2f5')
        .polygonsData(simplifiedMap.features);
    },
    makeSyncingRequest() {
      const rpcEndpoint = NODE_URL;
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
          return 'rgba(0, 0, 0, 1)';
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
