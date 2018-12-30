<template>
  <div class="z-max fixed pin bg-smoke justify-center subtle" :class="open" @click.self="close">
    <div class="flex justify-center mt-20" v-if="post !== null">
      <div class="rounded-lg shadow-lg p-6 bg-white w-full mb-4 max-w-md relative">
        <div class="w-full flex flex-col">
          <div class="flex items-center mb-2" v-if="post.user">
            <img class="w-8 h-8 rounded-full mr-2" :src="post.user.avatar"/>
            <h4 class="font-normal text-black">{{ post.user.name.replace('.id.blockstack','') }}</h4>
          </div>
          <div>
            <p class="text-grey-darkest leading-loose">{{ post.content }}</p>
          </div>
          <div>
            <p class="text-grey-dark text-center pt-8 pb-2" v-if="!post.comments">No comments. Be the first.</p>
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
    name: 'ExpandedHuddlePost',
    computed: {
      open(){
        return this.visible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }
    },
    methods: {
      close(){
        console.log('trying to close')
        this.$router.push(`/h/${this.$route.params.slug}`)  
      }
    },
    watch: {
      visible(value) {
        if(value){
          document.getElementById('body').style.overflow = 'hidden'
        } else {
          document.getElementById('body').style.overflow = 'auto'
        }
      }
    },
  }
</script>

<style scoped>

</style>