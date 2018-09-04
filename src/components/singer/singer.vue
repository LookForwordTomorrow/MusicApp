<template>
	<div class="singer" ref="singer">
		<list-view @select="selectSinger" :data="singerList" ref="listview"></list-view>
			<router-view></router-view>
	</div>
</template>
<script type="text/javascript">
	import {getSingerList} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import ListView from 'base/ListView/ListView'
	import {mapMutations} from 'vuex'
	import {playListMixin} from 'assets/js/mixin'
	import Singer from 'assets/js/singer'
	const HOT_NAME="热门"
	const HOT_MAX_LEN=10
	export default{
		mixins:[playListMixin],
		data(){
			return {
				singerList:[]
			}
		},
		created() {
			this._getSingerList();
		},
		methods: {
			handlePlayList(playlist) {
				const bottomPosition=playlist.length > 0 ? '64px' : 0
				this.$refs.singer.style.bottom=bottomPosition
				this.$refs.listview.refresh()
			},
			selectSinger(singer) {
				this.$router.push({
					path:`/singer/${singer.id}`
				})
				this.setSinger(singer)
			},
			_getSingerList() {
				getSingerList().then((res) => {
					if(res.code==ERR_OK){
						this.singerList=this._needList(res.data.list);
					}
				})
			},
			_needList(list)	{
				let map = {
					hot: {
						title:HOT_NAME,
						items:[],
					}
				}
				list.forEach((item,index) => {
					if(index<HOT_MAX_LEN) {
						map.hot.items.push(new Singer({
							id:item.Fsinger_mid,
							name:item.Fsinger_name
						}))
					}
					const key=item.Findex;
					if(!map[key]){
						map[key]={
							title:key,
							items:[]
						}
					}
					map[key].items.push(new Singer({
						id:item.Fsinger_mid,
						name:item.Fsinger_name
					}))
				})
				let hot=[]
				let ret=[]
				for(let index in map) {
					let item=map[index];
					if(item.title.match(/[a-zA-Z]/)){
						ret.push(item)
					}else if(item.title==HOT_NAME) {
						hot.push(item)
					}
				}
				ret.sort((a,b) => {
					return a.title.charCodeAt(0)-b.title.charCodeAt(0)
				})
				return hot.concat(ret);
			},
			...mapMutations({
				setSinger:'SET_SINGER'
			})
		},
		components:{
			ListView
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.singer
		position:fixed
		top:80px
		bottom:0
		width:100%
		z-index:40
</style>