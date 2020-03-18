import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index/index.vue'
import Cell from '@/pages/cell/region-view.vue'
Vue.use(Router)
export default new Router({
	routes:[
		{
			path:'/',
			name:'index',
			component: Index,
		},
		{
			path:'/cell',
			name:'cell',
			component: Cell,
		},
	]
})
