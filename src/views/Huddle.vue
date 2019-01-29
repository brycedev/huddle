<template>
  <div class="home w-full relative flex-grow" v-if="huddle">
    <div class="w-full bg-black relative centercenter" :style="bgImage">
      <div class="overlay absolute pin z-auto" :style="bgColor"></div>
      <div class="container flex justify-center items-center">
        <div class="flex justify-center items-center flex-col py-20 my-12">
          <h1 class="text-4xl text-white font-light max-w-sm text-center mb-8 flex z-50">
            {{ huddle.name }}
          </h1>
        </div>
      </div>
    </div>
    <div class="container flex">
      <div class="w-full flex justify-between z-50 mx-auto max-w-xl">
        <div class="w-120 mt-8 mr-4 md:flex md:flex-col hidden">
          <div class="rounded-lg shadow p-6 bg-white w-full mb-4">
            <p class="text-black font-light mb-4">Description</p>
            <p class="text-grey-darkest leading-normal font-light break">{{ huddle.description }}</p>
          </div>
          <div class="rounded-lg shadow p-4 bg-white w-full mb-4" v-if="isMember">
            <p class="text-black font-light mb-4">Members</p>
            <div class="w-full flex">
              <div class="flex flex-wrap z-50 overflow-hidden">
                <!-- <router-link :to="'/i/' + member.username.replace('.id.blockstack', '')" v-for="member in members" :key="member.id"  class="block no-underline mr-2">
                  <img class="w-8 h-8 rounded-full" :src="member.avatar"/>
                </router-link> -->
                <router-link :to="`/i/${member.username}`" v-for="member in members" :key="member.id"  class="block no-underline mr-2">
                  <img class="w-8 h-8 rounded-full" :src="member.avatar" v-tooltip="member.username"/>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full flex-grow flex flex-col -mt-20 md:ml-4">
          <div class="self-end flex items-center mr-4 md:mr-0 mb-4" v-if="isMember">
            <router-link :to="`${$route.fullPath}/new`" class="block no-underline self-end ">
              <div class="bg-white rounded-full text-black text-center py-2 px-4 cursor-pointer hidden md:flex items-center">
                <img src="../assets/plus-dark.svg" alt="" class="w-4 h-4 mr-2">
                <span>Create Post</span>
              </div>
            </router-link>
            <div class="bg-red-light rounded-full py-2 px-4 cursor-pointer hidden md:flex items-center ml-2" @click="leaveHuddle">
              <img src="../assets/logout-white.svg" alt="" class="w-4 h-4">
            </div>
          </div>
          <div class="self-end flex items-center mr-4 md:mr-0 mb-4" v-if="!isMember">
            <div class="bg-white rounded-full text-black text-center py-2 px-4 cursor-pointer hidden md:flex items-center" v-if="isHybrid">
              <img src="../assets/request-invite-dark.svg" alt="" class="w-4 h-4 mr-2">
              <span>Request Invite</span>
            </div>
            <div class="bg-white rounded-full text-black text-center py-2 px-4 cursor-pointer hidden md:flex items-center" @click="joinHuddle" v-if="isPublic">
              <img src="../assets/request-invite-dark.svg" alt="" class="w-4 h-4 mr-2">
              <span>Join Huddle</span>
            </div>
          </div>
          <router-link :to="`${$route.fullPath}/post/${post.id}`" v-for="post in displayedPosts" class="block md:mx-0 mx-2 no-underline" :key="post.id" v-if="isMember">
            <huddle-post :loaded="true" :post="post"></huddle-post>
          </router-link>
          <router-link :to="`${$route.fullPath}/post/${post.id}`" v-for="post in displayedPosts.slice(0,2)" class="block md:mx-0 mx-2 no-underline" :key="post.id" v-if="!isMember && posts.length">
            <huddle-post :loaded="true" :post="post"></huddle-post>
          </router-link>
          <template v-if="!isMember">
            <huddle-post :loaded="false" :post="{}" v-for="num in [1,2,3,4]" :key="num"></huddle-post>
          </template>
          <div class="rounded-lg shadow py-12 md:mx-0 mx-4 px-8 bg-white md:w-full flex flex-col items-center justify-center cursor-pointer" v-if="isMember && !displayedPosts.length">
            <p class="mb-4 text-grey-darker text-center md:font-thin md:text-xl font break" >No posts, yet. Start the conversation.</p>
            <img class="px-8 w-96" src="../assets/empty-post.svg" alt="Create an identity" width="100%">
            
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
    <portal to="modal">
      <expanded-huddle-post :post="expandedPost" :visible="showExpandedPost"></expanded-huddle-post>
      <create-post :huddle="huddle" :visible="showCreatePost"></create-post>
    </portal>
  </div>
