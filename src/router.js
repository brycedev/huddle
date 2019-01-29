import Vue from 'vue'
import Router from 'vue-router'
import About from './views/About.vue'
import CreateHuddle from './views/CreateHuddle.vue'
import Discover from './views/Discover.vue'
import Admin from './views/Admin.vue'
import Home from './views/Home.vue'
import Huddle from './views/Huddle.vue'
import EditProfile from './views/EditProfile.vue'
import Identity from './views/Identity.vue'
import Onboard from './views/Onboard.vue'
import Settings from './views/Settings.vue'

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
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/huddles/new',
      name: 'CreateHuddle',
      component: CreateHuddle
    },
    {
      path: '/discover',
      name: 'Discover',
      component: Discover,
      children: [{
          path: 'vote/:id',
          name: 'ProposedVote'
        }
      ]
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/pohjpqewo8gqwe9pnjqwcwp',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/h/:slug',
      name: 'HuddlePublic',
      component: Huddle,
      children: [
        { 
          path: 'join',
          name: 'JoinHuddle'
        },
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
      path: '/i/:username',
      name: 'Identity',
      component: Identity,
      children: [
        { 
          path: 'post/:postId',
          name: 'ExpandedHuddlePostIdentity'
        }
      ]
    },
    {
      path: '/i/:username/edit',
      name: 'EditProfile',
      component: EditProfile
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
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/welcome',
      name: 'Onboard',
      component: Onboard
    },
  ]
})
