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
          <router-link :to="`${$route.fullPath}/new`" class="block no-underline self-end" v-if="isMember">
            <div class="bg-white rounded-full text-black text-center py-2 px-4 cursor-pointer hidden md:flex items-center mb-4">
              <img src="../assets/plus-dark.svg" alt="" class="w-4 h-4 mr-2">
              <span>Create Post</span>
            </div>
          </router-link>
          <div class="self-end bg-white rounded-full text-black text-center py-2 px-4 cursor-pointer flex items-center mb-4" v-if="isHybrid && !isMember">
            <img src="../assets/request-invite-dark.svg" alt="" class="w-4 h-4 mr-2">
            <span>Request Invite</span>
          </div>
          <div class="self-end bg-white rounded-full text-black text-center py-2 px-4 cursor-pointer flex items-center mb-4" v-if="!isHybrid && !isMember" @click="joinGroup">
            <img src="../assets/request-invite-dark.svg" alt="" class="w-4 h-4 mr-2">
            <span>Join Group</span>
          </div>
          <router-link :to="`${$route.fullPath}/post/${post.id}`" v-for="post in displayedPosts" class="block md:mx-0 mx-2 no-underline" :key="post.id" v-if="isMember">
            <huddle-post :loaded="true" :post="post"></huddle-post>
          </router-link>
          <router-link :to="`${$route.fullPath}/post/${post.id}`" v-for="post in displayedPosts.slice(0,2)" class="block md:mx-0 mx-2 no-underline" :key="post.id" v-if="!isMember">
            <huddle-post :loaded="true" :post="post"></huddle-post>
          </router-link>
          <huddle-post class="md:mx-0 mx-2" :loaded="false" :post="{}" v-for="num in [1,2,3,4]" :key="num" v-if="!isMember"></huddle-post>
          <div class="rounded-lg shadow py-12 md:mx-0 mx-4 px-8 bg-white md:w-full flex flex-col items-center justify-center cursor-pointer" v-if="isMember && !posts.length">
            <img class="px-8 w-96 mb-4" src="../assets/empty-post.svg" alt="Create an identity" width="100%">
            <p class="text-grey-darker text-center md:font-thin md:text-xl font break" >No posts, yet. Start the conversation.</p>
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
      postFragments: []
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.huddle = vm.huddles.find(h => h.slug == to.params.slug)
      if(to.name.includes('ExpandedHuddlePost')){
        setTimeout(() => {
          vm.expandedPost = vm.posts.find(p => p.id == to.params.postId)
          document.getElementById('body').style.overflowY = 'hidden'
          if(!vm.expandedPost) vm.$router.push(`/h/${to.params.slug}`)
        }, 1200)
      } else if(to.name.includes('CreatePost')){
        next(vm => {
          document.getElementById('body').style.overflowY = 'hidden'
        })
      } else {
        document.getElementById('body').style.overflowY = 'auto'
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    if(to.name.includes('ExpandedHuddlePost')){
      this.expandedPost = this.posts.find(p => p.id == to.params.postId)
      this.expandedPost ? next() : next(false)
    } else if(['HuddlePublic', 'HuddlePrivate'].includes(to.name) && !from.name.includes('ExpandedHuddlePost')){
      this.huddle = this.huddles.find(h => h.slug == to.params.slug)
      this.huddle ? next() : next(false)
    } else if(['HuddlePublic', 'HuddlePrivate'].includes(to.name) && from.name.includes('ExpandedHuddlePost')){
      this.expandedPost = null
      this.fetchPosts()
      next()
    } else {
      next()
    }
  },
  computed: {
    displayedPosts(){
      return this.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
    isMember(){
      return this.huddle && this.memberIds.includes(this.user.id)
    },
    members(){
      return this.users.filter(u => this.memberIds.includes(u.id))
    },
    showCreatePost(){
      return this.$route.name.includes('CreatePost')
    },
    showExpandedPost(){
      return this.$route.name.includes('ExpandedHuddlePost') && this.expandedPost !== null
    }
  },
  methods: {
    async joinGroup(){
      if(this.isPublic && this.user){
        const newMember = this.$gun.get(`${gunPrefix}:huddles/${this.huddle.id}`).get('members').set({ id: this.user.id })
        this.user.publicHuddles.push(this.huddle.id)
        const newPublicHuddles = JSON.stringify(this.user.publicHuddles)
        await blockstack.putFile('publicHuddles.json', newPublicHuddles, { encrypt : false })
        this.fetchMembers()
        this.fetchPosts()
      }
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
      if(this.isPublic && this.users){
        this.postFragments = []
        this.$gun.get(`${gunPrefix}:huddles/${this.huddle.id}`).get('posts').map().on(post => {
          this.postFragments.push(post)
          this.postFragments = Array.from(new Set(this.postFragments))
        })
      } else {
        
      }
    }
  },
  mounted(){
    
  },
  watch: {
    $route(value){

    },
    huddle(newValue, oldValue) {
      this.fetchMembers()
      this.fetchPosts()
    },
    postFragments(value){
      let posts = []
      value.forEach(async f => {
        if(f.u == this.user.id){
          posts.push(this.user.publicPosts.find(p => p.id == f.id))
        } else {
          console.log(this.users.find(u => u.id == f.u).bi)
          blockstack.getFile(`/publicPosts/${f.id}.json`, {
            decrypt: false,
            app: window.location.origin,
            username: this.users.find(u => u.id == f.u).bi
          }).then(file => {
            console.log(file)
          }).catch(err => {
            console.log(err)
          })
        }
      })
      this.posts = posts
    }
  },
}
</script>

<style lang="stylus" scoped>

</style>
