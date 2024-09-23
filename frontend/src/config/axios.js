import axios from 'axios'
import Vue from 'vue'

let hasShownToast = false;

const success = res => res

const error = err => {
    if (err.response && err.response.status === 401 && !hasShownToast) {
        hasShownToast = true
        Vue.prototype.$toasted.global.defaultInfo({
            msg: 'Sua sessão expirou, e você será redirecionado em breve'
        })
        setTimeout(() => {
            hasShownToast = true
            window.location = '/'
        }, 3000); 
    } else {
        return Promise.reject(err)
    }
}

axios.interceptors.response.use(success, error)