<template>
  <div class="home w-full relative">
    <div class="w-full bg-black relative canvas">
      <div class="container flex justify-center items-center sm:px-0 px-6">
        <div class="flex justify-center items-center flex-col py-20 my-20">
          <h1 class="text-4xl text-white font-light max-w-sm text-center mb-8">It's time to take back control of your group's data.</h1>
          <div class="flex flex-col sm:flex-row justify-center items-center">
            <router-link to="/huddles/new" class="block no-underline sm:mr-4 sm:mb-0 mb-4">
              <div class="bg-white rounded-full text-black text-center py-2 px-4">Create a Huddle</div>
            </router-link>
            <div class="bg-blue rounded-full text-white text-center py-2 px-4 cursor-pointer">Transfer from FB</div>
          </div>
        </div>
      </div>
    </div>
    <div class="container flex -mt-20 sm:px-0 px-6">
      <div class="w-full">
        <div class="flex flex-wrap">
          <div class="w-full md:w-1/2 xl:w-1/3 mb-4 px-2" v-for="huddle in publicHuddles" :key="huddle.id">
            <router-link :to="'/h/' + huddle.slug" class="block w-full block no-underline">
              <huddle-entry :huddle="huddle"></huddle-entry>
            </router-link>
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
    publicHuddles(){
      return this.huddles.filter(h => h.isApproved && h.type == 'public')
    }
  },
  mounted(){
    // if(!this.user) window.location.replace('/')
  }
}
</script>

<style lang="stylus" scoped>
.canvas 
  background-image: url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%23ffffff' fill-opacity='0.047' fill-rule='evenodd'/%3E%3C/svg%3E");
</style>
