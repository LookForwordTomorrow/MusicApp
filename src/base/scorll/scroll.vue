<template>
	<div ref="scroll">
		<slot></slot>
	</div>
</template>
<script>
	import BScorll from 'better-scroll'
	export default{
		props:{
			probeType:{
				type:Number,
				default:1
			},
			click:{
				type:Boolean,
				default:true
			},
			data:{
				type:Array,
				default:[]
			},
			listenScroll:{
				type:Boolean,
				default:false
			},
			update:{
				type:Boolean,
				default:false
			},
			isscroll:{
				type:Boolean,
				default:false
			}
		},
		mounted(){
			setTimeout(() => {
				this._initScroll();
				
			},20)
		},
		methods:{
			_initScroll(){
				if(!this.$refs.scroll){
					return;
				}
				this.scroll=new BScorll(this.$refs.scroll,{
					probeType:this.probeType,
					click:this.click
				})
				if(this.listenScroll) {
					let that=this
					this.scroll.on('scroll',(pos) => {
						that.$emit('scroll',pos)
					})
				}
				if(this.update) {
					this.scroll.on("scrollEnd",() => {
						if(this.scroll.y<=this.scroll.maxScrollY+50) {
							this.$emit('scrollToEnd')
						}
					})
				}
				if(this.isscroll) {
					this.scroll.on('beforeScrollStart',() => {
						this.$emit('beforeScrollStart')
					})
				}
			},
			enable(){
				this.scroll&&this.scroll.enable()
			},
			disable(){
				this.scroll&&this.scroll.disable()
			},
			refresh(){
				this.scroll&&this.scroll.refresh()
			},
			scrollTo(){
				this.scroll&&this.scroll.scrollTo.apply(this.scroll,arguments)
			},
			scrollToElement(){
				this.scroll&&this.scroll.scrollToElement.apply(this.scroll,arguments)
			}
		},
		watch:{
			data(){
				setTimeout(() => {
					this.refresh();
				},20)
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
	
</style>