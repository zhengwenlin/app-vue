import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    // 1. state
    state:{
        discussId:-1
    },
    // 4. mutations
    mutations:{
        discussId(state,val){
            state.discussId = val
        }
    }
})

export default store