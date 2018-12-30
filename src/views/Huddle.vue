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
        <div class="w-120 mt-8 mr-4 flex flex-col">
          <div class="rounded-lg shadow p-6 bg-white w-full mb-4">
            <p class="text-black font-medium mb-2">Description</p>
            <p class="text-grey-darkest leading-normal font-light break">{{ huddle.description }}</p>
          </div>
          <div class="rounded-lg shadow p-4 bg-white w-full mb-4">
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
        <div class="w-full flex-grow flex flex-col -mt-20 ml-4">
          <router-link :to="`${$route.fullPath}/new`" class="block no-underline self-end">
            <div class="bg-white rounded-full text-black text-center py-2 px-4 cursor-pointer flex items-center mb-4">
              <img src="../assets/plus-dark.svg" alt="" class="w-4 h-4 mr-2">
              <span>Create Post</span>
            </div>
          </router-link>
          
          <router-link :to="`${$route.fullPath}/post/${post.id}`" v-for="post in posts" class="block no-underline mr-2" :key="post.id">
            <huddle-post :loaded="true" :post="post"></huddle-post>
          </router-link>
        </div>
      </div>
    </div>
    <router-view></router-view>
    <portal to="modal">
      <expanded-huddle-post :post="expandedPost" :visible="showExpandedPost"></expanded-huddle-post>
      <create-post :visible="showCreatePost"></create-post>
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
      expandedPost: null
    }
  },
  beforeMount(){
    const huddle = this.huddles.find(h => h.slug == this.$route.params.slug)
    if(!huddle) this.$router.push('/')
    else this.huddle = huddle
  },
  beforeRouteEnter (to, from, next) {
    if(to.name == 'ExpandedHuddlePost'){
      next(vm => {
        vm.expandedPost = { id: to.params.id, content: `This thing comes fully loaded. AM/FM radio, reclining bucket seats, and... power windows. Hey, you know how I'm, like, always trying to save the planet? Here's my chance. God help us, we're in the hands of engineers. Eventually, you do plan to have dinosaurs on your dinosaur tour, right?`, user: vm.user }
        document.getElementById('body').style.overflow = 'hidden'
        vm.expandedPost ? next() : next(false)
      })
    } else if(to.name == 'CreatePost'){
      next(vm => {
        document.getElementById('body').style.overflow = 'hidden'
      })
    } else {
      next()
    }
  },
  beforeRouteUpdate (to, from, next) {
    if(to.name == 'ExpandedHuddlePost'){
      this.expandedPost = this.posts.find(p => p.id == to.params.id)
      this.expandedPost ? next() : next(false)
    } else if(to.name == 'Huddle' && from.name !== 'ExpandedHuddlePost'){
      this.huddle = this.huddles.find(h => h.slug == to.params.slug)
      this.huddle ? next() : next(false)
    } else if(to.name == 'Huddle' && from.name == 'ExpandedHuddlePost'){
      this.expandedPost = null
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
    posts(){
      return Array.from(Array(20), (x, index) => index).map(i => {
        return { id: uuid(), content: `This thing comes fully loaded. AM/FM radio, reclining bucket seats, and... power windows. Hey, you know how I'm, like, always trying to save the planet? Here's my chance. God help us, we're in the hands of engineers. Eventually, you do plan to have dinosaurs on your dinosaur tour, right?`, user: this.user }
      })
    },
    members(){
      return this.users
    },
    showCreatePost(){
      return this.$route.name == 'CreatePost'
    },
    showExpandedPost(){
      return this.$route.name == 'ExpandedHuddlePost' && this.expandedPost
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
