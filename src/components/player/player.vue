<template>
	<div class="player" v-show="playList.length>0" :class="{'playermask-show':fullScreen}">
		<transition name="normal">
			<div class="normal-player" v-show="fullScreen">
				<div class="background" v-show="fullScreen">
					<img :src="currentSong.image" width="100%" height="100%">
				</div>
				<div class="top">
					<div class="back" @click="back">
						<i class="icon icon-undo2"></i>
					</div>
					<h1 class="title" v-html="currentSong.name"></h1>
					<h2 class="subtitle" v-html="currentSong.singer"></h2>
				</div>
				<div class="middle" @touchstart="middleStart" @touchmove="middleMove" @touchend="middleEnd">
					<div class="middle-l" ref="cd">
						<div class="back-wrapper" >
							<div class="back" :class="playRotate" ref="rotateStart">
								<img :src="currentSong.image" class="cd" ref="wrapper">
							</div>
						</div>
						<div class="lyricshow-wrapper" v-show="currentLyric">
							<p class="text">{{currentLyricShow}}</p>
						</div>
					</div>
					<scroll  :data="currentLyric && currentLyric.lines"  class="middle-r" ref="lyricList">
						<div class="lyric-wrapper">
							<div class="currentLyric" v-if="currentLyric">
								<p ref="lyricLine" :class="{'current':currentLineNum===index}" class="text" v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
							</div>
						</div>
					</scroll>
				</div>
				<div class="bottom">
					<div class="progress-wrapper">
						<span class="time time-l">{{format(currentTime)}}</span>
						<div class="progress-bar-wrapper">
							<progress-bar @ProgressPrecent='getNewPrecent' :precent="precent"></progress-bar>
						</div>
						<span class="time time-r">{{format(currentSong.duration)}}</span>
					</div>
					<div class="operators">
						<div class="b_level3 icon" >
							<i class="icon-sequence" :class="ModeIcon" @click.stop="changeMode"></i>
						</div>
						<div class="b_level2 icon" @click.stop="prev">
							<i class="icon-prev icon-backward"></i>
						</div>
						<div class="b_level1 icon">
							<i class="icon-play icon-play2" @click.stop="songPlay" :class="playIcon"></i>
						</div>
						<div class="b_level2 icon" @click.stop="next">
							<i class="icon-next icon-forward2"></i>
						</div>
						<div class="b_level3 icon">
							<i class="icon-like icon-heart"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="miniPlayer">
			<div class="mini-player" v-show="!fullScreen" @click="screenShow">
				<div class="icon" :class="playRotate">
					<img :src="currentSong.image"  width="40" height="40" style="border-radius:50%;">
				</div>
				<div class="text">
					<h2 class="name" v-html="currentSong.name"></h2>
					<p class="singer" v-html="currentSong.singer"></p>
				</div>
				<div class="control">
					<div class="play" @click.stop="songPlay" :class="playIcon"></div>
					<div class="next icon-forward2" @click.stop="next"></div>
				</div>
				<div class="control-right">
					<div class="iconPlaylist">
						<span class="icon icon-menu" @click.stop="PlayListShow"></span>
					</div>
				</div>
				<div class="mini-process">
					<progress-bar :precent="precent" :needbar="miniNeedBar" :needclick="miniNeedBar"></progress-bar>
				</div>
			</div>
		</transition>
		<play-list ref="playlist"></play-list>
		<audio :src="currentSong.url" @ended="end" ref="songAudio" @play="ready" @error="error" @timeupdate="timeupdate"></audio>
	</div>
