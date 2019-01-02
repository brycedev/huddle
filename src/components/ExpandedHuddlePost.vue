<template>
  <div class="z-max fixed pin bg-smoke justify-center subtle" :class="open" @click.self="close">
    <div class="flex justify-center mt-20" v-if="post !== null">
      <div class="rounded-lg shadow-lg p-6 bg-white w-full mb-4 max-w-md relative">
        <div class="w-full flex flex-col">
          <div class="flex items-center mb-2" v-if="postUser">
            <img class="w-8 h-8 rounded-full mr-2" :src="postUser.avatar"/>
            <h4 class="font-normal text-black">{{ postUser.name.replace('.id.blockstack','') }}</h4>
          </div>
          <div class="mb-8">
            <p class="text-grey-darkest leading-loose">{{ post.content }}</p>
          </div>
          <div class="py-3 px-4 rounded-lg w-full bg-khak-grey flex h-32" v-if="user">
            <textarea v-model="comment" type="text" class="bg-transparent flex-grow mr-4 h-full block appearance-none text-grey-darker font-light leading-loose outline-none text-normal resize-none" placeholder="Some comment"></textarea>
            <div class="bg-red-light rounded-full px-4 text-sm text-white text-center py-2 cursor-pointer table self-end" v-show="isGivingThought" @click="cancelPost">
              <div class="ul m-0 p-0 inline-block">
                <img src="../assets/spinner.svg" class="align-middle spin" alt="" width="16">
                <span class="align-middle ml-2 mb-4">{{ timer }}</span>
              </div>
            </div>
            <div class="bg-huddle-blue rounded-full px-4 text-sm text-white text-center py-2 cursor-pointer self-end" v-show="!isGivingThought" @click="clickPost">
              <span>Post</span>
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
    store: ['user', 'users'],
    name: 'ExpandedHuddlePost',
    data() {
      return {
        comment: '',
        thoughtPromise: null,
        isGivingThought: false,
        comments: [],
        timerInterval : null,
        timer: 7
      }
    },
    computed: {
      open(){
        return this.visible ? 'opacity-100 visible' : 'opacity-0 invisible'
      },
      isMember(){
        return this.post && this.user && this.user.publicGroups.includes(this.post.huddle)
      },
      postUser(){
        return this.post && this.user
          ? this.users.find(u => u.id == this.post.u)
          : false
      },
    },
    methods: {
      close(){
        this.$router.push(`/h/${this.$route.params.slug}`)  
      },
      cancelPost(){
        this.thoughtPromise.cancel()
      },
      clickPost(){
        if(!this.isGivingThought && this.isMember){
          this.isGivingThought = true
          this.thoughtPromise = later(7000, "posting comment")
          this.timerInterval = setInterval(() => {
            this.timer--
          }, 1000)
          this.thoughtPromise.promise.then(async msg => { 
            await this.submitComment()
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
      async submitComment(){
        const comment = {
          id: uuid(),
          huddle: this.post.huddle,
          post: this.post.id,
          type: 'text',
          content: this.comment
        }
        const gunData = { id: uuid(), u: this.user.id }
        const newComment = this.$gun.get(`${gunPrefix}:comments/${comment.id}`).put(gunData)
        const addToThisPost = this.$gun.get(`${gunPrefix}:posts/${this.post.id}`).get('comments').set(newComment)
        const gaiaComment = JSON.stringify(comment)
        this.user.publicComments.push(comment)
        await blockstack.putFile('publicComments.json', JSON.stringify(this.user.publicComments), { encrypt : false })
        await blockstack.putFile(`publicComments/${comment.id}.json`, gaiaComment, { encrypt : false })
        this.comment = ''
        this.$parent.fetchComments()
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
      },
      post(value) {
        this.comment = ''
      }
    },
  }
</script>

<style scoped>

</style>