<template>
  <div class="home max-w-full relative overflow-hidden">
    <div class="w-full bg-black relative canvas">
      <div class="container flex">
        <div class="flex flex-col py-20 my-12 mt-20 mx-4">
          <h1 class="text-4xl text-white font-light max-w-sm text-left mb-4 flex z-50">
            Social media made for you.
          </h1>
          <h2 class="text-2xl leading-normal text-white font-thin max-w-sm text-left flex z-50">
            Escape prying eyes and constant noise with communities you value most.
          </h2>
        </div>
      </div>
    </div>
    <div class="container flex">
      <div class="w-full -mt-12 flex justify-between z-50">
        <div class="rounded-lg w-1/3 shadow p-6 bg-white w-full mx-4 h-64 flex flex-col items-center justify-center">
          <h2 class="text-grey-darkest font-normal mb-4">Privacy</h2>
          <p class="text-grey-darkest leading-normal font-light break">
            Hey, you know how I'm, like, always trying to save the planet? Here's my chance. Hey, you know how I'm, like, always trying to save the planet? Here's my chance.
          </p>
        </div>
       <div class="rounded-lg w-1/3 shadow p-6 bg-white w-full mx-4 h-64 flex flex-col items-center justify-center">
          <h2 class="text-grey-darkest font-normal mb-4">Quality</h2>
          <p class="text-grey-darkest leading-normal font-light break">
            Hey, you know how I'm, like, always trying to save the planet? Here's my chance. Hey, you know how I'm, like, always trying to save the planet? Here's my chance.
          </p>
        </div>
        <div class="rounded-lg w-1/3 shadow p-6 bg-white w-full mx-4 h-64 flex flex-col items-center justify-center">
          <h2 class="text-grey-darkest font-normal mb-4">Knowledge</h2>
          <p class="text-grey-darkest leading-normal font-light break">
            Hey, you know how I'm, like, always trying to save the planet? Here's my chance. Hey, you know how I'm, like, always trying to save the planet? Here's my chance.
          </p>
        </div>
        <!-- <div class="rounded-lg w-1/4 shadow p-4 bg-white w-full mx-4 h-64"></div> -->
      </div>
    </div>
    <div class="w-full bg-white mt-8">
      <div class="container flex justify-center">
        <div class="flex flex-col justify-center items-center py-12">
          <h1 class="text-3xl font-light max-w-sm">
            We're here to listen.
          </h1>
          <p class="text-lg text-grey-darkest font-normal leading-normal max-w-sm text-center my-6">
            Huddle is built with you in mind. Subscribe to give your feedback and know when we launch new features.
          </p>
          <div class="w-full relative rounded-full overflow-hidden" id="app">
            <input id="email" name="email" type="email" class="block appearance-none text-black py-4 px-4 w-full bg-khak-grey outline-none text-md" placeholder="Enter your email address"/>
              <button type="submit" class="outline-none focus:outline-none w-16 absolute pin-t pin-b pin-r rounded-tr-full rounded-br-full flex items-center justify-center bg-blue cursor-pointer">
                <img src="../assets/arrow-r.svg" width="22">
              </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HuddleEntry from '@/components/HuddleEntry.vue'
import ProposedEntry from '@/components/ProposedEntry.vue'

export default {
  name: 'Discover',
  store: ['huddles', 'user'],
  components: { HuddleEntry, ProposedEntry  },
  computed: {
    publicHuddles(){
      return this.huddles.filter(h => h.isApproved && h.type == 'public')
    },
    proposedHuddles(){
      return this.huddles.filter(h => h.isProposed).slice(0,3)
    }
  },
  mounted(){
    // if(!this.user) window.location.replace('/')
  }
}
</script>
