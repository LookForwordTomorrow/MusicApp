<template>
	<div class="music-list">
		<div class="back" @click="Close">
			<i class="icon-back icon-undo2"></i>
		</div>
		<h1 class="title" v-html="title"></h1>
		<div class="bg-img" :style="bgStyle" ref="bgImg">
			<div class="filter"></div>
		</div>
		<div class="changeMask" ref="changeMask"></div>
		<div class="mask" ref="mask"></div>
		<scroll @scroll="scrollList" :listenScroll="listenScroll" :probeType="probeType" class="scroll-wrapper" :data="songs" ref="list">
			
			<div class="song-list-wrapper">
				<song-list :topshow="topshow" :songs="songs" @select="selectItem"></song-list>
			</div>
			<loading v-show="!songs.length"></loading>
		</scroll>
	</div>
</template>
<script>
	import scroll from 'base/scorll/scroll'
	import SongList from 'base/song-list/song-list'
	import {mapActions} from 'vuex'
	import {playListMixin} from 'assets/js/mixin'
	import loading from 'base/loading/loading'
	import {getElementStyle} from 'assets/js/dom'
	const BGIMG_MAX_SACLE = 60
	const BGIMG_MIN_HEIGHT = 40
	export default {
		mixins:[playListMixin],
		props: {
			songs: {
				type:Array,
				default:[]
			},
			bgImg: {
				type:String,
				default:''
			},
			title: {
				type:String,
				default:''
			},
			topshow: {
				type:Boolean,
				default:false
			}
		},
		created() {
				this.probeType=3,
				this.listenScroll=true
		},
		data() {
			return {
				scrollY:-1
			}
		},
		computed: {
			bgStyle(){
				return `background-image:url(${this.bgImg});`
			}
		},
		methods: {
			handlePlayList(playlist) {
				const bottomPosition=playlist.length > 0 ? '64px' : 0
				this.$refs.list.$el.style.bottom=bottomPosition
				this.$refs.list.refresh()
			},
			selectItem(item,index) {
				this.selectPlay({
					list:this.songs,
					index
				})
			},
			Close(){
				this.$router.back()
			},
			scrollList(pos) {
				this.scrollY=pos.y
			},
			...mapActions([
				'selectPlay'
				])
		},
		watch:{
			scrollY(newY) {
				let maxDiff=Math.max(this.maxHeight+BGIMG_MIN_HEIGHT,newY)
				let maxRadius=Math.max(0,Math.abs(newY))
				let zindex=0
				let scale=1
				const changeMask=this.$refs.changeMask
				let nowOpacity=getElementStyle(changeMask,'opacity')
				let changeHeight=changeMask.offsetTop-40
				let opacityPercent=1.5-((Math.abs(this.scrollY)/changeHeight))
				let borderRadiusPercent=50-(((Math.abs(this.scrollY)/changeHeight))*100)
				if(newY<0)
				{
					this.$refs.changeMask.style.borderRadius=`${borderRadiusPercent}% ${borderRadiusPercent}% 0 0`
					if(borderRadiusPercent<=0)
					{
						this.$refs.changeMask.style.opacity=opacityPercent
					}
				}
				this.$refs.mask.style.transform=`translate3d(0,${maxDiff}px,0)`
				this.$refs.changeMask.style.transform=`translate3d(0,${maxDiff}px,0)`
				
				this.$refs.mask.style.webkitTransform=`translate3d(0,${maxDiff}px,0)`
				this.$refs.changeMask.style.webkitTransform=`translate3d(0,${maxDiff}px,0)`
				const precent = Math.abs(newY / (-this.maxHeight))
				const precentMax = Math.abs(BGIMG_MAX_SACLE/ (-this.maxHeight))
				if(newY > 0 && newY < BGIMG_MAX_SACLE) {
					scale=1+precent 
				} else if( newY >= BGIMG_MAX_SACLE) {
					
					scale = 1 +precentMax
				}
				if(this.maxHeight+40>newY) {
					zindex=10
					this.$refs.bgImg.style.paddingTop = 0
					this.$refs.bgImg.style.height = `${BGIMG_MIN_HEIGHT}px`
				} else {
					this.$refs.bgImg.style.paddingTop = '70%'
					this.$refs.bgImg.style.height = 0
				}
				this.$refs.bgImg.style.zIndex=zindex
				this.$refs.bgImg.style.transform=`scale(${scale})`
				this.$refs.bgImg.style.webkitTransform=`scale(${scale})`
			}
		},
		components: {
			scroll,
			SongList,
			loading
		},
		mounted(){
			this.maxHeight=-(this.$refs.bgImg.clientHeight)
			this.$refs.list.$el.style.top=`${this.$refs.bgImg.clientHeight}px`
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '../../assets/css/style.css'
	.music-list
		position:fixed
		z-index:100
		left:0
		top:0
		bottom:0
		right:0
		background:rgb(30,10,50)
		.back
			position:absolute
			left:6px
			top:0
			z-index:50
			.icon-back
				display:block
				padding:10px
				font-size:20px
				color:#fff
		.title
			position:absolute
			top:0
			left:10%
			z-index:40
			width:80%
			overflow: hidden
			text-overflow:ellipsis
			white-space: nowrap
			text-align:center
			line-height:40px
			font-size:20px
			color:#fff
		.bg-img
			position:absolute
			width:100%
			height:0
			padding-top:70%
			transform-origin:top
			background-size:cover
		.changeMask
			position:absolute
			left:0
			top:220px
			width:100%
			height:62.64px
			background:rgb(30,10,50)	
			border-radius:50% 50% 0 0
		.mask
			position:absolute
			left:0
			top:262.64px
			width:100%
			height:100%
			background:rgb(30,10,50)
		.scroll-wrapper
			position:fixed
			left:0
			width:100%
			bottom:0
			.song-list-wrapper
				position:relative
				top:0
				overflow:hidden
</style>