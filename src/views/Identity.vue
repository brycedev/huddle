<template>
  <div class="home w-full relative flex-grow" v-if="identity">
    <div class="w-full bg-black relative" :style="bgImage" :class="{ 'centercenter' : bgImage !== {}, 'canvas' : bgImage == {}}">
      <div class="overlay absolute pin z-auto" :style="bgColor"></div>
      <div class="container flex justify-center items-center">
        <div class="flex justify-center items-center flex-col py-20 my-12">
          <h1 class="text-4xl text-white font-light max-w-sm text-center mb-8 flex z-50">
            {{ identity.username }}
          </h1>
        </div>
      </div>
    </div> 
    <div class="container flex">
      <div class="w-full max-w-xl mx-auto justify-between flex">
        <div class="w-120 mt-8 md:block hidden md:mr-4">
          <div class="rounded-lg shadow p-6 bg-white w-full mb-4">
            <p class="text-black font-light mb-4">Description</p>
            <p class="text-grey-darkest leading-normal font-light break" v-if="profile && profile.description && profile.description !== ''">{{ profile.description.slice(0, 200) }}</p>
            <p class="text-grey-dark py-2 leading-normal" v-else>This user hasn't added a description to their profile, yet.</p>
          </div>
          <div class="rounded-lg shadow p-6 bg-white w-full mb-4">
            <p class="text-black font-light mb-4">Huddles</p>
            <div class="flex flex-col">
             <router-link :to="'/h/' + huddle.slug" v-for="huddle in displayedHuddles" :key="huddle.id"  class="block w-full block no-underline" v-if="displayedHuddles.length">
                <huddle-entry class="mb-4" :huddle="huddle" :full="false"></huddle-entry>
              </router-link>
              <p class="text-grey-dark py-2 leading-normal" v-if="!displayedHuddles.length">This user doesn't belong to any huddles, yet.</p>
            </div>
          </div>
        </div>
        <div class="w-full flex-grow flex-col -mt-24 md:ml-4 z-50">
          <div class="w-full self-center text-black text-center py-2 px-4 md:px-0 flex items-center mb-2 h-12">
            <div class="sm:flex-grow hidden sm:flex">
              <div class="flex">
                <div class="flex -mb-px mr-6 cursor-pointer">
                  <p class="no-underline flex items-center text-white hover:opacity-100 opacity-75" :class="{ 'opacity-100' : feed == 0 }" @click="feed = 0"><img src="../assets/save-white.svg" alt="" width="16"><span class="ml-2 text-sm ">Library</span>
                  </p>
                </div>
                <div class="flex -mb-px cursor-pointer">
                  <p class="no-underline flex items-center text-white hover:opacity-100 opacity-75" :class="{ 'opacity-100' : feed == 1 }" @click="feed = 1">
                   <img src="../assets/hourglass.svg" alt="" width="10"><span class="ml-2 text-sm ">Posts</span>
                  </p>
                </div>
              </div>
            </div>
            <router-link :to="'/i/' + user.username + '/edit'" class="block self-end block no-underline mr-4 md:mr-0" v-if="isOwn">
              <div class="bg-white rounded-full text-black text-center py-2 px-4 cursor-pointer flex items-center">
                <img src="../assets/request-invite-dark.svg" alt="" class="w-4 h-4 mr-2">
                <span>Edit Profile</span>
              </div>
            </router-link>
          </div>
          <div class="rounded-lg shadow py-12 md:mx-0 mx-4 px-8 bg-white md:w-full flex flex-col items-center justify-center cursor-pointer" v-if="!displayedPosts.length && feed == 1">
            <p class="text-grey-darker text-center md:font-thin md:text-xl font break mb-4" >This user hasn't made any posts, yet.</p>
            <img class="px-8 w-96" src="../assets/empty-post.svg" alt="Create an identity" width="100%">
            
          </div>
          <div class="w-full" v-if="displayedPosts.length && feed == 1">        
            <router-link :to="`/h/${huddles.find(h => h.id == post.huddle).slug}/post/${post.id}`" v-for="post in displayedPosts" class="block md:mx-0 mx-2 no-underline" :key="post.id">
            <huddle-post :loaded="true" :post="post"></huddle-post>
          </router-link>
          </div>
          <div class="rounded-lg shadow py-12 md:mx-0 mx-4 px-8 bg-white md:w-full flex flex-col items-center justify-center cursor-pointer" v-if="!saves.length && feed == 0">
            <p class="text-grey-darker text-center md:font-thin md:text-xl font break mb-4">This user hasn't saved any posts, yet.</p>
            <img class="px-8 w-96" src="../assets/empty-post.svg" alt="Create an identity" width="100%">
            
          </div>
          <div class="w-full" v-if="saves.length && feed == 0">        
            <router-link :to="`/h/${huddles.find(h => h.id == post.huddle).slug}/post/${post.id}`" v-for="post in saves" class="block md:mx-0 mx-2 no-underline" :key="post.id">
            <huddle-post :loaded="true" :post="post"></huddle-post>
          </router-link>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
    <portal to="modal">
      <expanded-huddle-post :post="expandedPost" :visible="showExpandedPost"></expanded-huddle-post>
    </portal>
  </div>
</template>

<script>
import ExpandedHuddlePost from '@/components/ExpandedHuddlePost.vue'
import HuddleEntry from '@/components/HuddleEntry.vue'
import HuddlePost from '@/components/HuddlePost.vue'

