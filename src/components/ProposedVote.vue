<template>
  <div class="z-max fixed pin bg-smoke justify-center subtle overflow-y-scroll" :class="open" @click.self="close">
    <div class="flex justify-center mt-20 px-6" v-if="huddle !== null">
      <div class="rounded-lg shadow-lg p-6 px-8 bg-white w-full mb-4 max-w-sm relative">
        <div class="w-full flex flex-col">
          <div class="flex w-full justify-between mb-6">
            <div class="flex flex-col flex-grow">
              <h3 class="font-normal text-black text-xl tracking-wide mb-1">{{ huddle.name }}</h3>
              <p class="text-grey-darkest font-light text-xs pt-1 tracking-wide">Huddle Proposal</p>
            </div>
            <div class="flex ml-2">
              <img src="../assets/share.svg" alt="" class="cursor-pointer w-6 h-6 ml-2">
            </div>
          </div>
          <div class="mb-4">
            <p class="text-grey-darkest leading-loose break font-light">{{ huddle.description }}</p>
          </div>
          <div class="mb-4 w-full flex-col flex">
            <p class="text-grey-darkest font-light text-xs mb-2 self-end  tracking-wide">{{ quorum - approved }} approvals needed</p>
            <div class="w-full rounded-full h-4 bg-khak-grey relative">
              <div class="bg-smoke pin-t pin-l h-full absolute rounded-full subtle w-0" :style="approvalPercent"></div>
            </div>
          </div>
          <div class="flex justify-between items-center w-full">
            <div class="w-1/2 mr-1 bg-huddle-blue rounded-full text-white text-center py-2 px-4 cursor-pointer">Yes</div>
            <div class="w-1/2 ml-2 bg-red-light rounded-full text-white text-center py-2 px-4 cursor-pointer">No</div>
          </div>
        </div>
      </div>
      <img src="../assets/close.svg" alt="" class="cursor-pointer w-6 h-6 ml-4" @click="close">
    </div>
    
  </div>
</template>

<script>
  export default {
    props: ['huddle', 'visible'],
    store: ['user', 'users'],
    name: 'ProposedVote',
    data() {
      return {
        votes: [],
        quorum: 20,
      }
    },
    computed: {
      open(){
        return this.visible ? 'opacity-100 visible' : 'opacity-0 invisible'
      },
      approved(){
        return 7
        // return (this.votes.filter(v => v.d).length)
      },
      approval(){
        return (this.approved / this.quorum) * 100
      },
      approvalPercent(){
        return { 'width' : `${this.approval}%`}
      }
    },
    methods: {
      close(){
        this.$router.push(`/discover`)  
      },
      vote(d){
        const vote = { id: uuid('vote'), u: this.user.id, h: this.huddle.id, d: d }
        const newVote = this.$gun.get(`${gunPrefix}:votes/${vote.id}`).put(vote)
        const addToThisPost = this.$gun.get(`${gunPrefix}:huddles/${this.huddle.id}`).get('votes').set(newVote)
        const gaiaComment = JSON.stringify(comment)
      },
      
    },
    mounted(){

    },
    watch: {
      visible(value) {
        if(value){
          document.getElementById('body').style.overflowY = 'hidden'
        } else {
          document.getElementById('body').style.overflowY = 'auto'
        }
      }
    },
  }
</script>

<style scoped>

</style>