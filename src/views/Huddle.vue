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
    <div class="container flex -mt-20">
      <div class="w-full flex justify-between z-50">
        <div class="w-160 h-64">

        </div>
        <div class="w-full flex-grow flex flex-col">
          <div class="rounded-lg p-8 bg-white w-full mb-4" v-for="post in posts" :key="post.id" :class="Math.floor(Math.random() * 2) ? 'h-48' : 'h-64' ">

          </div>
        </div>
        <div class="w-160 h-64">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HuddleEntry from '@/components/HuddleEntry.vue'

export default {
  name: 'home',
  store: ['user'],
  components: {
    HuddleEntry
  },
  data() {
    return {
      huddle: null
    }
  },
  beforeMount(){
    const huddle = window.db.huddles.all.find(h => h.slug == this.$route.params.slug)
    if(!huddle) this.$router.push('/')
    else this.huddle = huddle
  },
  computed: {
    bgColor(){
      return { 
        backgroundColor: `hsla(${this.huddle.hue ? this.huddle.hue : Math.floor(Math.random() * 357)}, 35%, 27%, .64)`
      }
    },
    bgImage(){
      return { 
        backgroundImage: `url('https://picsum.photos/1920x1080/?random=${this.huddle.id}')` 
      }
    },
    huddles(){
      return window.db.huddles.all
    },
    posts(){
      return Array.from(Array(20), (x, index) => index).map(i => {
        return { id: i }
      })
    }
  },
  mounted(){
    // if(!this.user) window.location.replace('/')
  }
}
</script>

<style lang="stylus" scoped>

</style>
