<template>
  <div>
    <div class="w-full shadow-md rounded-lg overflow-hidden bg-cover relative cursor-pointer bg-blue-light entry" :style="bgImage" v-if="full">
      <div class="overlay absolute pin z-auto" :style="bgColor"></div>
      <div class="px-6 py-4 flex justify-between items-center z-50 overflow-hidden">
        <div class="flex justify-between flex-grow z-50 items-center">
          <div class="font-light text-xl text-white opacity-90">{{ huddle.name.slice(0, 20) }}</div>
          <div class="flex items-center">
            <div class="flex items-center px-3 py-2 bg-smoke rounded-full">
              <img class="mr-1" src="../assets/people.svg" alt="" width="14">
              <p class="text-grey-light text-xs opacity-85">{{ members.length }}</p>
            </div>
            <!-- <div class="flex items-center px-3 py-2 bg-smoke rounded-full ml-1" v-if="Math.floor(Math.random() * 2)">
              <img src="../assets/fire.svg" alt="" width="14">
            </div> -->
          </div>
        </div>
      </div>
      <div class="px-6 py-4 w-full flex flex-col">
        <div class="w-full z-50 flex">
          <p class="break text-white text-md mb-4 z-50 opacity-90 leading-normal h-18 overflow-hidden">{{ huddle.description.slice(0, 140) }}</p>
        </div>
      </div>
    </div>
    <div class="w-full shadow-md rounded-lg overflow-hidden bg-cover relative cursor-pointer bg-blue-light entry" :style="bgImage" v-if="!full">
    <div class="overlay absolute pin z-auto" :style="bgColor"></div>
    <div class="px-6 py-4 flex justify-between items-center z-50 overflow-hidden">
      <div class="flex justify-between flex-grow z-50 items-center">
        <div class="flex flex-col flex-grow mr-4">
          <div class="font-light text-xl text-white opacity-90">{{ huddle.name.slice(0, 20) }}</div>
        </div>
        <img src="../assets/arrow-r.svg" alt="" width="16">
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  store: ['users'],
  props: ['huddle', 'full'],
  data() {
    return {
      memberIds: []
    }
  },
  computed: {
    bgColor(){
      return { backgroundColor: `hsla(${ this.huddle.hue }, 35%, 27%, .72)` }
    },
    bgImage(){
      return { 
        backgroundImage: `url('${this.huddle.background}')` 
      }
    },
    members(){
      return this.users.filter(u => this.memberIds.includes(u.id)).slice(0,10)
    }
  },
  methods: {
    fetchMembers(){
      let members = []
      this.$gun.get(`${gunPrefix}:huddles/${this.huddle.id}`).get('members').map().on(user => {
        members.push(user)
      })
      this.memberIds = Array.from(new Set(members.map(m => m.id)))
    },
  },
  mounted(){
    this.fetchMembers()
  }
}
</script>


<style lang="stylus" scoped>
.entry 
  background-position center center
</style>
