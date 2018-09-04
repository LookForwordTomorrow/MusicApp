<template>
	<transition name="slider">
		<div>
			<div class="singerDetail">
				<music-list v-show="songs" :title="title" :bg-img="bgImg" :songs="songs"></music-list>
			</div>
		</div>
	</transition>
</template>
<script>
	import {mapGetters} from 'vuex'
	import {getSingerDetails} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import {CreateSong} from 'assets/js/song'
	import MusicList from 'components/music-lists/music-lists'
	export default {
		computed:{
			title(){
				return this.singer.name
			},
			bgImg(){
				return this.singer.avatar
			},
			...mapGetters([
				'singer'
				])
		},
		data() {
			return {
				songs:[]
			}
		},
		created(){	
			this.getDetail()
		},
		methods:{
			getDetail(){
				if(!this.singer.id){
					 this.$router.push({
						path:'/singer'
					})
					 return
				}
				getSingerDetails(this.singer.id).then((res) => {
					if(res.code===ERR_OK) {
							this.songs=this._normalistSong(res.data.list)
					}
				})
			},
			_normalistSong(list){
				let ret=[]
				list.forEach((item) => {
					let {musicData} =item
					if(musicData.songid&&musicData.albummid) {
						ret.push(CreateSong(musicData))

					}
				})
				return ret
			}
		},
		components:{
			MusicList
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.singerDetail
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