<template>
  <div class="home w-full relative flex-grow">
    <div class="w-full bg-black relative canvas">
      <div class="container flex justify-center items-center sm:px-0 px-6">
        <div class="flex flex-col py-24 my-16 mt-16 mx-4 w-full">
          <h1 class="text-4xl text-white font-light flex-wrap md:w-full md:max-w-lg max-w-sm justify-center self-center mb-4 flex z-50 leading-normal text-center mb-8">
            Welcome back, {{ user.username }}
          </h1>
          <div class="flex flex-col md:flex-row justify-center items-center">
            <router-link to="/huddles/new" class="no-underline flex z-50 md:mr-4 mb-4 md:mb-0">
              <div class="bg-huddle-blue rounded-full text-white text-center py-2 px-4 text-md cursor-pointer">Create A Huddle</div>
            </router-link>
            <!-- <div class="bg-white rounded-full text-black text-center py-2 px-4 text-md cursor-pointer z-50">Invite A Friend</div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="container flex -mt-20 sm:px-0 px-6" v-if="!user">
      <div class="w-full">
        <div class="flex flex-wrap">
          <div class="w-full md:w-1/2 xl:w-1/3 mb-4 px-2" v-for="huddle in displayedHuddles" :key="huddle.id">
            <router-link :to="'/h/' + huddle.slug" class="block w-full block no-underline">
              <huddle-entry :huddle="huddle"></huddle-entry>
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
      <div class="w-full justify-between flex">
        <div class="w-full flex-grow flex-col -mt-12 md:mr-4 z-50">
          <div class="flex flex-wrap">        
            <div class="w-full lg:w-1/2 mb-4 px-2" v-for="huddle in myHuddles" :key="huddle.id">
              <router-link :to="'/h/' + huddle.slug" class="block w-full no-underline">
                <huddle-entry :huddle="huddle"></huddle-entry>
              </router-link>
            </div>          
          </div>
        </div>
        <div class="w-120 mt-8 md:block hidden">
          <div class="rounded-lg shadow p-4 bg-white w-full mb-4">
            <p class="text-center text-black font-light mb-4">Your Library</p>
            <div class="flex flex-col">
             
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HuddleEntry from '@/components/HuddleEntry.vue'

export default {
  name: 'home',
  store: ['huddles', 'user'],
  components: {
    HuddleEntry
  },
  computed: {
    myHuddles(){
      return this.publicHuddles.filter(h => this.user.publicGroups.includes(h.id))
    },
    publicHuddles(){
      return this.huddles.filter(h => h.isApproved && h.type == 'public')
    },
    bgColor(){
      return { backgroundColor: `hsla(4, 35%, 27%, .64)` }
    },
  },
  beforeMount(){
    document.getElementById('body').style.overflow = 'auto'
  }
}
</script>

<style lang="stylus" scoped>
.canvas 
  background-image: url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%23ffffff' fill-opacity='0.047' fill-rule='evenodd'/%3E%3C/svg%3E");
</style>
