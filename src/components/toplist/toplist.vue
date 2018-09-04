<template>
	<transition name="slider">
		<music-list :songs="songs" :title="title" :bg-img="bgImg" :topshow="topshow"></music-list>
	</transition>
</template>
<script>
	import {mapGetters} from 'vuex'
	import MusicList from 'components/music-lists/music-lists'
	import {getMusicList} from 'api/rank'
	import {ERR_OK} from 'api/config'
	import {CreateSong} from 'assets/js/song'
	export default {
		data() {
				return {
					songs:[],
					topshow:true
				}
			},
		computed:{
			
			...mapGetters([
				'toplist'
				]),
			title(){
				return this.toplist.topTitle
			},
			bgImg(){
				return this.toplist.picUrl
			}
		},
		components:{
			MusicList
		},
		created() {
			this._getTopList()
		},
		methods:{
			_getTopList() {
				getMusicList(this.toplist.id).then((res) => {
					if(res.code===ERR_OK) {
						this.songs=this._normalistSong(res.songlist)
					}
				
				})
			},
			_normalistSong(list){
				let ret=[]
				list.forEach((item) => {
					let musicData =item.data
					if(musicData.songid&&musicData.albummid) {
						ret.push(CreateSong(musicData))

					}
				})
				return ret
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
	.toplist
		position:fixed
		left:0
		top:0
		bottom:0
		right:0
		z-index:100
		background:rgb(50,10,30)
</style>