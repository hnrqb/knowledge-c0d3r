import 'font-awesome/css/font-awesome.css' 
import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import store  from './config/store'
import router from './config/router'

Vue.config.productionTip = false

require('axios').defaults.headers.common['Authorization'] 
	= 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NywibmFtZSI6IkZsYXZpbyBCZXJuYXJkZXRvIiwiZW1haWwiOiJmbGF2aW9iZXJuYXJkZXRvMTIzNEBnbWFpbC5jb20iLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTcyNjUyMzgxNywiZXhwIjoxNzI2NzgzMDE3fQ.0X4II5jhG1FRUpO-6Rr1y4_VB2HoR5RvgPyIxsadJfo'

new Vue({
	store,
	router,
	render: h => h(App)
}).$mount('#app')