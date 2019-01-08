<template>
  <div class="z-max fixed pin bg-smoke justify-center subtle overflow-y-scroll" :class="open" @click.self="close">
    <div class="flex justify-center mt-20" v-if="post !== null">
      <div class="rounded-lg shadow-lg p-6 px-8 bg-white w-full mb-4 max-w-md relative">
        <div class="w-full flex flex-col">
          <div class="flex w-full justify-between mb-6">
            <div class="flex flex-col flex-grow w-full">
              <div class="flex items-center mb-2 w-full" v-if="postUser">
                <img class="w-8 h-8 rounded-full mr-2" :src="postUser.avatar"/>
                <h3 class="font-normal text-black text-xl tracking-wide">{{ postUser.username.replace('.id.blockstack','') }}</h3>
              </div>
              <p class="text-grey-darkest font-light text-xs pt-1 tracking-wide">Post Creation : {{ postDate }}</p>
            </div>
            <div class="flex ml-2">
              <img src="../assets/save.svg" alt="" class="cursor-pointer w-6 h-6 ml-2 opacity-75 hover:opacity-90 subtle" v-tooltip="'Save to Library'" @click="user ? saveToLibrary() : false">
              <img src="../assets/share.svg" alt="" class="cursor-pointer w-6 h-6 ml-2 opacity-75 hover:opacity-90 subtle" v-tooltip="'Share on Twitter'" @click="shareOnTwitter">
            </div>
          </div>
          <div class="mb-8">
            <p class="text-grey-darkest leading-loose break">{{ post.content }}</p>
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
          <div v-if="!comments.length">
            <p class="text-grey-dark text-center pt-8 pb-2" >No comments. Be the first.</p>
          </div>
          <div class="flex flex-col w-full mt-8" v-if="comments.length">
            <div class="w-full flex flex-col mb-6 opacity-90" v-for="comment in sortedComments">
              <div class="flex items-center mb-2">
                <img class="w-5 h-5 rounded-full mr-2" :src="comment.avatar"/>
                <div class="flex flex-col">
                  <h3 class="font-normal text-grey-darkest text-sm tracking-wide mb-1">{{ comment.username.replace('.id.blockstack','') }}</h3>
                  <p class="text-grey-darkest font-light text-xs tracking-wide">{{ new Date(comment.createdAt).toLocaleTimeString() }}</p>
                </div>
              </div>
              <p class="text-grey-darkest leading-loose break " >{{ comment.content }}</p>
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
    props: ['post', 'visible'],
    store: ['huddles', 'user', 'users'],
    name: 'ExpandedHuddlePost',
    metaInfo(){
      return this.post && this.postUser && this.postHuddle ? {
        title: `${this.postUser.username} in ${ this.postHuddle.name } | Huddle`,
        meta: [
          {
            'property': 'og:title',
            'content': `${this.postUser.username}'s post in ${ this.postHuddle.name } on Huddle`,
          }
        ]
      } : { }
    },
    data() {
      return {
        comment: '',
        commentFragments: [],
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
        return this.post && this.user && this.user.publicHuddles.includes(this.post.huddle)
      },
      postHuddle(){
        return this.post && this.huddles
          ? this.huddles.find(h => h.id == this.post.huddle)
          : false
      },
      postUser(){
        return this.post && this.users
          ? this.users.find(u => u.id == this.post.u)
          : false
      },
      postDate(){
        return this.post 
          ? new Date(this.post.createdAt).toLocaleTimeString()
          : (new Date()).toLocaleTimeString() 
      },
      sortedComments(){
        return Array.from(new Set(this.comments)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }
    },
    methods: {
      shareOnTwitter(){
        let shareURL = "https://twitter.com/share?"
        const params = {
          url: window.location.href,
          text: "Check out this great post on Huddle! @itshuddletime",
        }
        for(var prop in params) shareURL += '&' + prop + '=' + encodeURIComponent(params[prop])
        window.open(shareURL, '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0')
      },
      close(){
        this.$router.push(`/h/${this.$route.params.slug}`)  
      },
      cancelPost(){
        this.thoughtPromise.cancel()
      },
      async saveToLibrary(){
        if(!this.user.publicLibrary.map(l => l.p).includes(this.post.id)){
          const save = { id: uuid('library'), u: this.user.id, p: this.post.id, h: this.post.huddle }
          const newSave = this.$gun.get(`${gunPrefix}:saves/${save.id}`).put(save)
          this.$gun.get(`${gunPrefix}:posts/${this.post.id}`).get('saves').set(newSave)
          this.user.publicLibrary.push({ id: save.id, p: save.p, h: save.h })
          await blockstack.putFile('publicLibrary.json', JSON.stringify(this.user.publicLibrary), { encrypt : false })
        } else {
          // user has already saved to library
        }
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
          id: uuid('comment'),
          huddle: this.post.huddle,
          post: this.post.id,
          type: 'text',
          content: this.comment,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        const gunData = { id: comment.id, u: this.user.id }
        const newComment = this.$gun.get(`${gunPrefix}:comments/${comment.id}`).put(gunData)
        const addToThisPost = this.$gun.get(`${gunPrefix}:posts/${this.post.id}`).get('comments').set(newComment)
        const gaiaComment = JSON.stringify(comment)
        this.user.publicComments.push(comment)
        await blockstack.putFile('publicComments.json', JSON.stringify(this.user.publicComments), { encrypt : false })
        await blockstack.putFile(`publicComments/${comment.id}.json`, gaiaComment, { encrypt : false })
        this.comment = ''
      },
      fetchComments(){
        if(this.post){
          this.commentFragments = []
          this.$gun.get(`${gunPrefix}:posts/${this.post.id}`).get('comments').map().on(comment => {
            this.commentFragments.push(comment)
            this.commentFragments = Array.from(new Set(this.commentFragments))
          })
        }
      }
    },
    mounted(){

    },
    watch: {
      visible(value) {
        if(value){
          this.fetchComments()
          document.getElementById('body').style.overflowY = 'hidden'
        } else {
          document.getElementById('body').style.overflowY = 'auto'
          setTimeout(() => {
            this.comments = []
          }, 400)
        }
      },
      post(value) {
        this.comment = ''
      },
      commentFragments(value){
        let comments = []
        value.forEach(async f => {
          if(f.u == this.user.id && this.user){
            let comment = this.user.publicComments.find(p => p.id == f.id)
            comment.username = this.user.username
            comment.avatar = this.user.avatar
            comments.push(comment)
          } else {
            blockstack.getFile(`publicComments/${f.id}.json`, {
              decrypt: false,
              app: window.location.origin,
              username: this.users.find(u => u.id == f.u).bi
            }).then(comment => {
              this.comments.push(JSON.parse(comment))
            }).catch(err => {
              console.log(err)
            })
          }
        })
        this.comments = comments
      }
    },
  }
</script>

<style scoped>

</style>