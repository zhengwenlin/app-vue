import axios from 'axios'

const myHttp = {}
myHttp.install = function (Vue) {

    // axios.defaults.baseURL = 'http://app.dtguai.com' //proxyApi
    axios.defaults.baseURL = 'http://apptest.dtguai.com' //proxyApi
    // axios.defaults.baseURL = 'proxyApi' ///proxyApi
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    Vue.prototype.$http = axios
      
}
export default myHttp
    