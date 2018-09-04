<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <transition name="slider">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <player></player>
  </div>
</template>

<script>
  import MHeader  from 'components/m-header/m-header';
  import Tab  from 'components/tab/tab';
  import player from 'components/player/player'
export default {
  components:{
    MHeader,
    Tab,
    player
  }
}
</script>

<style rel="stylesheet/stylus" lang="stylus" >
  @import '../src/assets/css/reset.css'
  .slider-enter-active,.slider-leave-active
    transition:all 0.3s linear
  .slider-enter
    transform:translate3d(100%,0,0) 
    opacity:0
  .slider-leave-to
    transform:translate3d(-100%,0,0) 

</style>
