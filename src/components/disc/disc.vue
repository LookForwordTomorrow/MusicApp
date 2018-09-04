<template>
	<transition name="slider">
		<music-list v-show="songs" :title="title" :bg-img="bgImg" :songs="songs"></music-list>
	</transition>
</template>
<script>
	import {mapGetters} from 'vuex'
	import {getSongList} from 'api/recommend'
	import {ERR_OK} from 'api/config'
	import {CreateRecommendSong} from 'assets/js/song'
	import MusicList from 'components/music-lists/music-lists'
	export default {
		data() {
			return {
				songs:[]
			}
		},
		created() {
			this._getSongList()
		},
		methods:{
			_getSongList() {
				if(!this.disc.dissid) {
					this.$router.push({
						path:'/recommend'
					})
				}
				getSongList(this.disc.dissid).then((res) => {
					if(res.code===ERR_OK) {
						this.songs=this._normalistSong(res.cdlist[0].songlist)
					}
				})
			},
			_normalistSong(list){
				let ret=[]
				list.forEach((item) => {
					if(item.id&&item.album) {
						ret.push(CreateRecommendSong(item))

					}
				})
				return ret
			}
		},
		computed:{
			title() {
				return this.disc.dissname
			},
			bgImg() {
				return this.disc.imgurl
			},
			...mapGetters([
				'disc'
				])
		},
		components:{
			MusicList
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.disc
		position:fixed
		z-index:100
		left:0
		top:0
		bottom:0
		right:0
		background:rgb(30,10,50)
	.slider-enter-active,.slider-leave-active
		transition:all 0.3s linear
	.slider-enter,.slider-leave-to
		transform:translate3d(100%,0,0)	
</style>