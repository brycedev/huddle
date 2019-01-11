<template>
  <div class="max-w-full relative overflow-hidden flex-grow -mb-8">
    <div class="w-full bg-black relative canvas">
      <div class="container flex justify-center items-center">
        <div class="flex justify-center items-center flex-col py-20 my-12">
          <h1 class="text-4xl text-white font-light max-w-sm text-center mb-4 flex z-50">
            Edit Profile
          </h1>
          <p class="text-white text-lg">Customize your little section of the community.</p>
        </div>
      </div>
    </div>
    <div class="container flex">
      <div class="w-full justify-center flex">
        <div class="w-full max-w-sm bg-white rounded-lg py-6 px-8 flex flex-col -mt-12 z-50">
          <div class="w-full mb-6">
             <p class="text-black font-medium mb-6">Please enter a short description about yourself.</p>
            <div class="h-32 py-3 px-4 rounded-lg w-full relative" :style="bgImage" :class="{ 'centercenter' : bgImage !== {}, 'canvas' : bgImage == {}}">
              <div class="overlay absolute pin z-auto" :style="bgColor"></div>
            </div>
          </div>
          <div class="w-full mb-6">
            <p class="text-black font-medium mb-6">Please enter a short description about yourself.</p>
            <textarea v-model="description" class="leading-loose h-32 block resize-none appearance-none text-grey-darker py-3 px-4 rounded-lg w-full bg-khak-grey outline-none text-normal mb-3" height="200"></textarea>
          </div>
          <div class="bg-huddle-blue rounded-full px-6 text-white text-center py-3 cursor-pointer" @click="updateProfile">
            <span v-show="!isUpdating">Update</span>
            <img src="../assets/spinner.svg" class="spin" alt="" width="16" v-show="isUpdating">
          </div>
        </div>
      </div>
    </div>
    <img src="../assets/astronaut.svg" class="-mb-12 -mt-20 table max-w-md mx-auto" alt="Huddle onboarding" width="100%">
  </div>
</template>

<script>
export default {
  name: 'updateProfile',
  store: ['user', 'users'],
  data() {
    return {
      isUpdating: false,
      background: '',
      description: '',
      hue: 0,
      profile: {}
    }
  },
  computed: {
    bgColor(){
      return {  backgroundColor: `hsla(${ this.profile.hue }, 35%, 27%, .64)` } 
    },
    bgImage(){
      return { backgroundImage: `url('${this.profile.background}')` } 
    },
  },
  beforeMount(){
    if(!this.user) this.$router.push('/')
  },
  methods: {
    styleForType(type){
      if(this.huddle.type == type) return 'bg-black text-white'
      else return 'bg-transparent text-grey-darker'
    },
    styleForNSFW(type){
      if(this.huddle.isNSFW == type) return 'bg-black text-white'
      else return 'bg-transparent text-grey-darker'
    },
    async updateProfile(){
      this.isUpdating = true
      const profile = {
        hue: this.profile.hue !== this.hue ? this.hue : this.profile.hue,
        background: this.profile.background !== this.background ? this.background : this.profile.background,
        description: this.profile.description !== this.description ? this.description : this.profile.description
      }
      await blockstack.putFile(`profile.json`, JSON.stringify(profile), { encrypt : false })
      this.$router.push(`/i/${this.user.username}`)
    }
  },
  mounted(){
    setTimeout(async () => {
      this.profile = JSON.parse(await blockstack.getFile('profile.json', { decrypt: false }))
      this.description = this.profile.description
      this.background = this.profile.background
    })
  }
}
</script>
