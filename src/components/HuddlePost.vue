<template>
  <div class="rounded-lg shadow p-6 bg-white md:w-full mb-4 cursor-pointer">
    <shimmer v-if="!loaded"></shimmer>
    <div class="w-full flex flex-col relative" v-else>
      <div class="overlay absolute pin"></div>
      <div class="flex items-center mb-2" v-if="post.user">
        <img class="w-8 h-8 rounded-full mr-2" :src="post.user.avatar"/>
        <h4 class="font-normal text-black">{{ post.user.name.replace('.id.blockstack','') }}</h4>
      </div>
      <div>
        <p class="text-grey-darkest leading-loose">{{ post.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Shimmer from '@/components/Shimmer'

export default {
  name: 'HuddlePost',
  props: ['loaded', 'post'],
  components: { Shimmer }
}
</script>

<style lang="stylus" scoped>
.overlay
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(254,254,254,0) 0%, rgba(255,255,255,.97) 97%);
</style>
