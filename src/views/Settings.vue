<template>
  <div class="max-w-full relative overflow-hidden flex-grow -mb-8">
    <div class="w-full bg-black relative canvas">
      <div class="container flex justify-center items-center">
        <div class="flex justify-center items-center flex-col py-20 my-12">
          <h1 class="text-4xl text-white font-light max-w-sm text-center mb-4 flex z-50">
            Settings
          </h1>
          <p class="text-white text-lg">Configure your Huddle experience.</p>
        </div>
      </div>
    </div>
    <div class="container flex">
      <div class="w-full justify-center flex">
        <div class="w-full max-w-sm bg-white rounded-lg py-6 px-8 flex flex-col -mt-12 z-50">
          <div class="w-full mb-6">
            <p class="text-black font-medium mb-6">Change your Huddle username.</p>
            <div class="w-full relative">
              <input v-model="newSettings.username" type="text" class="block appearance-none text-grey-darker py-3 px-4 rounded-full w-full bg-khak-grey outline-none text-normal">
              <button type="submit" class="outline-none focus:outline-none px-4 absolute pin-t pin-b pin-r rounded-tr-full rounded-br-full rounded-full flex items-center justify-center bg-blue cursor-pointer" @click="changeUsername()">
                <img src="../assets/arrow-r.svg" class="opacity-90" width="20" v-show="!isChangingUsername">
                <img src="../assets/spinner.svg" class="spin" alt="" width="16" v-show="isChangingUsername">
              </button>
            </div>
          </div>
          <div class="w-full mb-6">
            <p class="text-black font-medium mb-6">Would you like to participate in public communities?</p>
            <div class="flex w-full bg-khak-grey rounded-full">
              <div class="py-3 px-4 w-1/2 cursor-pointer subtle rounded-full" :class="styleForParticipate(true)">
                <p class="text-normal text-center">Yes</p>
              </div>
              <div class="py-3 px-4 w-1/2 cursor-pointer subtle rounded-full" :class="styleForParticipate(false)">
                <p class="text-normal text-center">No</p>
              </div>
            </div>
          </div>
          <div class="w-full mb-6">
            <p class="text-black font-medium mb-6">Should we hide NSFW posts and huddles?</p>
            <div class="flex w-full bg-khak-grey rounded-full">
              <div class="py-3 px-4 w-1/2 cursor-pointer subtle rounded-full" :class="styleForHideNSFW(true)" @click="hideNSFW = true">
                <p class="text-normal text-center">Yes</p>
              </div>
              <div class="py-3 px-4 w-1/2 cursor-pointer subtle rounded-full" :class="styleForHideNSFW(false)" @click="hideNSFW = false">
                <p class="text-normal text-center">No</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
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
      title: `Settings | Huddle`
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
    async changeUsername(){
      this.isChangingUsername = true
      if(!this.users.find(u => u.username == this.newSettings.username) && this.newSettings.username !== this.user.username){
        this.user.preferences.username = this.newSettings.username
        await blockstack.putFile('preferences.json', JSON.stringify(this.user.preferences), { encrypt : true })
        const thisUser = this.$gun.get(`${gunPrefix}:users/${this.user.id}`).put({ id: this.user.id, bi: this.user.bi, username: this.newSettings.username, avatar: this.user.avatar, public: true })
        this.$gun.get(`${gunPrefix}:users`).set(thisUser)
        const data = blockstack.loadUserData()
        data.huddlerUsername = this.newSettings.username
        await this.$parent.putUser(data)
        this.isChangingUsername = false
      } else {
        // name is taken
        this.isChangingUsername = false
      }
    },
    styleForParticipate(type){
      if(type == true) return 'bg-black text-white'
      else return 'bg-transparent text-grey-darker'
    },
    styleForHideNSFW(type){
      if(type == this.hideNSFW) return 'bg-black text-white'
      else return 'bg-transparent text-grey-darker'
    }
  },
  mounted(){
    this.newSettings.username = this.user.username
    this.hideNSFW = this.user.preferences.hideNSFW
  },
  watch: {
    hideNSFW(value){
      setTimeout(async () => {
        if(value == false){
          this.user.preferences.hideNSFW = false
        } else if(value == true){
          this.user.preferences.hideNSFW = true
        }
        await blockstack.putFile('preferences.json', JSON.stringify(this.user.preferences), { encrypt : true })
      })
    }
  }
}
</script>
