<template>
  <div class="w-full shadow-md rounded-lg overflow-hidden canvas bg-black relative cursor-pointer entry">
    <div class="px-6 py-4 flex justify-between items-center z-50 overflow-hidden">
      <div class="flex justify-between flex-grow z-50 items-center">
        <div class="flex flex-col flex-grow mr-4">
          <div class="font-light text-xl text-white opacity-90 mb-4">{{ huddle.name.slice(0, 20) }}</div>
          <div class="w-full rounded-full h-4 bg-frost relative">
            <div class="bg-ice pin-t pin-l h-full absolute rounded-full subtle" :style="approvalPercent"></div>
          </div>
        </div>
        <img src="../assets/arrow-r.svg" alt="" width="16">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['huddle'],
  data() {
    return {
      votes: []
    }
  },
  computed: {
    approvalPercent(){
      return { 'width' : `${(this.votes.filter(v => v.d == 1).length / 20) * 100}%`}
    },
    bgColor(){
      return { backgroundColor: `hsla(${ this.huddle.hue }, 35%, 27%, .64)` }
    },
    bgImage(){
      return { 
        backgroundImage: `url('${this.huddle.background}')` 
      }
    }
  },
  mounted(){
    if(this.huddle){
      this.$gun.get(`${gunPrefix}:huddles/${this.huddle.id}`).get('votes').map().on(vote => {
        this.votes.push(vote)
        this.votes = Array.from(new Set(this.votes))
      })
    }
  }
}
</script>


<style lang="stylus" scoped>
.entry 
  background-position center center
  .break 
    word-break break-all
</style>
