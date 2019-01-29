<template>
  <div class="home w-full relative flex-grow">
    <div class="w-full bg-black relative canvas">
      <div class="container flex justify-center items-center sm:px-0 px-6">
        <div class="flex flex-col py-24 my-16 mt-16 mx-4 w-full" v-if="user">

        </div>
      </div>
    </div>
    <div class="container flex" v-if="user">
      <div class="w-full max-w-xl mx-auto justify-between flex">
        <div class="w-full flex-grow flex-col -mt-24 md:ml-4 z-50">
          <div class="w-full self-center text-black text-center py-2 px-4 flex justify-center items-center mb-2 h-12">
            <div class="sm:flex-grow hidden sm:flex">
              <div class="flex">
                <div class="flex -mb-px">
                  <p class="no-underline flex items-center text-white hover:opacity-100 opacity-75" :class="{ 'opacity-100' : feed == 0 }" @click="feed = 0">
                   <img src="../assets/hourglass.svg" alt="" width="10"><span class="ml-2 text-sm cursor-pointer">Users</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-lg shadow py-12 md:mx-0 mx-4 px-8 bg-white md:w-full flex flex-col items-center justify-center cursor-pointer" v-if="!displayedUsers.length && feed == 0">
            <div class="w-full mb2 py-4" v-for="user in displayedUsers" :key="user.id">

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
  store: ['bus', 'huddles', 'user', 'users'],
  components: {
    HuddleEntry, HuddlePost
  },
  metaInfo(){
    return {
      title: `Admin | Huddle`,
      meta: [
        {
          'property': 'og:title',
          'content': `Discover Huddles on Huddle!`,
        }
      ]
    }
  },
  data() {
    return {
      feed: 0
    }
  },
  computed: {
    displayedUsers(){
      return this.users
    },
    bgColor(){
      return { backgroundColor: `hsla(4, 35%, 27%, .64)` }
    }
  },
  beforeMount(){
    document.getElementById('body').style.overflow = 'auto'
  },
  methods: {
    
  },
  created(){
    
  },
  mounted(){
   
  },
  watch: {
    $route(){
      
    },
    user(){
      
    }
  }
}
</script>

<style lang="stylus" scoped>
.canvas 
  background-image: url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%23ffffff' fill-opacity='0.047' fill-rule='evenodd'/%3E%3C/svg%3E");
</style>
