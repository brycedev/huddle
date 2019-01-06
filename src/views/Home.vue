<template>
  <div class="home w-full relative flex-grow">
    <div class="w-full bg-black relative canvas">
      <div class="container flex justify-center items-center sm:px-0 px-6">
        <div class="flex flex-col py-24 my-16 mt-16 mx-4 w-full" v-if="!user">
          <h1 class="text-4xl text-white font-light flex-wrap md:w-full md:max-w-lg max-w-sm justify-center self-center mb-4 flex z-50 leading-normal text-center mb-8">
            Communicate freely knowing you can’t be monitored or censored.
          </h1>
          <div class="flex flex-col md:flex-row justify-center items-center">
            <router-link to="/about" class="no-underline flex z-50 md:mr-4 mb-4 md:mb-0">
              <div class="bg-huddle-blue rounded-full text-white text-center py-2 px-4 text-md cursor-pointer">Learn More</div>
            </router-link>
            <div class="bg-white rounded-full text-black text-center py-2 px-4 text-md cursor-pointer z-50" @click="$parent.signIn">Create Profile</div>
          </div>
        </div>
        <div class="flex flex-col py-24 my-16 mt-16 mx-4 w-full" v-if="user">
          <h1 class="text-4xl text-white font-light flex-wrap md:w-full md:max-w-lg max-w-sm justify-center self-center mb-4 flex z-50 leading-normal text-center mb-8 break">
            Welcome back, {{ user.username }}
          </h1>
          <div class="flex flex-col md:flex-row justify-center items-center">
            <router-link to="/huddles/new" class="no-underline flex z-50 md:mr-4 mb-4 md:mb-0">
              <div class="bg-huddle-blue rounded-full text-white text-center py-2 px-4 text-md cursor-pointer">Create A Huddle</div>
            </router-link>
            <router-link :to="`/i/${this.user.username}`" class="no-underline flex z-50 mb-4 md:mb-0">
              <div class="bg-white rounded-full text-black text-center py-2 px-4 text-md cursor-pointer z-50">View Profile</div>
            </router-link>
            
          </div>
        </div>
      </div>
    </div>
    <div class="container flex -mt-20 sm:px-0 px-6" v-show="!user">
      <div class="w-full">
        <div class="flex flex-wrap">
          <div class="w-full md:w-1/2 xl:w-1/3 mb-4 px-2" v-for="huddle in displayedHuddles" :key="huddle.id">
            <router-link :to="'/h/' + huddle.slug" class="block w-full block no-underline">
              <huddle-entry :huddle="huddle" :full="true"></huddle-entry>
            </router-link>
          </div>          
          <div class="w-full md:w-1/2 xl:w-1/3 mb-4 px-2">
            <router-link to="/discover" class="block h-full w-full block no-underline">
              <div class="w-full shadow-md rounded-lg overflow-hidden canvas relative cursor-pointer bg-black h-full">
                <div class="px-6 py-4 flex justify-center h-full items-center z-50 overflow-hidden">
                  <h1 class="font-light text-xl text-white opacity-90">Discover {{ more }} More<span class="ml-4"><img src="../assets/arrow-r.svg" alt="" width="16"></span></h1>
                </div>
              </div>
            </router-link>
          </div>          
        </div>
      </div>
    </div>
    <div class="container flex" v-if="user">
      <div class="w-full max-w-xl mx-auto justify-between flex">
        <div class="w-full flex-grow flex-col -mt-24 md:mr-4 z-50">
          <div class="w-full self-center text-black text-center py-2 px-4 flex justify-center items-center mb-2 h-12">
            <div class="sm:flex-grow hidden sm:flex">
              <div class="flex">
                <div class="flex -mb-px mr-6">
                  <p class="no-underline flex items-center text-white hover:opacity-100 opacity-75" :class="{ 'opacity-100' : feed == 0 }" @click="feed = 0">
                   <img src="../assets/save-white.svg" alt="" width="16"><span class="ml-2 text-sm cursor-pointer">My Library</span>
                  </p>
                </div>
                <div class="flex -mb-px">
                  <p class="no-underline flex items-center text-white hover:opacity-100 opacity-75" :class="{ 'opacity-100' : feed == 1 }" @click="feed = 1">
                   <img src="../assets/hourglass.svg" alt="" width="10"><span class="ml-2 text-sm cursor-pointer">My Timeline</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-lg shadow py-12 md:mx-0 mx-4 px-8 bg-white md:w-full flex flex-col items-center justify-center cursor-pointer" v-if="!posts.length && feed == 1">
            <p class="text-grey-darker text-center md:font-thin md:text-xl font break mb-4" >No posts, yet. Join some huddles, first!</p>
            <img class="px-8 w-96" src="../assets/empty-post.svg" alt="Create an identity" width="100%">
            
          </div>
          <div class="w-full" v-if="posts.length && feed == 1">        
            <router-link :to="`/h/${publicHuddles.find(h => h.id == post.huddle).slug}/post/${post.id}`" v-for="post in displayedPosts" class="block md:mx-0 mx-2 no-underline" :key="post.id">
            <huddle-post :loaded="true" :post="post"></huddle-post>
          </router-link>
          </div>
          <div class="rounded-lg shadow py-12 md:mx-0 mx-4 px-8 bg-white md:w-full flex flex-col items-center justify-center cursor-pointer" v-if="!saves.length && feed == 0">
            <p class="text-grey-darker text-center md:font-thin md:text-xl font break mb-4">No saved posts, yet.</p>
            <img class="px-8 w-96" src="../assets/empty-post.svg" alt="Create an identity" width="100%">
            
          </div>
          <div class="w-full" v-if="saves.length && feed == 0">        
            <router-link :to="`/h/${publicHuddles.find(h => h.id == post.huddle).slug}/post/${post.id}`" v-for="post in saves" class="block md:mx-0 mx-2 no-underline" :key="post.id">
            <huddle-post :loaded="true" :post="post"></huddle-post>
          </router-link>
          </div>
        </div>
        <div class="w-120 mt-8 md:block hidden md:ml-4">
          <!-- <div class="rounded-lg shadow p-6 bg-white w-full mb-6">
            <p class="text-black font-light mb-4">Your Notifications</p>
            <div class="flex flex-col">
             
            </div>
          </div> -->
          <div class="rounded-lg shadow p-6 bg-white w-full mb-4" v-if="myHuddles">
            <p class="text-black font-light mb-4">Your Huddles</p>
            <div class="flex flex-col">
             <router-link :to="'/h/' + huddle.slug" v-for="huddle in myHuddles" :key="huddle.id"  class="block w-full block no-underline">
                <huddle-entry class="mb-4" :huddle="huddle" :full="false"></huddle-entry>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HuddleEntry from '@/components/HuddleEntry.vue'
