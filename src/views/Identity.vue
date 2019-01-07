<template>
  <div class="home w-full relative flex-grow" v-if="identity">
    <div class="w-full bg-black relative canvas">
      <!-- <div class="overlay absolute pin z-auto" :style="bgColor"></div> -->
      <div class="container flex justify-center items-center">
        <div class="flex justify-center items-center flex-col py-20 my-12">
          <h1 class="text-4xl text-white font-light max-w-sm text-center mb-8 flex z-50">
            {{ identity.username }}
          </h1>
        </div>
      </div>
    </div>
    <div class="container flex">
      <div class="w-full flex justify-between z-50 mx-auto max-w-xl">
        <!-- <div class="w-120 mt-8 mr-4 md:flex md:flex-col hidden">
          <div class="rounded-lg shadow p-6 bg-white w-full mb-4">
            <p class="text-black font-light mb-4">Description</p>
            <p class="text-grey-darkest leading-normal font-light break">{{ identity.description }}</p>
          </div>
        </div> -->
        <div class="w-full flex-grow flex flex-col -mt-12 md:ml-4" v-if="posts.length">
          <huddle-post class="md:mx-0 mx-2" :loaded="false" :post="{}" v-for="num in [1,2,3,4]" :key="num"></huddle-post>
        </div>
        <div class="w-full flex-grow flex flex-col -mt-12 md:ml-4" v-if="!posts.length">
          <div class="rounded-lg shadow py-12 md:mx-0 mx-4 px-8 bg-white md:w-full flex flex-col items-center justify-center cursor-pointer" v-if="!posts.length">
            <img class="px-8 w-96 mb-4" src="../assets/empty-post.svg" alt="Create an identity" width="100%">
            <p class="text-grey-darker text-center md:font-thin md:text-xl font break" >This user hasn't made any posts, yet.</p>
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
import HuddlePost from '@/components/HuddlePost.vue'

export default {
  name: 'Identity',
  store: ['huddles', 'user', 'users'],
  components: { ExpandedHuddlePost, HuddlePost },
  data() {
    return {
      identity: null,
      expandedPost: null,
      posts: [],
      postFragments: []
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
    displayedPosts(){
      return this.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },
    // bgColor(){
    //   return { 
    //     backgroundColor: `hsla(${ this.huddle.hue }, 35%, 27%, .64)`
    //   }
    // },
    // bgImage(){
    //   return { 
    //     backgroundImage: `url('${this.huddle.background}')` 
    //   }
    // },
    showExpandedPost(){
      return this.$route.name.includes('ExpandedHuddlePost') && this.expandedPost !== null
    }
  },
  methods: {
    fetchPosts(){
      if(this.identity){
        
      } else {
        
      }
    }
  },
  mounted(){

  },
  watch: {
    $route(value){

    },
    identity(newValue, oldValue) {
      this.fetchPosts()
    },
    postFragments(value){
      let posts = []
      value.forEach(async f => {
        if(f.u == this.user.id && this.user){
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
