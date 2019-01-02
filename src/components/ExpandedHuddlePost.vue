<template>
  <div class="z-max fixed pin bg-smoke justify-center subtle" :class="open" @click.self="close">
    <div class="flex justify-center mt-20" v-if="post !== null">
      <div class="rounded-lg shadow-lg p-6 bg-white w-full mb-4 max-w-md relative">
        <div class="w-full flex flex-col">
          <div class="flex items-center mb-2" v-if="post.user">
            <img class="w-8 h-8 rounded-full mr-2" :src="post.user.avatar"/>
            <h4 class="font-normal text-black">{{ post.user.name.replace('.id.blockstack','') }}</h4>
          </div>
          <div class="mb-8">
            <p class="text-grey-darkest leading-loose">{{ post.content }}</p>
          </div>
          <div class="py-3 px-4 rounded-lg w-full bg-khak-grey flex" v-if="user">
            <textarea v-model="comment" type="text" class="bg-transparent flex-grow w-full mr-4 h-24 block appearance-none text-grey-darker font-light leading-loose outline-none text-normal h-24 resize-none" placeholder="Some comment"></textarea>
            <div class="bg-blue rounded-full px-4 text-sm text-white text-center py-2 cursor-pointer self-end">
              <span v-show="!isGivingThought">Post</span>
              <img src="../assets/spinner.svg" class="spin" alt="" width="16" v-show="isGivingThought">
            </div>
          </div>
          <div v-if="!post.comments">
            <p class="text-grey-dark text-center pt-8 pb-2" >No comments. Be the first.</p>
          </div>
        </div>
      </div>
      <img src="../assets/close.svg" alt="" class="cursor-pointer w-6 h-6 ml-4" @click="close">
    </div>
    
  </div>
</template>

<script>
  export default {
    props: ['post', 'visible'],
    store: ['user'],
    name: 'ExpandedHuddlePost',
    data() {
      return {
        comment: '',
        isGivingThought: false,
      }
    },
    computed: {
      open(){
        return this.visible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }
    },
    methods: {
      close(){
        this.$router.push(`/h/${this.$route.params.slug}`)  
      }
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