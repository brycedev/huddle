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
  scrollBehavior(to, from, savedPosition) {
    const stickers = ['CreatePostPublic', 'CreatePostPrivate', 'ExpandedHuddlePostPublic', 'ExpandedHuddlePostPrivate']
    if (savedPosition || stickers.includes(to.name) || stickers.includes(from.name)) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
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
      name: 'HuddlePublic',
      component: Huddle,
      children: [
        { 
          path: 'new',
          name: 'CreatePostPublic'
        },
        { 
          path: 'post/:postId',
          name: 'ExpandedHuddlePostPublic'
        }
      ]
    },
    {
      path: '/p/:id',
      name: 'HuddlePrivate',
      component: Huddle,
      children: [{
          path: 'new',
          name: 'CreatePostPrivate'
        },
        {
          path: 'post/:postId',
          name: 'ExpandedHuddlePostPrivate'
        }
      ]
    },
  ]
})
