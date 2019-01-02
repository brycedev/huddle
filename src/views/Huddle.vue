<template>
  <div class="home w-full relative" v-if="huddle">
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
            <p class="text-black font-medium mb-2">Description</p>
            <p class="text-grey-darkest leading-normal font-light break">{{ huddle.description }}</p>
          </div>
          <div class="rounded-lg shadow p-4 bg-white w-full mb-4" v-if="isMember">
            <p class="text-black font-normal mb-2">Members</p>
            <div class="w-full flex">
              <div class="flex flex-wrap z-50 overflow-hidden">
                <router-link :to="'/i/' + member.name.replace('.id.blockstack', '')" v-for="member in members" :key="member.id"  class="block no-underline mr-2">
                  <img class="w-8 h-8 rounded-full" :src="member.avatar"/>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full flex-grow flex flex-col -mt-20 md:ml-4">
          <router-link :to="`${$route.fullPath}/new`" class="block no-underline self-end" v-if="isMember">
            <div class="bg-white rounded-full text-black text-center py-2 px-4 cursor-pointer flex items-center mb-4">
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
          <router-link :to="`${$route.fullPath}/post/${post.id}`" v-for="post in tempPosts" class="block md:mx-0 mx-2 no-underline" :key="post.id" v-if="isMember">
            <huddle-post :loaded="true" :post="post"></huddle-post>
          </router-link>
          <router-link :to="`${$route.fullPath}/post/${post.id}`" v-for="post in tempPosts.slice(0,2)" class="block md:mx-0 mx-2 no-underline" :key="post.id" v-if="!isMember">
            <huddle-post :loaded="true" :post="post"></huddle-post>
          </router-link>
          <huddle-post class="md:mx-0 mx-2" :loaded="false" :post="{}" v-for="num in [1,2,3,4]" :key="num" v-if="!isMember">
            
          </huddle-post>
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
      posts: []
    }
  },
  beforeMount(){
    const isPrivate = this.$route.fullPath.includes('/p/')
    if(isPrivate){
      const huddle = this.huddles.find(h => h.id == this.$route.params.id)
      if(!huddle){
        const superHiddenHuddle = this.user.privateGroups.find(h => h == this.$route.params.id)
        if(!superHiddenHuddle){
          this.$router.push('/')
        } else {
          this.huddle = huddle
        }
      } else {
        this.huddle = huddle
      }
    } else {
      const huddle = this.huddles.find(h => h.slug == this.$route.params.slug)
      if(!huddle) this.$router.push('/')
      else this.huddle = huddle
    }
    
  },
  beforeRouteEnter (to, from, next) {
    if(to.name.includes('ExpandedHuddlePost')){
      next(vm => {
        vm.expandedPost = { id: to.params.postId, content: `This thing comes fully loaded. AM/FM radio, reclining bucket seats, and... power windows. Hey, you know how I'm, like, always trying to save the planet? Here's my chance. God help us, we're in the hands of engineers. Eventually, you do plan to have dinosaurs on your dinosaur tour, right?`, user: {} }
        document.getElementById('body').style.overflowY = 'hidden'
        vm.expandedPost ? next() : next(false)
      })
    } else if(to.name.includes('CreatePost')){
      next(vm => {
        document.getElementById('body').style.overflowY = 'hidden'
      })
    } else {
      next()
    }
  },
  beforeRouteUpdate (to, from, next) {
    if(to.name.includes('ExpandedHuddlePost')){
      this.expandedPost = this.tempPosts.find(p => p.id == to.params.postId)
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
    tempPosts(){
      return Array.from(Array(20), (x, index) => index).map(i => {
        return { id: uuid(), content: `This thing comes fully loaded. AM/FM radio, reclining bucket seats, and... power windows. Hey, you know how I'm, like, always trying to save the planet? Here's my chance. God help us, we're in the hands of engineers. Eventually, you do plan to have dinosaurs on your dinosaur tour, right?`, user: this.user }
      })
    },
    members(){
      return this.users.filter(u => this.memberIds.includes(u.id))
    },
    showCreatePost(){
      return this.$route.name.includes('CreatePost')
    },
    showExpandedPost(){
      return this.$route.name.includes('ExpandedHuddlePost') && this.expandedPost
    }
  },
  methods: {
    async joinGroup(){
      if(this.isPublic && this.user){
        const newMember = this.$gun.get(`${gunPrefix}:huddles/${this.huddle.id}`).get('members').put({ id: this.user.id })
        this.user.publicGroups.push(this.huddle.id)
        const newPublicGroups = JSON.stringify(this.user.publicGroups)
        await blockstack.putFile('publicGroups.json', newPublicGroups, { encrypt : false })
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
        this.memberIds = Array.from(new Set(members))
      } else {
        this.memberIds = []
      }
    },
    fetchPosts(){
      if(this.isPublic){
        let postIds = []
        this.$gun.get(`${gunPrefix}:huddles/${this.huddle.id}`).get('posts').map().on(post => {
          console.log(post)
          // postIds.push(post.id)
        })
        this.postIds = Array.from(new Set(postIds))
      } else {
        this.posts = []
      }
    }
  },
  mounted(){
    this.fetchMembers()
    this.fetchPosts()
  },
  watch: {
    huddle(newValue, oldValue) {
      this.fetchMembers()
    }
  },
}
</script>

<style lang="stylus" scoped>

</style>
