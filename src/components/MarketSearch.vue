<template>
  <div class="market-search" style="flex: 1; display: flex">
    <md-toolbar class="md-primary" md-elevation="1">
      <div class="md-toolbar-row">
        <md-autocomplete
          class="search"
          :md-options="markets"
          :value="market"
          @md-changed="searchMarkets"
          @md-selected="getSelected"
          md-layout="box"
          md-dense>
          <label>Market</label>
          <template slot="md-autocomplete-item" slot-scope="{ item }">{{ item.Name }}</template>
        </md-autocomplete>

        <div class="theme">
          <Select :data="themes" placeholder="Theme" v-model="theme"/>
        </div>

        <div class="md-toolbar-section-end">
          <md-button class="md-raised md-default" @click="redirectToMarketInfo()" :disabled="!market">
            Load Market Info
          </md-button>

          <span class="separator"></span>
          <md-checkbox v-model="inNewWindow" value="1" class="md-primary" :disabled="!market">New Window</md-checkbox>
        </div>
      </div>
    </md-toolbar>
    <div class="info">
        <div>
          <Input 
            label="Width:"
            type="number"  
            v-model.number="frame.width"
          />
          <span class="unit">px</span>
          <span class="separator"></span>
          <Input 
            label="Height:"
            type="number" 
            v-model.number="frame.height"
          />
          <span class="unit">px</span>
        </div>
    </div>

    <div class="market-info-frame">
      <VueResizable 
        @resize:start="start"
        @resize:end="end"
        @resize:move="move"
        :min-width="320"
        :min-height="400"
        :width="frame.width"
        :height="frame.height"
        :fit-parent="true"
        :active="['r', 'rb', 'b']">
        <div class="resizable-content">
          <div v-if="resizing" class="cover"></div>
          <iframe v-if="marketInfoUrl && !inNewWindow" v-bind:src="marketInfoUrl"></iframe>
        </div>
      </VueResizable>
    </div>
  </div>
</template>

<script>
import searchMarket from '../data-providers/markets';
import Input from './Input';
import Select from './Select';
const { service } = require('../data-providers/authentication.js');
import VueResizable from 'vue-resizable';
import store from './../store';

export default {
  name: 'MarketSearch',
  components: {
    VueResizable,
    Input,
    Select
  },
  beforeRouteEnter (to, from, next) {
    const isLoggedIn = store.getters.isLoggedIn;
    if (!isLoggedIn) {
      next('/pr/');
    } else {
      next();
    }

  },
  created() {
    service.getClientAccount()
      .then(account => {
        this.clientAccount = account.ClientAccountId;
      })
      .catch(() => {
        store.commit('resetState');
        this.$router.push({ path: `/pr`});
      });
  },
  computed: {
    session() {
      return store.state.session
    },
    username() {
      return store.state.username
    },
    prNumber() {
      return store.state.pullRequestNumber
    }
  },
  data() {
    const initWidth = 320;
    const initHeight = 500;
    const themes = [
      {value: 'ap_light', text: 'Ap Light'},
      {value: 'ap_dark', text: 'Ap Dark'},
      {value: 'dark', text: 'Dark'},
      {value: 'gray', text: 'Gray'},
      {value: 'ap_forex_dark', text: 'Forex dark'},
    ]

    return {
      prUrlTemplate: 'http://maz-dev-merc02.northeurope.cloudapp.azure.com:5559/marketinfo/pr/{pr}/?MK={market}&SN={session}&CUID=69&UN={user}&THEME={theme}&CLC={clc}#/',
      market: null,
      markets: [],
      theme: 'ap_light',
      clientAccount: null,
      marketInfoUrl: null,
      inNewWindow: false,
      resizing: false,
      frame: {
        width: initWidth,
        height: initHeight
      },
      themes
    }
  },
  watch: {
    theme: function() {
      if(this.marketInfoUrl && !this.inNewWindow) {
        this.redirectToMarketInfo();
      }
    }

  },
  methods: {
    searchMarkets: function(searchTerm) {
      if (searchTerm && searchTerm.length < 3) {
        return;
      }

      this.markets = searchMarket({ query: searchTerm }, this.session, this.username)
    },
    getSelected(market) {
      this.market = market;
    },
    redirectToMarketInfo: function() {
      const redirectUrl = this.prUrlTemplate
        .replace('{pr}', this.prNumber)
        .replace('{session}', this.session)
        .replace('{theme}', this.theme)
        .replace('{market}', this.market.MarketId || '400159936')
        .replace('{clc}', this.clientAccount)
        .replace('{user}', this.username);

      this.marketInfoUrl = redirectUrl;

      if (this.inNewWindow) {
        window.open(redirectUrl, '_blank')
      }
    },
    start: function() {
      this.resizing = true;
    },
    end: function() {
      this.resizing = false;
    },
    move: function(data) {
      this.frame.width = data.width;
      this.frame.height = data.height;
      this.resizing = true;
    }
  }
}

</script>

<style scoped>
.market-search {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.resizable-content {
  position: relative;
  height: 100%;
  width: 100%;
        
  display: flex;
  border: 2px dashed gray;
}

.resizable-content iframe {
  flex: 1;
  border: none;
}

  .search {
    max-width: 500px;
  }

  .market-info-frame {
    flex: 1;
    margin: 0 10px 10px 10px;
    box-sizing: border-box;
  }

  .cover {
    width: 100%;
    height: 100%;
    z-index: 1000;
    position: absolute;
    background: rgba(0,0,0,0.5)
  }

  .info {
    padding: 10px;
    color: gray;
  }

  .theme {
    width: 200px;
    display: inline-block;
    margin-left: 30px;
    -webkit-text-fill-color: white;
  }

  .separator {
    width: 1px;
    display: inline-block;
    background-color: black;
    margin: 0 5px;
  }

  .unit {
    margin-left: 5px;
  }

</style>

<style>
 .md-toolbar .theme .md-field {
    margin-top: 0;
    margin-bottom: 0;
    padding-top: 0;
  }
</style>