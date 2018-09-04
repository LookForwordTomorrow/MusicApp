<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
			<slot></slot>
		</div>
		<div class="dots">
			<span v-for="(dot,index) in dots" class="dot" :class="{'active':currentPageIndex===index}"></span>
		</div>
	</div>
</template>
<script>
	import BScorll from 'better-scroll'
	import {addClass} from 'assets/js/dom'
	export default{
		props:{
			loop:{
				type:Boolean,
				default:true
			},
			autoPlay:{
				type:Boolean,
				default:true
			},
			interval:{
				type:Number,
				default:4000
			}
		},
		data(){
			return {
				currentPageIndex:0,
				dots:[]
			}
		},
		mounted(){
			setTimeout(() => {
				this._setSliderWidth();
				this._initDots();
				this._initSlider();
				if(this.autoPlay){
					this._autoPlay();
				}
			},20)
			window.addEventListener('resize',() => {
				if(!this.slider){
					return
				}
				this._setSliderWidth(true)
				this.slider.refresh()
			})
		},
		created(){

		},
		methods:{
			_setSliderWidth(isResize){
				this.children=this.$refs.sliderGroup.children;
				let width=0;
				let sliderWidth=this.$refs.slider.clientWidth;
				for(let i=0;i<this.children.length;i++){
					let child=this.children[i];
					addClass(child,'slider-item')
					child.style.width=sliderWidth+"px"
					width+=sliderWidth;
				}
				if(this.loop && !isResize){
					width+=2*sliderWidth
				}
				this.$refs.sliderGroup.style.width=width+"px";
			},
			_initSlider(){
				this.slider=new BScorll(this.$refs.slider,{
					scrollX:true,
					scrollY:false,
					momentum:false,
					snap:true,
					snapLoop:this.loop,
					snapThreshold:0.3,
					snapSpeed:400
				})
				this.slider.on("scrollEnd",() => {
					let pageIndex=this.slider.getCurrentPage().pageX
					if(this.loop){
						pageIndex-=1;
					}
					this.currentPageIndex=pageIndex;
					if(this.autoPlay){
						clearTimeout(this.timer)
						this._autoPlay();
					}
				})

			},
			_initDots() {
				this.dots=new Array(this.children.length)
			},
			_autoPlay() {
				let nextPage=this.currentPageIndex+1;
				if(this.loop) {
					nextPage+=1;
				}
				this.timer=setTimeout(() => {
					this.slider.goToPage(nextPage,0,400)
				},this.interval)
			}
		},
		destroyed(){
			clearTimeout(this.timer)
		}

	}
</script>
<style  scoped lang="stylus" rel="stylesheet/stylus">
	.slider
		position:relative
		min-height:1px
		margin-bottom:15px
		.slider-group
			overflow:hidden
			white-space:nowrap
			max-height:100%
			.slider-item
				float:left
				box-sizing:border-box
				overflow:hidden
				text-align:center
				a
					display:block
					width:100%
					overflow:hidden
					text-decoration:none
				img
					display:block
					width:100%
		.dots
			position:absolute
			right:0
			left:0
			bottom:12px
			text-align:center
			font-size:0
			.dot
				display:inline-block
				margin:0 4px
				width:8px
				height:8px
				background:rgba(255, 255, 255, 0.5)
				border-radius:50%
				&.active
					background:rgb(240,20,20)
				
				

</style>