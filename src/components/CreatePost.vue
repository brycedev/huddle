<template>
  <div class="z-max fixed pin bg-smoke justify-center subtle" :class="open" @click.self="close">
    <div class="flex justify-center mt-20">
      <div class="rounded-lg shadow-lg p-6 bg-white w-full mb-4 max-w-smd relative">
        <div class="w-full flex flex-col">
          <div class="flex items-center mb-2" v-if="post.user">
            <img class="w-8 h-8 rounded-full mr-2" :src="post.user.avatar"/>
            <h4 class="font-normal text-black">{{ post.user.name.replace('.id.blockstack','') }}</h4>
          </div>
          <div class="py-3 px-4 rounded-lg w-full bg-khak-grey flex">
            <textarea v-model="post" type="text" class="bg-transparent flex-grow w-full mr-4 h-64 block appearance-none text-grey-darker font-light leading-loose outline-none text-normal h-24 resize-none" placeholder="Some post text"></textarea>
            <div class="bg-blue rounded-full px-4 text-sm text-white text-center py-2 cursor-pointer self-end" v-show="isGivingThought">
              <img src="../assets/spinner.svg" class="spin" alt="" width="16" v-show="isGivingThought">
              <span class="ml-2">Cancel</span>
            </div>
            <div class="bg-blue rounded-full px-4 text-sm text-white text-center py-2 cursor-pointer self-end" v-show="!isGivingThought">
              <span>Post</span>
            </div>
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
    name: 'CreatePost',
    data() {
      return {
        post: '',
        isGivingThought: false,
        isPosting: '',
      }
    },
    computed: {
      open(){
        return this.visible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }
    },
    methods: {
      cancelPost(){
        this.$emit('cancel-post')
      },
      close(){
        if(this.huddle.type == 'public') this.$router.push(`/h/${this.$route.params.slug}`)
        else if(this.huddle.type == 'hybrid') this.$router.push(`/p/${this.$route.params.slug}`)  
        else this.$router.push(`/p/${this.$route.params.slug}`)
      },
      async submitPost(){
        if(!isGivingThought && !isPosting){
          this.isGivingThought = true
          Promise((resolve, reject) => {
            this.$on('cancel-post', reject('cancelled'))
            setTimeout(() => {
              resolve()
            }, 7000)
          }).then(async () => {
            this.isGivingThought = false
            this.isPosting = true
            const post = {
              id: uuid(),
              huddle: this.huddle.id,
              type: 'text',
              content: this.post
            }
            const gunData = { id: uuid(), u: this.user.id }
            const gunPost = this.$gun.get(`${gunPrefix}:huddles/${this.huddle.id}`).get('posts').put(gunData)
            const gaiaPost = JSON.stringify(post)
            this.user.posts.push(post)
            await blockstack.putFile('publicPosts.json', JSON.stringify(this.user.posts), { encrypt : false })
            await blockstack.putFile(`publicPosts/${post.id}.json`, gaiaPost, { encrypt : false })
            this.isPosting = false
            this.close()
          }).catch(err => {
            this.isGivingThought = false
            console.log(err)
          })
        }
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