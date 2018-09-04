<template>
	<div class="progress-bar" ref="progressWrapper" @click="clickProgress">
		<div class="bar-inner">
			<div class="progress" ref="progress"></div>
			<div class="progress-btn-wrapper"
			 @touchstart="progressTouchStart"
			 @touchmove="progressTouchMove"
			 @touchend="progressTouchEnd"
			  v-show="barShow">
				<div class="progress-btn" ref="progressBtn"></div>
			</div>
		</div>
	</div>
</template>
<script>
	const PROGRESS_BTN_LENGTH=14
	export default {
		props: {
			precent: {
				type:Number,
				default:0
			},
			needbar: {
				type:Boolean,
				default:true
			},
			needclick: {
				type:Boolean,
				default:true
			}
		},
		created() {
			this.touch={}
		},
		methods: {
			clickProgress(e) {
				if(!this.needclick) {
					return 
				}
				const progressbarRect=this.$refs.progress.getBoundingClientRect()
				const offsetX=e.pageX-progressbarRect.left
				this._moveElement(offsetX)
				this._sendProgressPrecent()
			},
			progressTouchStart(e) {
				this.touch.flag=true
				this.touch.startX=e.touches[0].pageX
				this.touch.leftPosition=this.$refs.progress.clientWidth
			},
			progressTouchMove(e) {
				if(!this.touch.flag) {
					return
				}
				const detialx=e.touches[0].pageX-this.touch.startX
				const offsetX=Math.min(this.$refs.progressWrapper.clientWidth-PROGRESS_BTN_LENGTH, Math.max(0,this.touch.leftPosition+detialx))
				this._moveElement(offsetX)
			},
			progressTouchEnd() {
				this.touch.flag=false
				this._sendProgressPrecent()
			},
			_moveElement(offsetX) {
				this.$refs.progress.style.width=`${offsetX}px`
				this.$refs.progressBtn.style.transform=`translate3d(${offsetX}px,0,0)`
			},
			_sendProgressPrecent() {
				const progressWidth=this.$refs.progressWrapper.clientWidth-PROGRESS_BTN_LENGTH
				const precent=this.$refs.progress.clientWidth/progressWidth
				this.$emit('ProgressPrecent',precent)
			}
		},
		computed: {
			barShow(){
				return this.needbar
			}
		},
		watch: {
			precent(newPrecent) {
				if(newPrecent>0 && !this.touch.flag) {
					let progressWidth=this.$refs.progressWrapper.clientWidth-PROGRESS_BTN_LENGTH
					let offsetWithd=newPrecent*progressWidth
					this.$refs.progress.style.width=`${offsetWithd}px`
					if(!this.needbar) {
						return false
					}
					this.$refs.progressBtn.style.transform=`translate3d(${offsetWithd}px,0,0)`
				}
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.progress-bar
		height:30px
		.bar-inner
			position:relative
			top:13px
			height:4px
			width:100%
			background:rgba(0, 0, 0, 1)
			.progress
				position:absolute
				height:100%
				background:#fff
			.progress-btn-wrapper
				position:absolute
				left:-8px
				top:-13px
				width:30px
				height:30px
				.progress-btn
					position:relative
					left:7px
					top:7px
					box-sizing:border-box
					width:16px
					height:16px
					background:yellow
					color:#fff
					border-radius:50%
					border:solid 3px #fff
</style>