import HuddlePost from '@/components/HuddlePost.vue'

export default {
  name: 'Home',
  store: ['bus', 'huddles', 'user'],
  components: {
    HuddleEntry, HuddlePost
  },
  data() {
    return {
      postFragments: [],
      saveFragments: [],
      posts: [],
      saves: [],
      feed: 0
    }
  },
  computed: {
    displayedPosts(){
      return this.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },
    displayedHuddles(){
      return this.publicHuddles.slice(0,8)
    },
    myHuddles(){
      return this.user && this.user.publicHuddles
        ? this.publicHuddles.filter(h => this.user.publicHuddles.includes(h.id))
        : []
    },
    publicHuddles(){
      return this.huddles.filter(h => h.isApproved && h.type == 'public')
    },
    bgColor(){
      return { backgroundColor: `hsla(4, 35%, 27%, .64)` }
    },
    more(){
      return this.publicHuddles.length - 8
    }
  },
  beforeMount(){
    document.getElementById('body').style.overflow = 'auto'
  },
  methods: {
    fetchStuff(){
      this.fetchSaves()
      this.fetchPosts()
      // this.myHuddles = this.huddles.filter(h => this.user.publicHuddles.includes(h.id))
    },
    fetchPosts(){
      this.postFragments = []
      const huds = this.myHuddles.map(h => h.id)
      huds.forEach(h => {
        this.$gun.get(`${gunPrefix}:huddles/${h}`).get('posts').map().on(post => {
          this.postFragments.push(post)
          this.postFragments = Array.from(new Set(this.postFragments))
        })
      })
    },
    fetchSaves(){
      if(this.user.publicLibrary){
        this.saveFragments = []
        this.user.publicLibrary.forEach(s => {
          this.$gun.get(`${gunPrefix}:huddles/${s.h}`).get('posts').map().on(post => {
            if(post.id == s.p){
              this.saveFragments.push(post)
              this.saveFragments = Array.from(new Set(this.saveFragments))
            }
          })
        })
      }
    }
  },
  beforeRouteEnter(to, from, next){
    next(vm => {
      if(from) {
        vm.fetchStuff()
      }
    })
  },
  mounted(){
    this.bus.$on('instantiated', () => {
      this.fetchStuff()
    })
  },
  watch: {
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
    },
    saveFragments(value){
      let saves = []
      value.forEach(async f => {
        if(f.u == this.user.id){
          saves.push(this.user.publicPosts.find(p => p.id == f.id))
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
      this.saves = saves
    }
  }
}
</script>

<style lang="stylus" scoped>
.canvas 
  background-image: url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%23ffffff' fill-opacity='0.047' fill-rule='evenodd'/%3E%3C/svg%3E");
</style>
