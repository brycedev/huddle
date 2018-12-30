<template>
  <div class="create w-full h-screen overflow-hidden relative flex items-center justify-center canvas bg-black">
    <div class="container flex justify-center items-center">
      <div class="flex justify-center items-center flex-col py-20 my-20 w-full">
        <h1 class="text-4xl text-white font-light max-w-sm text-center mb-8">Create a Huddle</h1>
        <div class="max-w-sm w-full bg-white rounded p-8">
          <form class="w-full">
            <div class="form-row w-full">
              <label class="block text-normal text-grey-dark mb-3">Huddle Name</label>
              <input v-model="huddle.name" type="text" class="block appearance-none text-grey-darker py-3 px-4 rounded-full w-full bg-khak-grey outline-none text-normal mb-3" placeholder="My Huddle">
              <label class="block text-normal text-grey-dark mb-3">Huddle Membership</label>
              <div class="flex w-full bg-khak-grey rounded-full mb-3">
                <div class="py-3 px-4 w-1/3 cursor-pointer subtle rounded-full" :class="styleForType('public')" @click="huddle.type = 'public'">
                  <p class="text-normal text-center">Public</p>
                </div>
                <div class="py-3 px-4 w-1/3 cursor-pointer subtle rounded-full" :class="styleForType('hybrid')" @click="huddle.type = 'hybrid'">
                  <p class="text-normal text-center">Hybrid</p>
                </div>
                <div class="py-3 px-4 w-1/3 cursor-pointer subtle rounded-full rounded-full" :class="styleForType('private')" @click="huddle.type = 'private'">
                  <p class="text-normal text-center">Private</p>
                </div>
              </div>
              <label class="block text-normal text-grey-dark mb-3">Huddle Description</label>
              <textarea v-model="huddle.description" class="leading-loose h-40 block resize-none appearance-none text-grey-darker py-3 px-4 rounded-lg w-full bg-khak-grey outline-none text-normal mb-3" height="200"></textarea>
              <p class="block text-normal text-grey-dark mb-3 text-center">https://huddle.group/h/<span class="font-bold">{{ slugged }}</span></p>
            </div>
            <div class="bg-blue rounded-full px-6 text-white text-center py-3 cursor-pointer" @click="create">
              <span v-show="!isCreating">Create</span>
              <img src="../assets/spinner.svg" class="spin" alt="" width="16" v-show="isCreating">
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Propose',
  store: ['user'],
  data: () => {
    return {
      isCreating: false,
      huddle: {
        description: '',
        name: '',
        type: ''
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
  methods: {
    async create(){
      if(this.canSubmit){
        if(this.huddle.type == 'public'){
          this.isCreating = true
          let huddle = this.huddle
          huddle.id = uuid('huddle')
          huddle.hue = Math.floor(Math.random() * 357)
          huddle.background = `https://picsum.photos/1920x1080/?random=${this.huddle.id}`
          huddle.createdAt = Date.now()
          huddle.updatedAt = Date.now()
          huddle.slug = this.slugged
          huddle.isProposed = true
          huddle.isApproved = false
          console.log('adding huddle to gundb: ', huddle.id)
          const newHuddle = shogun.get(`${gun.prefix}:huddles/${huddle.id}`).put(huddle)
          gun.huddles.set(newHuddle)
          this.isCreating = false
          this.$router.push(`/h/${this.slugged}`)
        }
      } else {

      }
    },
    styleForType(type){
      if(this.huddle.type == type) return 'bg-black text-white'
      else return 'bg-transparent text-grey-darker'
    }
  }
}
</script>

<style lang="stylus" scoped>
.canvas 
  background-image: url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%23ffffff' fill-opacity='0.047' fill-rule='evenodd'/%3E%3C/svg%3E");
</style>
