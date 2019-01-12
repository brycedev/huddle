<template>
  <div class="z-max fixed pin bg-smoke justify-center subtle overflow-y-scroll" :class="open" @click.self="close">
    <div class="flex justify-center mt-20 px-6">
      <div class="rounded-lg shadow-lg p-6 px-8 bg-white w-full mb-4 max-w-sm relative">
        <div class="w-full flex flex-col justify-center items-center">
          <div class="flex w-full flex-col items-center justify-center z-50">
            <h2 class="text-grey-darkest leading-normal font-thin text-center max-w-xs">Are you sure you want to block this user?</h2>
            <div class="rounded-full relative mt-6 w-3/4">
              <select class="block appearance-none w-full bg-khak-grey text-grey-darker py-3 px-4 pr-8 rounded-full outline-none" v-model="reportMode">
                <option :value="0">Yes, please</option>
                <option :value="1">Yes, and report them</option>
              </select>
              <div class="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-grey-darker">
                <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            <div class="mt-6 bg-huddle-blue rounded-full px-6 text-white text-center py-3 cursor-pointer" @click="reportUser()" v-if="reportMode == 0">
              <span>Block</span>
            </div>
            <div class="py-3 px-4 rounded-lg w-full max-w-sm bg-khak-grey flex flex-col mt-6" v-if="reportMode == 1">
              <textarea id="text" v-model="reportReason" class="bg-transparent flex-grow mb-4 h-24 block appearance-none text-grey-darkest leading-loose font-light outline-none text-normal h-24 resize-none" placeholder="Brief reason for reporting..."></textarea>
              <div class="w-full flex justify-between items-center">
                <div>

                </div>
                <div class="bg-huddle-blue rounded-full px-4 text-sm text-white text-center py-2 cursor-pointer" @click="reportUser()">
                  <span>Report</span>
                </div>
              </div>
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
    prop: ['identity'],
    name: 'ReportUser',
    props: ['visible'],
    store: ['bus', 'user', 'users'],
    data() {
      return {
        reportReason: '',
        reportMode: 1
      }
    },
    computed: {
      open(){
        return this.visible ? 'opacity-100 visible' : 'opacity-0 invisible'
      },
    },
    methods: {
      close(){
        this.bus.$emit(`close-report`)  
      },
      async reportUser(){
        if(this.reportMode == 0){
          const newReport = this.$gun.get(`${gunPrefix}:reports`).put({
            u: this.identity.id,
            r: false
          })
          this.user.preferences.filters.blockedUsers.push(this.identity.id)
          await blockstack.putFile('preferences.json', JSON.stringify(this.user.preferences), { encrypt : true })
          this.$router.push('/')
        } else {
          if(this.reportReason !== ''){
            const newReport = this.$gun.get(`${gunPrefix}:reports`).put({
              u: this.identity.id,
              r: this.reportReason
            }) 
            this.user.preferences.filters.blockedUsers.push(this.identity.id)
            await blockstack.putFile('preferences.json', JSON.stringify(this.user.preferences), { encrypt : true })
            this.$router.push('/')
          } else {
            // need to actually fill out report
          }
        }
        
      }
    },
    watch: {
      visible(value) {
        if(value){
          document.getElementById('body').style.overflowY = 'hidden'
        } else {
          document.getElementById('body').style.overflowY = 'auto'
        }
      }
    },
  }
</script>