</template>
<script>
	import {mapGetters,mapMutations} from 'vuex'
	import ProgressBar from 'base/progess-bar/progress-bar'
	import PlayList from 'components/play-list/play-list'
	import animation from 'create-keyframe-animation'
	import Lyric from 'lyric-parser'
	import scroll from 'base/scorll/scroll'
	import {playMode} from 'assets/js/config'
	import {modeMixin} from 'assets/js/mixin'
	export default{
		mixins:[modeMixin],
		methods: {
			PlayListShow() {
				this.$refs.playlist.show()
			},
			prev() {
				if(!this.playready) {
					return
				}
				if(this.playList.length===1) {
					this.loop()
					return
				} else {
					let index = this.currentIndex-1
				if(index===-1) {
					index=this.playList.length-1
				}
				this.setCurrentIndex(index)
				if(!this.playing) {
					this.songPlay()
				}
				
				}
				this.playready=false
			},
			next() {
				if(!this.playready) {
					return
				}
				if(this.playList.length===1) {
					this.loop()
					return
				} else {
					let index = this.currentIndex+1
				if(index===this.playList.length) {
					index=0
				}
				this.setCurrentIndex(index)
				if(!this.playing) {
					this.songPlay()
				}
				
				}
				this.playready=false
			},
			end() {
				if(this.mode===playMode.loop) {
					this.loop()
				} else {
					this.next()
				}
				
			},
			loop() {
				this.$refs.songAudio.currentTime=0
				this.$refs.songAudio.play()
				if(this.currentLyric) {
					this.currentLyric.seek(0)
				}
			},
			enter(el,done) {
				const {offsetX,offsetY,scale}=this._getpositionInformation()
				let animate={
					0:{
						transform:`translate3d(${offsetX},${offsetY},0) scale(${scale})`
					},
					60:{
						transform:'translate3d(0,0,0) scale(1.1)'
					},
					100:{
						transform:'translate3d(0,0,0) scale(1)'
					}
				}
				animation.registerAnimation({
					name:'move',
					animate,
					presets:{
						duration:1400,
						easing:'linear'
					}
				})
				animation.runAnimation(this.$refs.wrapper,'move',done)
			},
			afterEnter() {
				animation.unregisterAnimation('move')
				this.$refs.wrapper.style.animation=''
			},
			leave(el,done) {

			},
			afterLeave() {

			},
			getLyric() {
				if(this.currentIndex<0) {
					this.$refs.songAudio.pause()
					return
				}
				this.currentSong.getLyric().then((lyric) => {
					if(this.currentSong.lyric!=lyric) {
						return
					}
					this.currentLyric=new Lyric(lyric,this.handleLyric)
					if(this.playing) {
						this.currentLyric.play()
					}
				}).catch(() => {
					this.currentLyric=null
					this.currentLyricShow=''
					this.currentLineNum=0
				})
			},
			handleLyric({lineNum,txt}) {
				this.currentLineNum=lineNum
				this.currentLyricShow=txt
				if(lineNum>5) {
					let lineEle=this.$refs.lyricLine[lineNum-5]
					this.$refs.lyricList.scrollToElement(lineEle,1000)
					
				} else {
					this.$refs.lyricList.scrollTo(0,0,1000)
				}
			},
			middleStart(e) {
				this.touch.startX=e.touches[0].pageX
				this.touch.startY=e.touches[0].pageY
				this.touch.flag=true
			},
			middleMove(e) {
				if(!this.touch.flag) {
					return
				}
				let detailX=e.touches[0].pageX-this.touch.startX
				let detailY=e.touches[0].pageY-this.touch.startY
				if(Math.abs(detailY)>Math.abs(detailX)) {
					return 
				}
				let left=this.middleChange?0:-window.innerWidth
				let offsetX=Math.min(0,Math.max(-innerWidth,left+detailX))
				this.touch.precent=Math.abs(offsetX/innerWidth)
				this.$refs.lyricList.$el.style.transform=`translate3d(${offsetX}px,0,0)`
				this.$refs.cd.style.opacity=1-this.touch.precent
				this.touch.move=true
			},
			middleEnd() {
				let offsetX=null
				let opacity=null
				if(!this.touch.move){
					return 
				}
				if(this.middleChange){
					if(this.touch.precent>0.3) {
						offsetX=-window.innerWidth
						opacity=0
						this.middleChange=false
						this.touch.flag=false
					} else {
						offsetX=0
					}
				} else {
					if(this.touch.precent<0.7) {
						offsetX=0
						opacity=1
						this.middleChange=true
						this.touch.flag=false
					}else {
						opacity=0
						offsetX=-window.innerWidth
					}
				}
				this.touch.move=false
				this.$refs.lyricList.$el.style.transform=`translate3d(${offsetX}px,0,0)`
				this.$refs.cd.style.opacity=opacity
				this.$refs.lyricList.$el.style.transition=`all 0.3s linear`
			},
			_getpositionInformation() {
				const target=40
				const paddingLeft=30
				const paddingBottom=40
				const paddingTop=80
				const width=window.innerWidth*0.8
				const scale=target/width
				const offsetX=-(window.innerWidth/2-paddingLeft)
				const offsetY=window.innerHeight-paddingTop-paddingBottom-width/2
				return {
					offsetX,
					offsetY,
					scale
				}
			},
			format(interval) {
				interval= interval | 0
				const minute = interval / 60 | 0
				const second = this._pad(interval % 60) 
				return minute+':'+second
			},
			_pad(num,n=2) {
				let len=num.toString().length
				while(len < n) {
					num='0'+num
					len++;
				}
				return num
			},
			getNewPrecent(precent) {
				if(!this.playing) {
					this.songPlay()
				}
				let newPrecent=precent*this.currentSong.duration
				this.$refs.songAudio.currentTime=newPrecent
				if(this.currentLyric) {
					this.currentLyric.seek(newPrecent*1000)
				}
			},
			timeupdate(e) {
				this.currentTime=e.target.currentTime
			},
			ready() {
				this.playready=true
			},
			error() {
				this.playready=true
			},
			back() {
				this.setFullScreen(false)
			},
			songPlay() {
				if(!this.playready) {
					return 
				}
				if(this.currentLyric) {
					this.currentLyric.togglePlay()
				}
				this.setPlayingState(!this.playing)
			},
			screenShow() {
				this.setFullScreen(true)
			},
			...mapMutations({
				setFullScreen:'SET_FULL_SCREEN',
				setPlayingState:'SET_PLAYING_STATE',
				setCurrentIndex:'SET_CURRENT_INDEX'
			})
		},
		data() {
			return {
				playready:false,
				currentTime:0,
				miniNeedBar:false,
				currentLyric:null,
				currentLineNum:0,
				middleChange:true,
				currentLyricShow:null
			}
		},
		mounted() {

		},
		created() {
			this.touch={}
		},
		computed: {
			playRotate() {
				return this.playing ? 'play' : 'play pause'
			},
			playIcon() {
				return this.playing ? 'icon-play2' : 'icon-pause'
			},
			...mapGetters([
				'currentSong',
				'playing',
				'currentIndex',
				'fullScreen',
				'playList'
			]),
			precent(){
				if(!this.playready) {
					return 0
				}
				return this.currentTime/this.currentSong.duration
			}
		},
		watch: {
			currentSong(newsong,oldsong){
				if(!newsong) {
					return
				}
				if(newsong.id===oldsong.id) {
					return 
				}
				if(this.currentLyric) {
					this.currentLyric.stop()
					this.currentTime=0
					this.currentLyric=''
					this.currentLineNum=0
					this.currentLyricShow=""
				}
				clearTimeout(this.timer)
				this.timer=setTimeout(() => {
					this.$refs.songAudio.play()
					this.getLyric()
				},1000)
				
				
			
			},
			playing(newState) {
				const audio = this.$refs.songAudio
				this.$nextTick(() => {
					 newState ? audio.play() : audio.pause() 
				})
			}
			
		},
		components:{
			ProgressBar,
			scroll,
			PlayList
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	@import '../../assets/css/style.css'
	.player
		position:fixed
		left:0
		right:0
		top:0
		width:100%
		z-index:100
		background:rgba(30,10,50,1)
		&.playermask-show
			height:100%
		.normal-player
			.background
				position:fixed
				left:0
				top:0
				bottom:0
				right:0
				width:100%
				opacity:0.6
				filter:blur(10px)
				z-index:-1
			.top
				position:relative
				left:0
				top:10px
				z-index:200
				.back
					z-index:200
					position:absolute
					display:inline-block
					margin:8px 0 0 10px
					.icon
						font-size:24px
						line-height:20px
						padding:10px

				.title
					position:relative
					top:10px
					display:block
					text-align:center
					font-size:20px
					padding-left:15%
					padding-right:15%
					width:70%
				.subtitle
					margin-top:25px
					text-align:center
					font-size:14px
			.middle
				position:fixed
				top:100px
				left:0%
				width:100%
				height:60%
				text-align:center
				z-index:200
				.middle-l
					display:inline-block
					width:100%
					height:100%
					.back-wrapper
						margin:auto
						width:310px
						height:310px
						text-align:center
						.back
							background-image:url('./images/cd.png')
							background-repeat: no-repeat
							background-size:308px 308px
							vertical-align:middle
							display:table-cell
							width:310px
							height:310px
							&.play
								animation:rotate 20s linear infinite 
							&.pause
								animation-play-state:paused
							.cd
								border-radius:50%
								width:300px
								height:300px
					.lyricshow-wrapper
						position:absolute
						bottom:10px
						left:0
						right:0
						padding:0 12%
						.text
							line-height:31px
								font-size:14px
				.middle-r
					position:absolute
					left:100%
					top:0
					display:inline-block
					width:100%
					height:100%
					overflow:hidden
					.lyric-wrapper
						width:100%
						.currentLyric
							text-align:center
							padding:0 12%
							.text
								line-height:31px
								font-size:14px
								&.current
									color:yellow
			.bottom
				z-index:200
				position:fixed
				left:0
				bottom:8%
				width:100%
				.progress-wrapper
					display:flex
					align-items:center
					width:80%
					margin:0px auto
					padding:10px 0
					.time
						color:#fff
						font-size:10px
						flex:0 0 30px
						width:30px
						&.time-l
							text-align:left
						&.time-r
							text-align:right
					.progress-bar-wrapper
						flex:1
				.operators
					display:flex
					align-items:center
					.icon
						font-size:0px
						height:30px
						flex:1
						text-align:center
						color:red
					.b_level1
						font-size:36px
						line-height:36px
					.b_level2
						font-size:32px
						line-height:32px
					.b_level3
						font-size:30px
						line-height:30px
			&.normal-enter-active,&.normal-leave-active
				transition:all 0.4s
				.top,.bottom
					transition:all 0.4s cubic-bezier(0.86,0.18,0.82,1.3)
			&.normal-enter,&.normal-leave-to
				opacity:0
				.top
					transform:translate3d(0,-100px,0)
				.bottom
					transform:translate3d(0,100px,0)
		.mini-player
			position:fixed
			bottom:4px
			left:0
			width:100%
			box-sizing:border-box
			padding:10px
			display:flex
			background:rgb(17,153,159)
			.icon
				transform-origin:50% 50%;
				flex:0 0 60px
				text-align:center
				width:60px
				&.play
					animation:rotate 20s linear infinite 
				&.pause
					animation-play-state:paused
			.text
				padding-left:15px
				flex:0 0 120px
				display:flex
				justify-content:center
				align-items:left
				flex-direction:column
				line-height:20px
				overflow:hidden
				font-size:0
				.name
					max-width:100px
					font-size:12px
					overflow: hidden
					text-overflow:ellipsis
					white-space: nowrap
				.singer
					max-width:100px
					font-size:10px
					overflow: hidden
					text-overflow:ellipsis
					white-space: nowrap
			.control
				flex:0 0 100px
				display:flex
				align-items:center
				.play,.next
					flex:1
					line-height:100%
					font-size:24px
			.control-right
				flex:1
				display:flex
				align-items:center
				padding-left:20px
				.icon
					font-size:30px
			.mini-process
				z-index:200
				position:fixed
				bottom:13px
				left:0
				height:4px
				width:100%
			&.miniPlayer-enter-active,&.miniPlayer-leave-active
				transition:all 0.4s linear
			&.miniPlayer-enter,&.miniPlayer-leave-to
				opacity:0
			@keyframes rotate
				from
					transform:rotate(0deg)
				to
					transform:rotate(360deg)
</style>