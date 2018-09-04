<template>
	<scroll class="rank" :data="ranks" ref="scroll">
		
		<ul>
			<li class="item" v-for="item in ranks" @click="selectItem(item)">
				<div class="l-wrapper">
					<img :src="item.picUrl" width="80" height="80">
					<div class="title">
						<span class="icon-wrapper">
							<i class="icon-headphones"></i>
						</span>
						<span class="playnum">{{item.listenCount}}</span>
					</div>
				</div>
				<div class="r-wrapper">
					<h2 class="title">{{item.topTitle}}</h2>
					<ul>
						<li v-for="(songs,index) in item.songList" class="songs">
							<p class="text" v-html=""><span class="num">{{index+1}}</span>{{songs.songname}}-{{songs.singername}}</p>
						</li>
					</ul>
				</div>
			</li>
		</ul>
		<loading v-show="!ranks.length"></loading>
		<router-view></router-view>

	</scroll>
	
</template>
<script type="text/javascript">
	import {getRankList} from 'api/rank'
	import {ERR_OK} from 'api/config'
	import scroll from 'base/scorll/scroll'
	import {playListMixin} from 'assets/js/mixin'
	import {mapMutations} from 'vuex'
	import loading from 'base/loading/loading'
	export default {
		mixins:[playListMixin],
		data() {
			return {
				ranks:[]
			}
		},
		created() {
			this.$nextTick(() => {
				this._getRankList()
				this.$refs.scroll.refresh()
			})
		},
		methods:{
			selectItem(item) {
					this.$router.push({
					path:`/rank/${item.id}`
				})
					this.setTopList(item)
				},
			handlePlayList(playlist) {
				const bottomPosition=playlist.length > 0 ? '64px' : 0
				this.$refs.scroll.$el.style.bottom=bottomPosition
				this.$refs.scroll.refresh()
			},
			_getRankList() {
				getRankList().then((res) => {
				if(res.code===ERR_OK) {
					this.ranks=res.data.topList
				}
			})
			},
			
				...mapMutations({
				setTopList:'SET_TOP_LIST'
			})
		},
		components:{
			scroll,
			loading
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "../../assets/css/style.css"
	.rank
		position:fixed
		bottom:0
		top:80px
		width:100%
		overflow:hidden
		.item
			position:relative
			display:flex
			align-items:left
			width:100%
			height:80px
			padding:12px 0 12px 12px
			.l-wrapper
				flex:0 0 26%
				.title
					position:relative
					top:-20px
					.icon-wrapper
						display:inline-block
						width:10px
						height:10px
						line-height:10px
						.icon
							font-size:8px
							background:yellow
					.playnum
						vertical-align:middle
						margin-left:4px
						font-size:10px
			.r-wrapper
				flex:1
				display:flex
				justify-content:center
				align-items:left
				flex-direction:column
				font-size:0
				width:100%
				.title
					font-size:14px
					padding-bottom:5px
				.songs
					.text
						font-size:12px
						color:#fff
						overflow: hidden
						text-overflow:ellipsis
						white-space: nowrap
						width:70%
						.num
							display:inline-block
							font-size:12px
							margin-right:10px
							
</style>