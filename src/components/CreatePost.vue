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
            <div class="flex ml-2 items-center self-start">
              <svg class="w-8 outline-none fill-current cursor-pointer ml-2 opacity-75 hover:opacity-90 subtle" :class="{ 'text-red' : isNSFW }" v-tooltip="isNSFW ? 'Unmark as NSFW' : 'Mark as NSFW'" @click="toggleNSFW()" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M320.67 64c-442.6 0-357.57 384-158.46 384 39.9 0 77.47-20.69 101.42-55.86l25.73-37.79c15.66-22.99 46.97-22.99 62.63 0l25.73 37.79C401.66 427.31 439.23 448 479.13 448c189.86 0 290.63-384-158.46-384zM184 308.36c-41.06 0-67.76-25.66-80.08-41.05-5.23-6.53-5.23-16.09 0-22.63 12.32-15.4 39.01-41.05 80.08-41.05s67.76 25.66 80.08 41.05c5.23 6.53 5.23 16.09 0 22.63-12.32 15.4-39.02 41.05-80.08 41.05zm272 0c-41.06 0-67.76-25.66-80.08-41.05-5.23-6.53-5.23-16.09 0-22.63 12.32-15.4 39.01-41.05 80.08-41.05s67.76 25.66 80.08 41.05c5.23 6.53 5.23 16.09 0 22.63-12.32 15.4-39.02 41.05-80.08 41.05z"/></svg>
            </div>
          </div>
          <div class="py-3 px-4 rounded-lg w-full bg-khak-grey flex flex-col mb-4">
            <textarea id="text" v-model="post" class="bg-transparent flex-grow mb-4 h-40 block appearance-none text-grey-darkest leading-loose font-light outline-none text-normal h-24 resize-none" placeholder="Write something interesting..."></textarea>
            <div class="w-full flex justify-between items-center">
              <div>

              </div>
              <div class="bg-huddle-blue rounded-full px-4 text-sm text-white text-center py-2 cursor-pointer" v-show="!isGivingThought" @click="post.length > 0 ? clickPost() : false">
                <span>Post</span>
              </div>
              <div class="bg-red-light rounded-full px-4 text-sm text-white text-center py-2 cursor-pointer table" v-show="isGivingThought" @click="cancelPost">
                <span><img src="../assets/spinner.svg" class="align-middle spin" alt="" width="15"></span>
                  <span class="align-middle ml-2 mb-4">{{ timer }}</span>
              </div>
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
        isNSFW: false,
        isGivingThought: false,
        thoughtPromise: null,
        timerInterval: null,
        timer: 4
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
      },
      formattedContent(){
        return linkifyHtml(this.post, { 
          className: 'text-huddle-blue font-semibold',
          format: (value, type) => {
            if (type === 'url' && value.length > 25) {
              value = value.slice(0, 25) + '…'
            }
            return value;
          }
        })
      }
    },
    methods: {
      cancelPost(){
        if(this.thoughtPromise && this.isGivingThought) this.thoughtPromise.cancel()
      },
      toggleNSFW(){
        this.isNSFW = !this.isNSFW
      },
      clickPost(){
        if(!this.isGivingThought && this.isMember){
          this.isGivingThought = true
          this.thoughtPromise = later(this.timer * 1000, "posting comment")
          this.timerInterval = setInterval(() => {
            this.timer--
          }, 1000)
          this.thoughtPromise.promise.then(async msg => { 
            await this.submitPost()
            clearInterval(this.timerInterval)
            this.timer = 4
            this.isGivingThought = false
          }).catch(() => { 
            console.log("cancelled comment")
            clearInterval(this.timerInterval)
            this.timer = 4
            this.isGivingThought = false 
          })
        } else {
          // error message
        }
      },
      close(){
        if(this.huddle.type == 'public') this.$router.push(`/h/${this.$route.params.slug}`)
        else if(this.huddle.type == 'hybrid') this.$router.push(`/p/${this.$route.params.slug}`)  
        else if(this.huddle.type == 'private') this.$router.push(`/p/${this.$route.params.id}`)
      },
      async submitPost(){
        const post = {
          id: uuid(),
          u: this.user.id,
          huddle: this.huddle.id,
          isNSFW: this.isNSFW,
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