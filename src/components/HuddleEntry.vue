<template>
  <div class="w-full shadow rounded-lg overflow-hidden bg-cover relative cursor-pointer bg-blue-light entry" :style="`background-image: url('https://picsum.photos/700x400/?random=${huddle.id}')`">
  <!-- <div class="w-full rounded-lg overflow-hidden bg-cover relative cursor-pointer"> -->
    <div class="overlay absolute pin z-auto" :style="bgColor"></div>
    <div class="px-6 py-4 flex justify-between items-center z-50">
      <div class="flex justify-between flex-grow z-50 items-center">
        <div class="font-light text-xl text-white opacity-90">Huddle {{ huddle.id }}</div>
        <div class="flex items-center">
          <div class="flex items-center px-3 py-2 bg-smoke rounded-full">
            <img class="mr-1" src="../assets/people.svg" alt="" width="14">
            <p class="text-grey-light text-xs opacity-85">{{ memberCount }}</p>
          </div>
          <div class="flex items-center px-3 py-2 bg-smoke rounded-full ml-1" v-if="Math.floor(Math.random() * 2)">
            <img src="../assets/fire.svg" alt="" width="14">
          </div>
        </div>
      </div>
    </div>
    <div class="px-6 py-4 w-full flex flex-col">
      <div class="w-full z-50 flex">
        <p class="text-white text-md mb-4 z-50 opacity-90 leading-normal">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci velit maxime pariatur corporis illum...</p>
      </div>
      <div class="w-full flex">
        <div class="flex z-50 overflow-hidden">
          <img class="w-6 h-6 rounded-full" :src="`https://picsum.photos/300x300/?random=${huddle.id}')`"/>
          <img class="w-6 h-6 -ml-2 rounded-full" :src="`https://picsum.photos/300x300/?random=${huddle.id + 1}')`"/>
          <img class="w-6 h-6 -ml-2 rounded-full" :src="`https://picsum.photos/300x300/?random=${huddle.id + 2}')`"/>
          <img class="w-6 h-6 -ml-2 rounded-full" :src="`https://picsum.photos/300x300/?random=${huddle.id + 3}')`"/>
          <img class="w-6 h-6 -ml-2 rounded-full" :src="`https://picsum.photos/300x300/?random=${huddle.id + 4}')`"/>
          <img class="w-6 h-6 -ml-2 rounded-full" :src="`https://picsum.photos/300x300/?random=${huddle.id + 5}')`"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['huddle'],
  data() {
    return {
      memberCount: 279,
      popularity: 93
    }
  },
  computed: {
    bgColor(){
      return { backgroundColor: `hsla(${this.huddle.hue}, 35%, 27%, .64)`   }
    }
  }
}
</script>


<style lang="stylus" scoped>
.entry 
  background-position center center
</style>
