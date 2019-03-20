<template>
  <div class="max-w-full relative overflow-hidden flex-grow -mb-8">
    <div class="w-full bg-black relative canvas">
      <div class="container flex justify-center items-center">
        <div class="flex justify-center items-center flex-col py-20 my-12">
          <h1 class="text-4xl text-white font-light max-w-sm text-center mb-4 flex z-50">
            Notifications
          </h1>
          <p class="text-white text-lg">Important things you should know about.</p>
        </div>
      </div>
    </div>
    <div class="container flex">
      <div class="w-full justify-center flex">
        <div class="w-full max-w-sm bg-white rounded-lg py-6 px-8 flex flex-col -mt-12 z-50">
          <div class="w-full mb-6">
            <p class="text-black font-medium mb-6">Change your Huddle username.</p>
            
          </div>
          <div class="w-full mb-6">
            <p class="text-black font-medium mb-6">Would you like to participate in public communities?</p>
            
          </div>
          <div class="w-full mb-6">
            <p class="text-black font-medium mb-6">Should we hide NSFW posts and huddles?</p>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notifications',
  store: ['user', 'users'],
  data() {
    return {
      isChangingUsername: false,
      newSettings: {
        username: ''
      },
      hideNSFW: false
    }
  },
  metaInfo(){
    return {
      title: `Notifications | Huddle`
    }
  },
  computed: {
    canSubmit(){
      return this.false
    },
  },
  beforeMount(){
    if(!this.user) this.$router.push('/')
  },
  methods: {
    async fetchNotifications(){
      // this.$gun.get(`${gunPrefix}:huddles/${h}`).get('posts').map().on(post => {
      //   this.postFragments.push(post)
      //   this.postFragments = Array.from(new Set(this.postFragments))
      // })
    }
  },
  mounted(){
    
  },
  watch: {
    
  }
}
</script>