export default {
  name: 'Identity',
  store: ['huddles', 'user', 'users'],
  components: { ExpandedHuddlePost, HuddleEntry, HuddlePost },
  metaInfo(){
    return this.identity ? {
      title: `${this.identity.username} | Huddle`,
      meta: [
        {
          'property': 'og:title',
          'content': `${this.identity.username}'s profile on Huddle`,
        }
      ]
    } : { }
  },
  data() {
    return {
      profile: null,
      identity: null,
      expandedPost: null,
      personHuddles: [],
      posts: [],
      saves: [],
      saveFragments: [],
      feed: 1
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.identity = vm.users.find(h => h.username == to.params.username)
      if(to.name.includes('ExpandedHuddlePost')){
        setTimeout(() => {
          vm.expandedPost = vm.posts.find(p => p.id == to.params.postId)
          document.getElementById('body').style.overflowY = 'hidden'
          if(!vm.expandedPost) vm.$router.push(`/i/${to.params.username}`)
        }, 1200)
      } else {
        document.getElementById('body').style.overflowY = 'auto'
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    if(to.name.includes('ExpandedHuddlePost')){
      this.expandedPost = this.posts.find(p => p.id == to.params.postId)
      this.expandedPost ? next() : next(false)
    } else if(['Identity'].includes(to.name) && !from.name.includes('ExpandedHuddlePost')){
      this.identity = this.users.find(h => h.username == to.params.username)
      this.identity ? next() : next(false)
    } else if(['Identity'].includes(to.name) && from.name.includes('ExpandedHuddlePost')){
      this.expandedPost = null
      this.fetchPosts()
      next()
    } else {
      next()
    }
  },
  computed: {
    isOwn(){
      return this.user && this.identity && this.user.id == this.identity.id
    },
    displayedPosts(){
      return Array.from(new Set(this.posts)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },
    displayedHuddles(){
      return this.huddles.filter(h => this.personHuddles.includes(h.id))
    },
    bgColor(){
      return this.profile ? { 
        backgroundColor: `hsla(${ this.profile.hue }, 35%, 27%, .64)`
      } : { }
    },
    bgImage(){
      return this.profile 
        ? this.profile.background !== ''
          ? { backgroundImage: `url('${this.profile.background}')` } 
          : { } 
        : { }
    },
    showExpandedPost(){
      return this.$route.name.includes('ExpandedHuddlePost') && this.expandedPost !== null
    }
  },
  methods: {
    fetchHuddles(){
      if(this.identity){
        this.postFragments = []
        blockstack.getFile(`publicHuddles.json`, {
          decrypt: false,
          app: window.location.origin,
          username: this.users.find(u => u.id == this.identity.id).bi
        }).then(file => {
          this.personHuddles = JSON.parse(file)
        }).catch(err => {
          console.log(err)
        })        
      }
    },
    fetchProfile(){
      if(this.identity){
        blockstack.getFile(`profile.json`, {
          decrypt: false,
          app: window.location.origin,
          username: this.users.find(u => u.id == this.identity.id).bi
        }).then(file => {
          this.profile = JSON.parse(file)
        })
        .catch(err => {
          console.log(err)
        })      
      }
    },
    fetchSaves(){
      if(this.identity){
        this.saveFragments = []
        blockstack.getFile(`publicLibrary.json`, {
          decrypt: false,
          app: window.location.origin,
          username: this.users.find(u => u.id == this.identity.id).bi
        }).then(file => {
          const allLibrary = JSON.parse(file)
          allLibrary.forEach(l => {
            this.$gun.get(`${gunPrefix}:huddles/${l.h}`).get('posts').map().on(post => {
              if(post.id == l.p){
                this.saveFragments.push(post)
                this.saveFragments = Array.from(new Set(this.saveFragments))
              }
            })
          })
        })
        .catch(err => {
          console.log(err)
        })        
      }
    },
    fetchPosts(){
      if(this.identity){
        this.postFragments = []
        blockstack.getFile(`publicPosts.json`, {
          decrypt: false,
          app: window.location.origin,
          username: this.users.find(u => u.id == this.identity.id).bi
        }).then(file => {
          const allPosts = JSON.parse(file)
          allPosts.forEach(p => {
            blockstack.getFile(`publicPosts/${p.id}.json`, {
              decrypt: false,
              app: window.location.origin,
              username: this.users.find(u => u.id == this.identity.id).bi
            }).then(post => {
              this.posts.push(JSON.parse(post))
            }).catch(err => {
              console.log(err)
            })
          })
        }).catch(err => {
          console.log(err)
        })        
      }
    }
  },
  mounted(){
  
  },
  watch: {
    $route(value){

    },
    identity(newValue, oldValue) {
      this.fetchProfile()
      this.fetchHuddles()
      this.fetchPosts()
      this.fetchSaves()
    },
    saveFragments(value){
      let saves = []
      value.forEach(async f => {
        if(f.u == this.user.id && this.user){
          saves.push(this.user.publicPosts.find(p => p.id == f.id))
        } else {
          blockstack.getFile(`publicPosts/${f.id}.json`, {
            decrypt: false,
            app: window.location.origin,
            username: this.users.find(u => u.id == f.u).bi
          }).then(save => {
            saves.push(JSON.parse(save))
          }).catch(err => {
            console.log(err)
          })
        }
      })
      this.saves = saves
    }
  },
}
</script>

<style lang="stylus" scoped>

</style>
