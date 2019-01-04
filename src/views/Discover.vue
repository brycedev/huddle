<template>
  <div class="home max-w-full relative overflow-hidden">
    <div class="w-full bg-black relative canvas">
      <div class="container flex justify-center items-center">
        <div class="flex justify-center items-center flex-col py-20 my-12">
          <h1 class="text-4xl text-white font-light max-w-sm text-center mb-4 flex z-50">
            Discover
          </h1>
          <p class="text-white text-lg">{{ publicHuddles.length }} Public Communities</p>
        </div>
      </div>
    </div>
    <div class="container flex">
      <div class="w-full justify-between flex">
        <div class="w-full flex-grow flex-col -mt-20 md:mr-4 z-50">
          <div class="w-full self-center text-black text-center py-2 px-4 cursor-pointer flex justify-center items-center mb-4 h-12">
            <div class="sm:flex-grow hidden sm:flex">
              <div class="flex">
                <div class="flex -mb-px mr-6">
                  <router-link to="/discover" class="no-underline flex items-center text-white uppercase hover:opacity-100 opacity-75" active-class="opacity-100">
                   <img src="../assets/hourglass.svg" alt="" width="12"><span class="ml-2 text-sm cursor-pointer">Newest</span>
                  </router-link>
                </div>
                <div class="flex -mb-px mr-6">
                  <router-link to="/discover/active" class="no-underline flex items-center text-white uppercase hover:opacity-100 opacity-75" active-class="opacity-100">
                    <img src="../assets/fire.svg" alt="" width="12"><span class="ml-2 text-sm cursor-pointer">Active</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap">        
            <div class="w-full lg:w-1/2 mb-4 px-2" v-for="huddle in publicHuddles" :key="huddle.id">
              <router-link :to="'/h/' + huddle.slug" class="block w-full no-underline">
                <huddle-entry :huddle="huddle"></huddle-entry>
              </router-link>
            </div>          
          </div>
        </div>
        <div class="w-120 mt-8 md:block hidden">
          <div class="rounded-lg shadow p-4 bg-white w-full mb-4">
            <p class="text-center text-black font-light mb-4">Proposed Huddles</p>
            <div class="flex flex-col">
              <router-link :to="'/discover/vote/' + huddle.id" v-for="huddle in proposedHuddles" :key="huddle.id"  class="block w-full block no-underline">
                <proposed-entry class="mb-4" :huddle="huddle"></proposed-entry>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <portal to="modal">
      <proposed-vote :huddle="expanded" :visible="showProposedVote"></proposed-vote>
    </portal>
  </div>
</template>

<script>
import HuddleEntry from '@/components/HuddleEntry.vue'
import ProposedEntry from '@/components/ProposedEntry.vue'
import ProposedVote from '@/components/ProposedVote.vue'

export default {
  name: 'Discover',
  store: ['huddles', 'user'],
  data() {
    return {
      expanded: null
    }
  },
  components: { HuddleEntry, ProposedEntry, ProposedVote  },
  computed: {
    publicHuddles(){
      return this.huddles.filter(h => h.isApproved && h.type == 'public')
    },
    proposedHuddles(){
      return this.huddles.filter(h => h.isProposed).slice(0,3)
    },
    showProposedVote(){
      return this.$route.name == ('ProposedVote') && this.expanded !== null
    }
  },
  beforeRouteEnter (to, from, next) {
    if(to.name == 'ProposedVote'){
      next(vm => {
        vm.expanded = vm.proposedHuddles.find(h => h.id == to.params.id)
        document.getElementById('body').style.overflowY = 'hidden'
        vm.expanded ? next() : next(false)
      })
    } else {
      document.getElementById('body').style.overflowY = 'auto'
      next()
    }
  },
  beforeRouteUpdate (to, from, next) {
    if(to.name.includes('ProposedVote')){
      this.expanded = this.proposedHuddles.find(h => h.id == to.params.id)
      this.expanded ? next() : next(false)
    } else if(to.name == 'Discover' && from.name == 'ExpandedHuddlePost'){
      this.expanded = null
      next()
    } else {
      next()
    }
  },
  mounted(){

  }
}
</script>
