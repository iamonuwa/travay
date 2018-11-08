import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: (resolve) => {
        require(['@/components/home.vue'], resolve)
      }
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: (resolve) => {
        require(['@/components/jobs.vue'], resolve)
      }
    },
    {
      path: '/job/:id',
      name: 'job',
      component: (resolve) => {
        require(['@/components/job.vue'], resolve)
      }
    },
    {
      path: '/createJob',
      name: 'create-job',
      component: (resolve) => {
        require(['@/components/createJob.vue'], resolve)
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: (resolve) => {
        require(['@/components/profile.vue'], resolve)
      }
    },
    {
      path: '/get-started',
      name: 'get-started',
      component: (resolve) => {
        require(['@/components/get-started.vue'], resolve)
      }
    },
    {
      path: '/tip',
      name: 'tip',
      component: (resolve) => {
        require(['@/components/tip.vue'], resolve)
      }
    },
    {
      path: '/get-funds',
      name: 'get-funds',
      component: (resolve) => {
        require(['@/components/get-funds.vue'], resolve)
      }
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: (resolve) => {
        require(['@/components/pricing.vue'], resolve)
      }
    },
    {
      path: '/team',
      name: 'team',
      component: (resolve) => {
        require(['@/components/team.vue'], resolve)
      }
    }
  ]
})
