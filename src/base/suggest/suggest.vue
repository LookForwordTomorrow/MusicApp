<template>
	<scroll class="suggest" :data="keylist" ref="scroll" :update="update" @scrollToEnd="upData"  :isscroll="isscroll" @beforeScrollStart="listenScroll">
		
		<ul class="suggest-list">
			<li class="item" v-for="item in keylist" @click="selectItem(item)">
				<i class="icon" :class="getItemIcon(item)" v-show="item.type!=='singer'"></i>
				<img v-show="item.type==='singer'" :src="singerImg" width="30" height="30" class="singerimg">
				<div class="name">
					<p class="text" v-html="getDescName(item)"></p>
				</div>
			</li>
			<loading v-show="hasMore"></loading>
		</ul>
		<div class="no-result-wrapper" v-show="!hasMore && !keylist.length">
			<no-result></no-result>
		</div>
	</scroll>
</template>
<script>
	import {getSearchKey} from 'api/search'
	import {ERR_OK} from 'api/config'
	import {CreateSong} from 'assets/js/song'
	import scroll from 'base/scorll/scroll'
	import loading from 'base/loading/loading'
	import Singer from 'assets/js/singer'
	import {mapMutations,mapActions} from 'vuex'
	import {playListMixin} from 'assets/js/mixin'
	import NoResult from 'base/no-result/no-result/no-result'
	const TYPE_SINGER='singer'
	const PERPAGE=20
	export default {
		props: {
			query: {
				type:String,
				default:''
			},
			showSinger:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				keylist:[],
				page:1,
				singerImg:'',
				update:true,
				downdate:true,
				hasMore:false,
				isscroll:true,
				tipShow:false
			}
		},
		methods: {
			refresh() {
				this.$refs.scroll.refresh()
			},
			listenScroll() {
				this.$emit("listenScroll")
			},
			handlePlayList(playlist) {
				const bottomPosition=playlist.length > 0 ? '64px' : 0
				this.$refs.scroll.style.bottom=bottomPosition
				this.$refs.scroll.refresh()
			},
			selectItem(item) {
				if(item.type===TYPE_SINGER) {
					const singer=new Singer({
						id:item.singermid,
						name:item.singername,
					})
					this.$router.push({
						path:`/search/${singer.id}`
					})
					this.setSinger(singer)
				} else {
					this.insertSong(item)
				}
				this.$emit('select')
			},
			getItemIcon(item) {
				if(item.type===TYPE_SINGER) {
					this.singerImg=`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.singermid}.jpg?max_age=2592000`
				} else {
					return 'icon-headphones'
				}
			},
			getDescName(item) {
				if(item.type===TYPE_SINGER) {
					return item.singername
				} else {
					return `${item.name}-${item.singer}`
				}
			},
			_getSearchKey(query) {
				this.hasMore=true
				this.page=1
				this.$refs.scroll.scrollTo(0,0)
				getSearchKey(query,this.page,this.showSinger,PERPAGE).then((res) => {
					if(res.code===ERR_OK) {
						this.keylist=this._genResult(res.data)
						this._checkMore(res.data)
					}
				})
			},
			_checkMore(data) {
				const song=data.song
				if(!song.list.length || (song.curnum+song.curpage*PERPAGE) > song.totalnum) {
					this.hasMore=false
				}
			},
			upData() {
				if(!this.hasMore) {
					return
				}
				this.page++
				getSearchKey(this.query,this.page,this.showSinger,PERPAGE).then((res) => {
						if(res.code===ERR_OK) {
							this.keylist=this.keylist.concat(this._genResult(res.data))
							this._checkMore(res.data)
						}
					})
			},
			_genResult(list) {
				let res=[]
				if(list.zhida &&list.zhida.singerid) {
					res.push({...list.zhida,...{type:TYPE_SINGER}})
				}
				if(list.song) {
					res=res.concat(this._normalistSong(list.song.list))
				}
				return res
			},
			_normalistSong(list){
				let ret=[]
				list.forEach((item) => {
					let musicData =item
					if(musicData.songid&&musicData.albummid) {
						ret.push(CreateSong(musicData))

					}
				})
				return ret
			},
			...mapMutations({
				setSinger:'SET_SINGER'
			}),
			...mapActions([
				'insertSong'
				])
		},
		watch: {
			query(newQuery) {
				this._getSearchKey(newQuery)
			}
		},
		components:{
			scroll,
			loading,
			NoResult
		}
	}
</script>
<style scoped rel="stylesheet/stylus" lang="stylus">
@import '../../assets/css/style.css'
	.suggest
		height:100%
		overflow:hidden
		.suggest-list
			padding:0 30px
			.item
				display:flex
				align-items:center
				padding-bottom:20px
				.singerimg
					width:30px
					height:30px
					border-radius:50%
					margin-right:15px
					vertical-align:top
					display:inline-block
				.icon
					flex:0 0 30px
					width:30px
					font-size:20px
					display:inline-block
					margin-right:15px
				.name
					flex:1
					font-size:14px
					color:#fff
					overflow:hidden
					.text
						overflow:hidden
						text-overflow:ellipsis
						white-space:nowrap
			.no-result-wrapper
				position:absolute
				width:100%
				top:50%
				transform:translateY(-50%)
		.no-result-wrapper
			position:fixed
			top:50%
			left:50%
			transform:translate3d(-50%,-50%,0)

</style>