</template>

<script>
import CreatePost from '@/components/CreatePost.vue'
import ExpandedHuddlePost from '@/components/ExpandedHuddlePost.vue'
import HuddlePost from '@/components/HuddlePost.vue'

export default {
  name: 'Huddle',
  store: ['huddles', 'user', 'users'],
  components: { CreatePost, ExpandedHuddlePost, HuddlePost },
  data() {
    return {
      huddle: null,
      expandedPost: null,
      memberIds: [],
      posts: [],
      postFragments: [],
      isMember: false,
    }
  },
  beforeRouteEnter (to, from, next) {
    next(async vm => {
      const isPublic = to.fullPath.includes('/h/')
      if(isPublic){
        vm.huddle = vm.huddles.find(h => h.slug == to.params.slug)
      } else {
        if(vm.user){
          vm.huddle = vm.user.privateHuddles.find(h => h.id == to.params.id)
          if(!vm.huddle) next('/404')
        } else{
          next('/404')
        }
      }
      if(to.name.includes('ExpandedHuddlePost')){
        let maxSearchTime = 12 // 12 * 100 = 1200 milliseconds == 1.2 seconds
        let currentTime = 0
        let findPost = () => {
          return new Promise((resolve, reject) => {
            setInterval(() => {
              const foundPost = vm.posts.find(p => p.id == vm.$route.params.postId)
              if(foundPost) resolve(foundPost)
              if(currentTime == maxSearchTime) resolve(foundPost)
            }, 100)
          })
        }
        vm.expandedPost = await findPost()
        if(!vm.expandedPost) vm.$router.push(`/h/${to.params.slug}`)
        else document.getElementById('body').style.overflowY = 'hidden'
      } else if(to.name.includes('CreatePost')){
        next(vm => {
          document.getElementById('body').style.overflowY = 'hidden'
        })
      } else {
        document.getElementById('body').style.overflowY = 'auto'
      }
    })
    
  },
  metaInfo(){
    return this.huddle ? {
      title: `${this.huddle.name} | Huddle`,
      meta: [
        {
          'property': 'og:title',
          'content': `Join the ${this.huddle.name} group on Huddle!`,
        }
      ]
    } : { }
  },
  beforeRouteUpdate (to, from, next) {
    if(to.name.includes('ExpandedHuddlePost')){
      this.expandedPost = this.posts.find(p => p.id == to.params.postId)
      this.expandedPost ? next() : next(false)
    } else if(['HuddlePublic', 'HuddlePrivate'].includes(to.name) && from.name.includes('CreatePost')){
      const isPublic = to.fullPath.includes('/h/')
      if(isPublic){
        this.huddle = this.huddles.find(h => h.slug == from.params.slug)
      } else {
        this.huddle = this.user.privateHuddles.find(h => h.id === from.params.id)
      }
      this.huddle ? next() : next(false)
    } else if(['HuddlePublic', 'HuddlePrivate'].includes(to.name) && from.name.includes('ExpandedHuddlePost')){
      this.expandedPost = null
      next()
    } else {
      const isPublic = to.fullPath.includes('/h/')
      if(isPublic){
        this.huddle = this.huddles.find(h => h.slug == to.params.slug)
      } else {
        this.huddle = this.user.privateHuddles.find(h => h.id === to.params.id)
      }
      this.huddle ? next() : next(false)
      next()
    }
  },
  computed: {
    displayedPosts(){
      return this.user && this.user.preferences
        ? Array.from(new Set(this.posts)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).filter(p => !this.user.preferences.filters.blockedUsers.includes(p.u)).filter(p => this.user.preferences.hideNSFW ? !p.isNSFW : true)
        : Array.from(new Set(this.posts)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },
    bgColor(){
      return { 
        backgroundColor: `hsla(${ this.huddle.hue }, 35%, 27%, .64)`
      }
    },
    bgImage(){
      return { 
        backgroundImage: `url('${this.huddle.background}')` 
      }
    },
    isHybrid(){
      return this.huddle && this.huddle.type == 'hybrid'
    },
    isPublic(){
      return this.huddle && this.huddle.type == 'public'
    },
    isPrivate(){
      return this.huddle && this.huddle.type == 'private'
    },
    members(){
      return this.user 
        ? this.users.filter(u => this.memberIds.includes(u.id)).filter(u => !this.user.preferences.filters.blockedUsers.includes(u.id))
        : []
    },
    showCreatePost(){
      return this.$route.name.includes('CreatePost')
    },
    showExpandedPost(){
      return this.$route.name.includes('ExpandedHuddlePost') && this.expandedPost !== null
    }
  },
  methods: {
    checkMembership(){
      return this.huddle && this.user && this.user.publicHuddles && this.user.privateHuddles
        ? this.isPublic && this.user.publicHuddles && this.user.privateHuddles
          ? this.user.publicHuddles.includes(this.huddle.id)
          : this.user.privateHuddles.map(h => h.id).includes(this.huddle.id)
        : false
    },
    async leaveHuddle(){
      this.user.publicHuddles = this.user.publicHuddles.filter(s => s !== this.huddle.id)
      const newPublicHuddles = JSON.stringify(this.user.publicHuddles)
      this.$gun.get(`${gunPrefix}:huddles/${this.huddle.id}`).get('members').unset({ id: this.user.id })
      await blockstack.putFile('publicHuddles.json', JSON.stringify(this.user.publicHuddles), { encrypt : false })
      await blockstack.putFile('publicHuddles.json', newPublicHuddles, { encrypt : false })
      this.$router.push('/')
    },
    async joinHuddle(){
      return new Promise(async (resolve, reject) => {
        if(this.isPublic && this.user){
          progress.start()
          const newMember = this.$gun.get(`${gunPrefix}:huddles/${this.huddle.id}`).get('members').set({ id: this.user.id })
          this.user.publicHuddles.push(this.huddle.id)
          const newPublicHuddles = JSON.stringify(this.user.publicHuddles)
          await blockstack.putFile('publicHuddles.json', newPublicHuddles, { encrypt : false })
          const data = blockstack.loadUserData()
          await this.$parent.putUser(data)
          progress.done()
          this.isMember = this.checkMembership()
          resolve()
        } else {
          resolve()
        }
      })
    },
    fetchMembers(){
      if(this.isPublic && this.user){
        let members = []
        this.$gun.get(`${gunPrefix}:huddles/${this.huddle.id}`).get('members').map().on(user => {
          members.push(user)
        })
        this.memberIds = Array.from(new Set(members.map(m => m.id)))
      } else {
        this.memberIds = []
      }
    },
    fetchPosts(){
      if(this.isPublic){
        this.postFragments = []
        this.$gun.get(`${gunPrefix}:huddles/${this.huddle.id}`).get('posts').map().on(post => {
          this.postFragments.push(post)
          this.postFragments = Array.from(new Set(this.postFragments))
        })
      } else {
        
      }
    },
    fetchStuff(){
      this.fetchMembers()
      this.fetchPosts()
    }
  },
  mounted(){
    
  },
  watch: {
    $route(value){
      this.fetchMembers()
      this.isMember = this.checkMembership()
    },
    huddle(newValue, oldValue) {
      this.fetchMembers()
      this.fetchPosts()
      this.isMember = this.checkMembership()
    },
    isMember(value){
      if(value){
        this.fetchStuff()
      }
    },
    postFragments(value){
      if(value && this.users){
        let posts = []
        value.forEach(async f => {
          const user = this.users.find(u => u.id == f.u)
          if(f.u == this.user.id && this.user){
            posts.push(this.user.publicPosts.find(p => p.id == f.id))
          } else {
            blockstack.getFile(`publicPosts/${f.id}.json`, {
              decrypt: false,
              app: window.location.origin,
              username: user.bi
            }).then(post => {
              posts.push(JSON.parse(post))
            }).catch(err => {
              console.log(err)
            })
          }
        })
        this.posts = posts
      }
    }
  },
}
</script>