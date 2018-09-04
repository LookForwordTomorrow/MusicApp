<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div class="operate-btn left" @click="cancel">{{cancelBtnText}}</div>
            <div class="operate-btn" @click="confirm">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script type="text/javascript">
	export default {
		props: {
		    text: {
		      type: String,
		      default: '确定删除吗？'
		    },
		    cancelBtnText: {
		      type: String,
		      default: '取消'
		    },
		    confirmBtnText: {
		      type: String,
		      default: '确认'
    		}
  		},
		data () {
   		 return {
     		 showFlag: false
   			 }
   			},
   		methods: {
    		show () {
    		  this.showFlag = true
    		},
   			 hide () {
     		 this.showFlag = false
   		 	},
   		 	showConfirm () {
     		 this.$refs.confirm.show()
   			 },
   			 cancel () {
		      this.hide()
		      this.$emit('cancel')
		    },
		    confirm () {
		      this.hide()
		      this.$emit('confirm')
   			 }
 		 },
 		 created() {
 		 	this.hide()
 		 }
  		}
	
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
 .confirm
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom:0
    z-index: 999
    background-color:rgba(10,10,10,0.3)
    &.confirm-fade-enter-active
      animation: confirm-fadein 0.3s
      .confirm-content
        animation: confirm-zoom 0.3s
    .confirm-wrapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      z-index: 1000
      .confirm-content
        width: 270px
        border-radius: 13px
        background:#fff
        .text
          padding: 19px 15px
          line-height: 22px
          text-align: center
          font-size: 14px
          color: rgb(7,17,27)
        .operate
          display: flex
          align-items: center
          text-align: center
          font-size: 14px
          .operate-btn
            flex: 1
            line-height: 22px
            padding: 10px 0
            border-top: 1px solid rgba(149,153,157,0.5)
            color: rgb(7,17,27)
            &.left
              border-right: 1px solid rgba(149,153,157,0.5)


  @keyframes confirm-fadein
    0%
    opacity: 0
    100%
    opacity: 1

  @keyframes confirm-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>