<template>
  <div class="max-w-full relative overflow-hidden flex-grow -mb-8">
    <div class="w-full bg-black relative canvas">
      <div class="container flex justify-center items-center">
        <div class="flex justify-center items-center flex-col py-20 my-12">
          <h1 class="text-4xl text-white font-light max-w-sm text-center mb-4 flex z-50">
            Create a Huddle
          </h1>
          <p class="text-white text-lg">Tell us a little more about your group.</p>
        </div>
      </div>
    </div>
    <div class="container flex">
      <div class="w-full justify-center flex">
        <div class="w-full max-w-sm bg-white rounded-lg py-6 px-8 flex flex-col -mt-12 z-50">
          <div class="w-full mb-6">
            <p class="text-black font-medium mb-6">What is the name of the group?</p>
            <input v-model="huddle.name" type="text" class="block appearance-none text-grey-darker py-3 px-4 rounded-full w-full bg-khak-grey outline-none text-normal" placeholder="My Study Group" @keyup.enter="createHuddle">
          </div>
          <div class="w-full mb-6">
            <p class="text-black font-medium mb-6">What is the visibility of the group?</p>
            <div class="flex w-full bg-khak-grey rounded-full">
              <div class="py-3 px-4 w-1/2 cursor-pointer subtle rounded-full" :class="styleForType('public')" @click="huddle.type = 'public'">
                <p class="text-normal text-center">Public</p>
              </div>
              <div class="py-3 px-4 w-1/2 cursor-pointer subtle rounded-full" :class="styleForType('private')" @click="huddle.type = 'private'">
                <p class="text-normal text-center">Private</p>
              </div>
            </div>
          </div>
          <div class="w-full">
            <p class="text-black font-medium mb-6">Is this a NSFW (18+) group?</p>
            <div class="flex w-full bg-khak-grey rounded-full mb-6">
              <div class="py-3 px-4 w-1/2 cursor-pointer subtle rounded-full" :class="styleForNSFW(true)" @click="huddle.isNSFW = true">
                <p class="text-normal text-center">Yes</p>
              </div>
              <div class="py-3 px-4 w-1/2 cursor-pointer subtle rounded-full" :class="styleForNSFW(false)" @click="huddle.isNSFW = false">
                <p class="text-normal text-center">No</p>
              </div>
            </div>
          </div>
          <div class="w-full">
            <p class="text-black font-medium mb-6">Please enter a short description of the group.</p>
            <textarea v-model="huddle.description" class="leading-loose h-32 block resize-none appearance-none text-grey-darker py-3 px-4 rounded-lg w-full bg-khak-grey outline-none text-normal mb-3" height="200"></textarea>
          </div>
          <div class="bg-huddle-blue rounded-full px-6 text-white text-center py-3 cursor-pointer" @click="createHuddle">
            <span v-show="!isCreating">Create</span>
            <img src="../assets/spinner.svg" class="spin" alt="" width="16" v-show="isCreating">
          </div>
        </div>
      </div>
    </div>
    <img src="../assets/astronaut.svg" class="-mb-12 -mt-20 table max-w-md mx-auto" alt="Huddle onboarding" width="100%">
  </div>
</template>

<script>
export default {
  name: 'CreateHuddle',
  store: ['user', 'users'],
  metaInfo(){
    return {
      title: `Create a Huddle | Huddle`,
    }
  },
  data() {
    return {
      isCreating: false,
      huddle: {
        description: '',
        name: '',
        type: 'public',
        isNSFW: false
      }
    }
  },
  computed: {
    canSubmit(){
      const description = this.huddle.description
      const name = this.huddle.name
      const type = this.huddle.type
      return description !== '' && description.trim().length >= 80 && name !== '' && type !== '' && this.user
    },
    slugged(){
      return slug(this.huddle.name, { lower: true, replacement: '' }).slice(0,30)
    }
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
    async createHuddle(){
      if(this.canSubmit){
        this.isCreating = true
        let huddle = this.huddle
        huddle.id = uuid('huddle')
        huddle.hue = Math.floor(Math.random() * 357)
        huddle.background = `https://picsum.photos/1920x1080/?random=${this.huddle.id}`
        huddle.createdAt = Date.now()
        huddle.updatedAt = Date.now()
        if(this.huddle.type == 'public'){
          huddle.slug = this.slugged
          huddle.isProposed = true
          huddle.isApproved = false
        } else {
          this.user.privateHuddles.push(huddle.id)
          const newPrivateHuddle = JSON.stringify(huddle)
          const newPrivateHuddles = JSON.stringify(this.user.privateHuddles)
          await blockstack.putFile(`privateHuddles/${huddle.id}.json`, newPrivateHuddle, { encrypt : true })
          await blockstack.putFile('privateHuddles.json', newPrivateHuddles, { encrypt : true })
        }
        if(this.huddle.type !== 'private'){
          const newHuddle = this.$gun.get(`${gunPrefix}:huddles/${huddle.id}`).put(huddle)
          this.$gun.get(`${gunPrefix}:huddles`).set(newHuddle)
        }
        if(this.huddle.type == 'public') this.$router.push(`/discover`)
        else this.$router.push(`/p/${huddle.id}`)
      } else {
        // can't submit
      }
    }
  },
  mounted(){

  },
  watch: {
    'huddle.type'(value){
      // if(value == 'private') this.huddle.type = 'public'
    }
  }
}
</script>
