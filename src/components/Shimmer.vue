<template>
  <section class="h-full">
    <article class="background">
      <div class="a"></div>
      <div class="b"></div>
      <div class="c"></div>
      <div class="d"></div>
      <div class="e"></div>
      <div class="f"></div>
      <div class="g"></div>
      <div class="h"></div>
      <div class="i"></div>
      <div class="j"></div>
      <div class="k"></div>
      <div class="l"></div>
    </article>
  </section>
</template>

<script>
  export default {
    name: 'Shimmer'
  }
</script>

<style scoped>
.background {
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: #f6f7f9;
    background-image: linear-gradient(to right, #f6f7f9 0%, #e9ebee 20%, #f6f7f9 40%, #f6f7f9 100%);
    background-repeat: no-repeat;
    background-size: 800px 104px;
    height: 104px;
    position: relative;
}

.background div {
    background: #fff;
    height: 6px;
    left: 0;
    position: absolute;
    right: 0;
}
div.a {
    height: 40px;
    left: 40px;
    right: auto;
    top: 0;
    width: 8px;
}

div.b {
    height: 8px;
    left: 48px;
    top: 0;
}
div.c {
    left: 136px;
    top: 8px;
}
div.d {
    height: 12px;
    left: 48px;
    top: 14px;
}
div.e {
    left: 100px;
    top: 26px;
}
div.f {
    height: 10px;
    left: 48px;
    top: 32px;
}
div.g {
    height: 20px;
    top: 40px;
}
div.h {
    left: 410px;
    top: 60px;
}
div.i {
    height: 13px;
    top: 66px;
}
div.j {
    left: 440px;
    top: 79px;
}
div.k {
    height: 13px;
    top: 85px;
}
div.l {
    left: 178px;
    top: 98px;
}

@keyframes placeHolderShimmer{
  
0% {
    background-position: -468px 0;
}
100% {
    background-position: 468px 0;
}
}
</style>