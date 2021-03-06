import axios from 'axios'
import {baseDomain} from './domain.js'
axios.defaults.baseURL = baseDomain.httpUrl;
let http = {
    post: "",
    get: ""
}

http.post = function (api, data) {
    let params = data;
    return new Promise((resolve, reject) => {
        axios.post(api, params).then(res => {
            resolve(res)
        })
    })

}


http.get = function (api, data) {
    let params = {params: data};
    return new Promise((resolve, reject) => {
        axios.get(api, params).then(res => {
            resolve(res)
        })
    })

}


export default http
