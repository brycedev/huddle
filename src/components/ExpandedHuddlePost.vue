<template>
  <div class="z-max fixed pin bg-smoke justify-center subtle overflow-y-scroll" :class="open" @click.self="close">
    <div class="flex justify-center mt-20" v-if="post !== null">
      <div class="rounded-lg shadow-lg p-6 px-8 bg-white w-full mb-4 max-w-md">
        <div class="w-full flex flex-col relative">
          <div class="absolute pin bg-white subtle opacity-0 flex flex-col items-center justify-center z-50 pointer-events-none" :class="{ 'opacity-100 pointer-events-auto' : showReportPost }">
            <h2 class="text-grey-darkest pb-4 leading-normal font-thin text-center max-w-xs">Are you sure you want to report this post?</h2>
            <div class="absolute w-6 h-6 pin-t pin-l opacity-75 hover:opacity-90 subtle" @click="showReportPost = false">
              <svg class="w-6 fill-current text-black cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M427 234.625H167.296l119.702-119.702L256 85 85 256l171 171 29.922-29.924-118.626-119.701H427v-42.75z"/></svg>
            </div>
            <div class="py-3 px-4 rounded-lg w-full max-w-sm bg-khak-grey flex flex-col mt-6">
              <textarea id="text" v-model="reportReason" class="bg-transparent flex-grow mb-4 h-24 block appearance-none text-grey-darkest leading-loose font-light outline-none text-normal h-24 resize-none" placeholder="Brief reason for reporting..."></textarea>
              <div class="w-full flex justify-between items-center">
                <div>

                </div>
                <div class="bg-huddle-blue rounded-full px-4 text-sm text-white text-center py-2 cursor-pointer" @click="false">
                  <span>Report</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex w-full justify-between mb-6">
            <div class="flex flex-col flex-grow">
              <div class="flex items-center mb-2 w-full" v-if="postUser">
                <img class="w-8 h-8 rounded-full mr-2" :src="postUser.avatar"/>
                <h3 class="font-normal text-black text-xl tracking-wide">{{ postUser.username.replace('.id.blockstack','') }}</h3>
              </div>
              <p class="text-grey-darkest font-light text-xs pt-1 tracking-wide">Post Creation : {{ postDate }}</p>
            </div>
            <div class="flex ml-2 items-center self-start">
              <svg  class="w-6 h-6 outline-none fill-current cursor-pointer ml-2 opacity-75 hover:opacity-90 subtle" :class="{ 'text-red' : saved }" v-tooltip="!saved ? 'Save to Library' : 'Remove from Library'" @click="user ? saveToLibrary() : false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M92.1 32C76.6 32 64 44.6 64 60.1V452c0 15.5 12.6 28.1 28.1 28.1H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H112.5c-8.2 0-15.4-6-16.4-14.1-1.1-9.7 6.5-18 15.9-18h208V32H92.1z"/><path d="M432 416c8.8 0 16-7.2 16-16V60.1c0-15.5-12.6-28.1-28.1-28.1H368v384h64z"/></svg>
              <!-- <img src="../assets/save.svg" alt="" class="" > -->
              <img src="../assets/share.svg" alt="" class="cursor-pointer w-6 h-6 ml-2 opacity-75 hover:opacity-90 subtle" v-tooltip="'Share on Twitter'" @click="shareOnTwitter">
              <img src="../assets/ban.svg" alt="" class="cursor-pointer w-5 h-5 ml-2 opacity-75 hover:opacity-90 subtle" v-tooltip="'Report Post'" @click="showReportPost = true">
            </div>
          </div>
          <div class="mb-8">
            <p class="text-grey-darkest leading-loose break"><span v-html="formattedContent"></span></p>
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
            <div class="w-full flex flex-col mb-6 opacity-90" v-for="comment in sortedComments" :key="comment.id">
              <div class="flex items-center mb-2">
                <img class="w-8 h-8 rounded-full mr-2" :src="comment.avatar"/>
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
      <img src="../assets/close.svg" alt="" class="cursor-pointer w-6 h-6 ml-4 hidden md:block" @click="close">
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
        reportReason: '',
        saved: false,
        comment: '',
        commentFragments: [],
        thoughtPromise: null,
        isGivingThought: false,
        comments: [],
        timerInterval : null,
        timer: 4,
        showReportPost: false
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
      },
      formattedContent(){
        return linkifyHtml(this.post.content, { 
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
      isSaved(){
        return this.hasSaved ? this.hasSaved.v : false
      },
      hasSaved(){
        return this.user.publicLibrary.find(s => s.p == this.post.id && s.h == this.post.huddle)
      },
      shareOnTwitter(){
        let shareURL = "https://twitter.com/share?"
        const params = {
          url: window.location.href,
          text: "Check out this great post on Huddle! @itshuddletime \n\n",
        }
        for(var prop in params) shareURL += '&' + prop + '=' + encodeURIComponent(params[prop])
        window.open(shareURL, '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0')
      },
      close(){
        if(this.postHuddle.type == 'public') this.$router.push(`/h/${this.$route.params.slug}`)
        else if(this.postHuddle.type == 'hybrid') this.$router.push(`/p/${this.$route.params.slug}`)  
        else if(this.postHuddle.type == 'private') this.$router.push(`/p/${this.$route.params.id}`)
      },
      cancelPost(){
        this.thoughtPromise.cancel()
      },
      async saveToLibrary(){
        if(!this.saved){
          // post is not currently saved
          this.saved = true
          if(!this.hasSaved()){
            // post has never been saved before
            const save = { id: uuid('save'), u: this.user.id, p: this.post.id, h: this.post.huddle, v: true }
            const newSave = this.$gun.get(`${gunPrefix}:saves/${save.id}`).put(save)
            this.$gun.get(`${gunPrefix}:posts/${this.post.id}`).get('saves').set(newSave)
            this.user.publicLibrary.push({ id: save.id, p: save.p, h: save.h, v: true })
            await blockstack.putFile('publicLibrary.json', JSON.stringify(this.user.publicLibrary), { encrypt : false })
          } else {
            // post has been saved before
            let library = this.user.publicLibrary
            library.forEach(s => { if(s.id == this.hasSaved().id) s.v = true })
            this.$gun.get(`${gunPrefix}:saves/${this.hasSaved().id}`).put({ v: true })
            await blockstack.putFile('publicLibrary.json', JSON.stringify(library), { encrypt : false })
          }
          await this.$parent.loadGaia()
        } else {
          // post is currently saved, so unsave it
          this.saved = false
          let library = this.user.publicLibrary
          library.forEach(s => { if(s.id == this.hasSaved().id) s.v = false })
          const save = this.$gun.get(`${gunPrefix}:saves/${this.hasSaved().id}`).put({ v: false })
          await blockstack.putFile('publicLibrary.json', JSON.stringify(library), { encrypt : false })
          await this.$parent.loadGaia()
        }
      },
      clickPost(){
        if(!this.isGivingThought && this.isMember){
          this.isGivingThought = true
          this.thoughtPromise = later(this.timer * 1000, "posting comment")
          this.timerInterval = setInterval(() => {
            this.timer--
          }, 1000)
          this.thoughtPromise.promise.then(async msg => { 
            await this.submitComment()
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
            this.showReportPost = false
            this.comments = []
          }, 400)
        }
      },
      post(value) {
        this.comment = ''
        this.saved = this.post && this.user 
          ? this.user.publicLibrary.filter(s => s.p == this.post.id && s.v == true).length ? true : false
          : false
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