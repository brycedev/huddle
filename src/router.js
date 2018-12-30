import Vue from 'vue'
import Router from 'vue-router'
import Create from './views/Create.vue'
import Discover from './views/Discover.vue'
import Home from './views/Home.vue'
import Huddle from './views/Huddle.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/huddles/new',
      name: 'Create',
      component: Create
    },
    {
      path: '/discover',
      name: 'Discover',
      component: Discover
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/h/:slug',
      name: 'Huddle',
      component: Huddle,
      children: [
        { 
          path: 'new',
          name: 'CreatePost'
        },
        { 
          path: 'post/:id',
          name: 'ExpandedHuddlePost'
        }
      ]
    },
  ]
})
