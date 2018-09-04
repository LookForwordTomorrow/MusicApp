<template>
	<transition name="slide">
		<div class="playlist" v-show="showFlag" @click.stop="hide">
			<div class="list-wrapper" @click.stop="">
				<div class="list-header">
					<h1 class="title">
						<i class="icon" :class="ModeIcon" @click="changeMode"></i>
						<span class="text" v-html="modeText"></span>
						<span class="clear" @click="clearSongs"><i class="clear-icon icon-blocked"></i></span>
					</h1>
				</div>
				<scroll ref="scroll" :data="sequenceList" class="list-content">
					<transition-group name="list" tag="ul">
						<li :key="item.id" class="item" ref="item"  v-for="(item,index) in sequenceList" @click="selectItem(item,index)">
							<i class="current" :class="nowIconStyle(item)"></i>
							<span class="text">{{item.name}}</span>
							<span class="like">
								<i class="good-icon">❤</i>
							</span>
							<span class="delete">
								<i class="delete-icon" @click.stop="deleteOne(item)">×</i>
							</span>

						</li>
					</transition-group>
				</scroll>
				<v-button @toFavourite="getToFavourite" class="button-Wrapper"></v-button>
				<div class="close" @click.stop="hide">
					<i class="close-icon">关闭</i>
				</div>
			</div>
			<confrim ref="confirm" @confirm="clear"></confrim>
		</div>
	</transition>
</template>
<script>
	import {mapGetters,mapMutations,mapActions} from 'vuex'
	import scroll from 'base/scorll/scroll'
	import {playMode} from 'assets/js/config'
	import {modeMixin} from 'assets/js/mixin'
	import confrim from 'base/comfirm/comfirm'
	import VButton from 'base/button/button'
	export default{
		mixins:[modeMixin],
		props:{
			
		},
		data() {
			return {
				showFlag:false
			}
		},

		methods: {
			selectItem(item,index) {
				if(this.mode===playMode.random) {
					index=this.playList.findIndex((song) => {
						return song.id===item.id
					})
				}
				this.setCurrentIndex(index)
				this.setPlayingState(true)
			},
			getToFavourite() {
				this.$router.push({
					path:'/Favourite'
				})
			},
			deleteOne(item) {
				this.deleteSong(item)
				if(!this.playList.length) {
					this.hide()
				}
			},
			nowIconStyle(item) {
				if(item.id===this.currentSong.id) {
					return 'icon-play2'
				}
				return ''
			},
			clearSongs() {
				this.$refs.confirm.show()
			},
			clear() {
				this.deleteSongList()
			},
			jumpScrollElement() {
				const index=this.sequenceList.findIndex((song) => {
					return song.id===this.currentSong.id
				})
				this.$refs.scroll.scrollToElement(this.$refs.item[index],300)
			},
			hide() {
				this.showFlag=false
			},
			show() {
				this.showFlag=true
				setTimeout(() => {
					this.$refs.scroll.refresh()
					this.jumpScrollElement()
				},20)
			},
			...mapMutations({
				setPlayingState:'SET_PLAYING_STATE',
				setCurrentIndex:'SET_CURRENT_INDEX'
			}),
			...mapActions([
				'deleteSong',
				'deleteSongList'
				])
		},
		computed: {
			...mapGetters([
				'sequenceList',
				'currentSong',
				'playList'
				]),
			modeText() {
				return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '循环播放' : '随机播放'
			}
		},
		watch: {
			currentSong(newsong,oldsong) {
				if(!newsong) {
					return
				}
				if(!this.showFlag || oldsong.id===newsong.id) {
					return 
				}
				this.jumpScrollElement()
			}
		},
		components: {
			scroll,
			confrim,
			VButton
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "../../assets/css/style.css"
	.playlist
		position:fixed
		left:0
		right:0
		bottom:0
		top:0
		z-index:200
		background:rgba(30,10,50,0.4)
		.list-wrapper
			position:absolute
			width:100%
			bottom:0
			background:rgb(30,10,50)
			.list-header
				padding:20px 15px
				margin-bottom:10px
				.title
					display:flex
					align-items:center
					line-height:20px
					font-size:14px
					.icon
						font-size:14px
					.text
						margin-left:20px
						font-size:12px
					.clear
						position:absolute
						right:30px
			.list-content
				max-height:280px
				min-height:280px
				overflow:hidden
				.item
					display:flex
					padding:14px 15px
					font-size:12px
					&.list-enter-avtive,&.list-leave-active
						transition:all 0.1s
					&.list-enter,&.list-leave-to
						height:0
					.current
						flex:0 0 30px
						color:yellow
					.text
						flex:1
					.like
						flex:0 0 30px
						.good-icon
							color:yellow
					.delete
						flex:0 0 30px
						.delete-icon
							color:yellow
			.button-Wrapper
				padding-bottom:60px
		.close
			height:30px
			line-height:30px
			text-align:center
			width:100%
			padding:15px 0
			background:rgb(53,53,53)
			.close-icon
				font-size:14px
				color:#fff
		&.slide-enter-active,&.slide-leave-active
			transition:opacity 0.3s
			.list-wrapper
				transition:all 0.3s
		&.slide-enter,&.slide-leave-to
			opacity:0
			.list-wrapper
				transform:translate3d(0,100%,0)
		
</style>