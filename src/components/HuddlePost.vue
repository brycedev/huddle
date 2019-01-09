<template>
  <div class="rounded-lg shadow p-6 bg-white md:w-full mb-4 cursor-pointer">
    <shimmer v-if="!loaded"></shimmer>
    <div class="w-full flex flex-col relative" v-else>
      <div class="overlay absolute pin"></div>
      <div class="flex items-center mb-2" v-if="post.user">
        <img class="w-8 h-8 rounded-full mr-2" :src="post.user.avatar"/>
        <h4 class="font-normal text-black">{{ post.user.username.replace('.id.blockstack','') }}</h4>
      </div>
      <div class="flex w-full justify-between mb-6">
        <div class="flex flex-col flex-grow w-full">
          <div class="flex items-center mb-2 w-full" v-if="postUser">
            <img class="w-6 h-6 rounded-full mr-2" :src="postUser.avatar"/>
            <h3 class="font-normal text-black text-lg tracking-wide">{{ postUser.username.replace('.id.blockstack','') }}</h3>
          </div>
          <p class="text-grey-darkest font-light text-xs pt-1 tracking-wide">Post Creation : {{ postDate }}</p>
        </div>
        <div class="flex ml-2">
          <img src="../assets/save.svg" alt="" class="cursor-pointer w-5 h-5 ml-2 opacity-75 hover:opacity-90 subtle">
          <span class="pl-1 text-grey-darkest">{{ saves.length }}</span>
        </div>
      </div>
      <div>
        <p class="text-grey-darkest leading-loose break">{{ post.content.slice(0,360) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Shimmer from '@/components/Shimmer'

export default {
  name: 'HuddlePost',
  props: ['loaded', 'post'],
  store: ['user', 'users'],
  components: { Shimmer },
  data() {
    return {
      saves: []
    }
  },
  computed: {
    postUser(){
      return this.post && this.users
        ? this.users.find(u => u.id == this.post.u)
        : false
    },
    postDate(){
      return this.post 
        ? new Date(this.post.createdAt).toLocaleTimeString()
        : (new Date()).toLocaleTimeString() 
    }
  },
  methods: {
    fetchSaves(){
      this.$gun.get(`${gunPrefix}:posts/${this.post.id}`).get('saves').map().on(save => {
        this.saves.push(save)
        this.saves = Array.from(new Set(this.saves.filter(s => s !== null)))
      })
    }
  },
  mounted(){
    this.fetchSaves()
  },
  watch: {
    user(){
      if(this.loaded && this.post) this.fetchSaves()
    }
  }
}
</script>

<style lang="stylus" scoped>
.overlay
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(254,254,254,0) 0%, rgba(255,255,255,.97) 97%);
</style>
