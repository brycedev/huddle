<template>
  <div class="home max-w-full relative overflow-hidden -mb-8">
    <div class="w-full bg-black relative canvas">
      <div class="container flex">
        <div class="flex flex-col py-24 my-16 mt-16 mx-4 w-full">
          <h1 class="text-4xl text-white font-light flex-wrap md:w-full md:max-w-lg max-w-sm justify-center md:justify-start md:self-start self-center md:text-left mb-4 flex z-50 leading-normal">
            Social media made for <span class="block md:hidden ml-3">you</span><span class="hidden md:block typi ml-3">you</span>
          </h1>
          <h2 class="text-2xl leading-normal text-white font-thin md:max-w-sm text-center md:text-left flex z-50">
            Escape prying eyes and constant noise with communities you value most.
          </h2>
        </div>
      </div>
    </div>
    <div class="container flex">
      <div class="w-full -mt-12 flex flex-col md:flex-row z-50">
        <div class="rounded-lg h-full  md:w-1/3 md:mb-0 mb-4 shadow p-8 bg-white md:w-full mx-4 flex flex-col items-center justify-center">
          <img class="px-8 h-32 mb-8" src="../assets/security.svg" alt="Huddle offers privacy" width="100%">
          <h2 class="text-grey-darkest font-normal mb-4">Privacy</h2>
          <p class="text-grey-darkest opacity-85 leading-normal font-normal break">
            Hey, you know how I'm, like, always trying to save the planet? Here's my chance. Hey, you know how I'm, like, always trying to save the planet? Here's my chance.
          </p>
        </div>
       <div class="rounded-lg h-full  md:w-1/3 md:mb-0 mb-4 shadow p-8 bg-white md:w-full mx-4 h-64 flex flex-col items-center justify-center">
          <img class="px-8 h-32 mb-8" src="../assets/quality.svg" alt="Huddle offers quality" width="100%">
          <h2 class="text-grey-darkest font-normal mb-4">Quality</h2>
          <p class="text-grey-darkest opacity-85 leading-normal font-normal break">
            Hey, you know how I'm, like, always trying to save the planet? Here's my chance. Hey, you know how I'm, like, always trying to save the planet? Here's my chance.
          </p>
        </div>
        <div class="rounded-lg h-full  md:w-1/3 md:mb-0 mb-4 shadow p-8 bg-white md:w-full mx-4 h-64 flex flex-col items-center justify-center">
          <img class="px-8 h-32 mb-8" src="../assets/knowledge.svg" alt="Huddle offers access to knowledge" width="100%">
          <h2 class="text-grey-darkest font-normal mb-4">Knowledge</h2>
          <p class="text-grey-darkest opacity-85 leading-normal font-normal break">
            Hey, you know how I'm, like, always trying to save the planet? Here's my chance. Hey, you know how I'm, like, always trying to save the planet? Here's my chance.
          </p>
        </div>
      </div>
    </div>
    <div class="w-full bg-white mt-8">
      <div class="container flex justify-center px-6">
        <div class="flex flex-col justify-center items-center py-12">
          <h1 class="text-3xl text-grey-darkest font-normal max-w-sm mb-6">
            How does it work?
          </h1>
          <p class="text-lg text-grey-darkest opacity-85 leading-normal font-normal max-w-md text-center">
            Huddle is a decentralized social network for public and private groups. It is built
            on Blockstack, a solid technical foundation that gives you control over your digital data.
          </p>
          <p class="text-lg text-grey-darkest opacity-85 leading-normal font-normal max-w-md text-center my-6">
            No central entity, like Facebook, can control or sell your data.
          </p>
          <p class="text-lg text-grey-darkest opacity-85 leading-normal font-normal text-center">
            Let's take a closer look
          </p>
        </div>
      </div>
    </div>
    <div class="w-full bg-transparent my-8 py-8">
      <div class="container flex flex-col">
        <div class="flex items-center justify-between w-full mb-8">
          <div class="w-full md:w-1/2 px-8">
            <h1 class="text-3xl text-grey-darkest font-normal mb-4 leading-normal">
            Create your identity
            </h1>
            <p class="text-lg text-grey-darkest opacity-85 leading-normal font-normal mb-2">
            In order to join Huddle, Mark has to create a profile.
            </p>
            <p class="text-lg text-grey-darkest opacity-85 leading-normal font-normal">
            He quickly creates a Blockstack identity and now has access to Huddle and the rest of the Blockstack ecosystem.
            </p>
          </div>
          <div class="md:w-1/2 md:flex items-center justify-center hidden">
            <img class="px-8" src="../assets/identity.svg" alt="Create an identity" width="100%">
          </div>
        </div>
        <div class="flex items-center justify-between w-full mb-8 py-8">
          <div class="md:w-1/2 md:flex items-center justify-center hidden">
            <img class="px-8" src="../assets/mindshare.svg" alt="Find communities and mindshares" width="100%">
          </div>
          <div class="w-full md:w-1/2 px-8">
            <h1 class="text-3xl text-grey-darkest font-normal mb-4 leading-normal">
            Find or create communities
            </h1>
            <p class="text-lg text-grey-darkest opacity-85 leading-normal font-normal mb-2">
            Mark joins a public group about photography and creates a private one for local photographers in his area.
            </p>
            <p class="text-lg text-grey-darkest opacity-85 leading-normal font-normal">
            He doesn't see a public group for new fathers, so he proposes a new one, and the community approves it via vote.
            </p>
          </div>
        </div>
        <div class="flex items-center justify-between w-full mb-8 py-8">
          <div class="w-full md:w-1/2 px-8">
            <h1 class="text-3xl text-grey-darkest font-normal mb-4 leading-normal">
            Recognize and save quality
            </h1>
            <p class="text-lg text-grey-darkest opacity-85 leading-normal font-normal mb-2">
            Mark sends a few claps and comments on a post about new baby lullaby tricks.
            </p>
            <p class="text-lg text-grey-darkest opacity-85 leading-normal font-normal">
            He saves the post to easily find and review it in the future.
            </p>
          </div>
          <div class="md:w-1/2 md:flex items-center justify-center hidden">
            <img class="px-8" src="../assets/girl-laptop.svg" alt="Huddle logo" width="100%">
          </div>
        </div>
        <div class="flex items-center justify-between w-full mb-8 pt-8">
          <div class="md:w-1/2 md:flex items-center justify-center hidden">
            <img class="px-8" src="../assets/group-hangout.svg" alt="Huddle logo" width="100%">
          </div>
          <div class="w-full md:w-1/2 px-8">
            <h1 class="text-3xl text-grey-darkest font-normal mb-4 leading-normal">
            Curate your community, your way
            </h1>
            <p class="text-lg text-grey-darkest opacity-85 leading-normal font-normal mb-2">
            Mark can't relate with the posts made by a particular person in a group.
            </p>
            <p class="text-lg text-grey-darkest opacity-85 leading-normal font-normal mb-2">
            He uses the mute button to prevent seeing more of their content.
            </p>
            <p class="text-lg text-grey-darkest opacity-85 leading-normal font-normal">
            A central-censor-free filter.
            </p>
          </div>
          
        </div>
      </div>
    </div>
    <div class="w-full bg-white mt-8">
      <div class="container flex justify-center px-4">
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
const Typed = require('typed.js')
export default {
  name: 'About',
  data() {
    return {
      person: null
    }
  },
  mounted(){
    const people = [
      { name: 'Hadiya', pro: 'She'}
    ]
    var typed = new Typed('.typi', {
      strings: ["you", "your group", "your mindshare", "your family"],
      typeSpeed: 200,
      loop: true,
      showCursor: false,
      shuffle: false,
    })
  }
}
</script>
