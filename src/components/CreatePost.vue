<template>
  <div class="z-max fixed pin bg-smoke justify-center subtle" :class="open" @click.self="close">
    <div class="flex justify-center mt-20">
      <div class="rounded-lg shadow-lg p-6 px-8 bg-white w-full mb-4 max-w-smd relative">
        <div class="w-full flex flex-col">
          <div class="flex w-full justify-between mb-6">
            <div class="flex flex-col flex-grow w-full">
              <div class="flex items-center mb-2 w-full" v-if="this.user">
                <img class="w-8 h-8 rounded-full mr-2" :src="this.user.avatar"/>
                <h3 class="font-normal text-black text-xl tracking-wide">{{ this.user.username.replace('.id.blockstack','') }}</h3>
              </div>
               <p class="text-grey-darkest font-light text-xs pt-1 tracking-wide">Post Creation : {{ postDate }}</p>
            </div>
          </div>
          <div class="py-3 px-4 rounded-lg w-full bg-khak-grey flex mb-4">
            <textarea id="text" v-model="post" class="bg-transparent flex-grow mr-4 h-64 block appearance-none text-grey-darkest leading-loose font-light outline-none text-normal h-24 resize-none" placeholder="Write something interesting..."></textarea>
            <div class="bg-red-light rounded-full px-4 text-sm text-white text-center py-2 cursor-pointer table self-end" v-show="isGivingThought" @click="cancelPost">
             <span><img src="../assets/spinner.svg" class="align-middle spin" alt="" width="16"></span>
                <span class="align-middle ml-2 mb-4">{{ timer }}</span>
            </div>
            <div class="bg-huddle-blue rounded-full px-4 text-sm text-white text-center py-2 cursor-pointer self-end" v-show="!isGivingThought" @click="post.length > 0 ? clickPost() : false">
              <span>Post</span>
            </div>
          </div>
          <div class="flex justify-center items-center">
            <div class="flex flex-col justify-center px-6">
              <p class="text-grey-dark text-center">{{ counter.words }}</p>
              <p class="text-grey-dark text-center text-xs">Words</p>
            </div>
            <div class="flex flex-col justify-center px-6">
              <p class="text-grey-dark text-center">{{ counter.paragraphs }}</p>
              <p class="text-grey-dark text-center text-xs">Paragraphs</p>
            </div>
            <div class="flex flex-col justify-center px-6">
              <p class="text-grey-dark text-center">{{ counter.characters }}</p>
              <p class="text-grey-dark text-center text-xs">Characters</p>
            </div>
          </div>
        </div>
      </div>
      <img src="../assets/close.svg" alt="" class="cursor-pointer w-6 h-6 ml-4" @click="close">
    </div>
    
  </div>
</template>

<script>
  const Countable = require('countable')
  export default {
    props: ['huddle', 'visible'],
    store: ['user'],
    name: 'CreatePost',
    data() {
      return {
        counter: {
          paragraphs: 0,
          sentences: 0,
          words: 0,
          characters: 0
        },
        post: '',
        isGivingThought: false,
        thoughtPromise: null,
        timerInterval: null,
        timer: 7
      }
    },
    computed: {
      open(){
        return this.visible ? 'opacity-100 visible' : 'opacity-0 invisible'
      },
      isMember(){
        return this.visible && this.huddle && this.user && this.user.publicHuddles.includes(this.huddle.id)
      },
      postDate(){
        return (new Date()).toLocaleTimeString() 
      }
    },
    methods: {
      cancelPost(){
        if(this.thoughtPromise && this.isGivingThought) this.thoughtPromise.cancel()
      },
      clickPost(){
        if(!this.isGivingThought && this.isMember){
          this.isGivingThought = true
          this.thoughtPromise = later(7000, "posting comment")
          this.timerInterval = setInterval(() => {
            this.timer--
          }, 1000)
          this.thoughtPromise.promise.then(async msg => { 
            await this.submitPost()
            clearInterval(this.timerInterval)
            this.timer = 7
            this.isGivingThought = false
          }).catch(() => { 
            console.log("cancelled comment")
            clearInterval(this.timerInterval)
            this.timer = 7
            this.isGivingThought = false 
          })
        } else {
          // error message
        }
      },
      close(){
        if(this.huddle.type == 'public') this.$router.push(`/h/${this.$route.params.slug}`)
        else if(this.huddle.type == 'hybrid') this.$router.push(`/p/${this.$route.params.slug}`)  
        else this.$router.push(`/p/${this.$route.params.slug}`)
      },
      async submitPost(){
        const post = {
          id: uuid(),
          u: this.user.id,
          huddle: this.huddle.id,
          type: 'text',
          content: this.post,
          createdAt: Date.now(),
          updatedAt : Date.now()
        }
        const gunData = { id: post.id, u: this.user.id }
        const newPost = this.$gun.get(`${gunPrefix}:posts/${post.id}`).put(gunData)
        const gunPost = this.$gun.get(`${gunPrefix}:huddles/${this.huddle.id}`).get('posts').set(newPost)
        const gaiaPost = JSON.stringify(post)
        this.user.publicPosts.push(post)
        await blockstack.putFile('publicPosts.json', JSON.stringify(this.user.publicPosts), { encrypt : false })
        await blockstack.putFile(`publicPosts/${post.id}.json`, gaiaPost, { encrypt : false })
        this.post = ''
        this.close()
      },
      mounted(){
        
      }
    },
    watch: {
      post(value){
        const area = document.getElementById('text')
        Countable.count(area, counter => {
          this.counter = counter
        })
      },
      visible(value) {
        if(value){
          document.getElementById('body').style.overflow = 'hidden'
        } else {
          this.cancelPost()
          document.getElementById('body').style.overflow = 'auto'
        }
      }
    },
  }
</script>

<style scoped>

</style>