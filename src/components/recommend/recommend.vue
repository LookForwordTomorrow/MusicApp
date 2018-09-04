<template>
	<div id="recommend" ref="recommend">
		<scroll class="recommend-content" ref="scroll" :data="disclist">
			<div class="recommend-list">
				<div class="slider-wrapper" v-if="recommend.length">
				<slider>
					<div v-for="(item,index) in recommend">
						<a :href="item.linkUrl">
							<img class="needsclick"  @load="checkImg"  :src="item.picUrl">
						</a>
					</div>
				</slider>
				</div>
				<h1 class="list-h">推荐榜单</h1>
				<ul class="list-ul">
					<li v-for="item in disclist" class="item" @click="selectItem(item)">
						<div class="icon">
							<img v-lazy="item.imgurl"  width="60" height="60" />
						</div>
						<div class="text">
							<h2 class="name" v-html="item.creator.name"></h2>
							<div class="desc" v-html="item.dissname"></div>
							<div class="listennum">
								<span class="listen-tip">播放量：</span>
								<span class="num" v-html="item.listennum"></span>
							</div>
						</div>
					</li>
				</ul>
			</div>
				<loading  v-show="!disclist.length"></loading>
		</scroll>
		<router-view></router-view>
	</div>
</template>
<script type="text/javascript">
	import loading from 'base/loading/loading'
	import slider from 'base/slider/slider'
	import {getRecommend,getDiscList} from 'api/recommend'
	import {ERR_OK} from 'api/config'
	import scroll from 'base/scorll/scroll'
	import {playListMixin} from 'assets/js/mixin'
	import {mapMutations} from 'vuex'
	export default{
		mixins:[playListMixin],
		data(){
			return{
				recommend:[],
				disclist:[]
			}
		},
		created(){
				this._getDiscList()
				this._getCommend()
		},
		methods:{
			handlePlayList(playlist) {
				const bottomPosition=playlist.length > 0 ? '64px' : 0
				this.$refs.recommend.style.bottom=bottomPosition
				this.$refs.scroll.refresh()
			},
			selectItem(item) {
				this.$router.push({
					path:`/recommend/${item.dissid}`
				})
				this.setDisc(item)
			},
			_getCommend(){
				getRecommend().then((res) => {
					if(res.code==ERR_OK){
						this.recommend=res.data.slider;
					}
				})
			},
			_getDiscList(){
				getDiscList().then((res) => {
					if(res.code==ERR_OK){
						this.disclist=res.data.list;
					}
				})
			},
			checkImg(){
				if(!this.checkload){
					this.$refs.scroll.refresh();
					this.checkload=true;
				}
			},
			...mapMutations({
				setDisc:'SET_DISC'
			})
		},
		components:{
			slider,
			scroll,
			loading
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	#recommend
		position:fixed
		width:100%
		top:84px
		bottom:0
		.recommend-content
			height:100%
			overflow:hidden
			.recommend-list
				.list-h
					display:block
					text-align:center
					margin-bottom:20px
					color:rgb(150,150,150)
				.list-ul
					width:100% 
					overflow:hidden	
					.item
						display:flex
						box-sizing:border-box
						padding:0 20px 20px 20px
						.icon
							flex:0 0 60px
							width:60px
							padding-right:20px
						.text
							display:flex
							flex:1
							justify-content:center
							align-items:left
							flex-direction:column
							line-height:20px
							overflow:hidden
							font-size:0
							.name
								font-size:14px
							.desc
								font-size:12px
							.listennum
								color:red
								font-size:12px
								.listen-tip
									display:inline-block
									margin-right:10px
								.num
									display:inline-block
								

				
</style>