import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

import tempData from '@/temp/data';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    getChartTableData() {
      // const res = axios.get('http://62.109.22.211:5000/api/v1.0/front_test_data');
      let res = {data: tempData.Info};
      if (res && res.data)
        return res.data;
    }
  },
  modules: {}
})
