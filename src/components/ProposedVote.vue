<template>
  <div class="z-max fixed pin bg-smoke justify-center subtle" :class="open" @click.self="close">
    <div class="flex justify-center mt-20" v-if="huddle !== null">
      <div class="rounded-lg shadow-lg p-6 bg-white w-full mb-4 max-w-md relative">
        <div class="w-full flex flex-col">
          <div class="flex items-center mb-2">
            <h4 class="font-normal text-black">{{ huddle.name }}</h4>
          </div>
          <div class="mb-8">
            <p class="text-grey-darkest leading-loose">{{ huddle.description }}</p>
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
        votes: []
      }
    },
    computed: {
      open(){
        return this.visible ? 'opacity-100 visible' : 'opacity-0 invisible'
      },
    },
    methods: {
      close(){
        this.$router.push(`/discover`)  
      },
      vote(direction){
        const vote = { id: uuid('vote'), u: this.user.id, h: this.huddle.id }
        const newVote = this.$gun.get(`${gunPrefix}:votes/${vote.id}`).put(vote)
        const addToThisPost = this.$gun.get(`${gunPrefix}:huddles/${this.huddle.id}`).get('votes').set(newVote)
        const gaiaComment = JSON.stringify(comment)
      }
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