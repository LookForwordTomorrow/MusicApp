<template>
	<div class="search">
		<div class="searchBox-wrapper">
			<search-box ref="searchBox" :newQuery="newquery" @query="getQueryChange"></search-box>
		</div>
		<div class="content-wrapper" v-show="!query">
			<div class="hotkey-wrapper">
				<h1 class="title">热门搜索</h1>
				<ul>
					<li class="item" v-for="item in hotkey" @click="getQuery(item.k)">
						<span class="key">{{item.k}}</span>
					</li>
				</ul>
			</div>
		</div>
		<div class="search-history" v-show="searchHistory.length && !query">
			<h1 class="title">
				<span class="text">搜索历史</span>
				<span class="clear">
					<i class="icon icon-blocked" @click="clearHistory"></i>
				</span>
			</h1>
			<search-list v-show="searchHistory.length && !query" @closeCache="closeCache" :searchHistory="searchHistory" @selectHistory="selectHistory"></search-list>
		</div>
		<div class="suggest-wrapper" v-show="query" ref="suggestWarpper">
			<suggest :query="query" @select="saveSearch" ref="suggest" @listenScroll="blurInput"></suggest>
		</div>
		<router-view></router-view>
	</div>
</template>
<script type="text/javascript">
	import SearchBox from 'base/search-box/search-box'
	import {getHotSinger} from 'api/search'
	import {ERR_OK} from 'api/config'
	import suggest from 'base/suggest/suggest'
	import {mapActions,mapGetters} from 'vuex'
	import SearchList from 'base/search-list/search-list'
	import {playListMixin} from 'assets/js/mixin'
	export default {
		mixins:[playListMixin],
		components:{
			SearchBox,
			suggest,
			SearchList
		},
		created() {
			this._getHotSinger()
		},
		data() {
			return {
				hotkey:[],
				query:'',
				newquery:''
			}
		},
		methods:{
			handlePlayList(playlist) {
				const bottomPosition=playlist.length > 0 ? '64px' : 0
				this.$refs.suggestWarpper.style.bottom=bottomPosition
				this.$refs.suggest.refresh()
			},
			closeCache(item) {
				this.deleteSearchHistory(item)
			},
			saveSearch() {
				this.saveSearchHistory(this.query)
			},
			blurInput() {
				this.$refs.searchBox.blur()
			},
			_getHotSinger() {
				getHotSinger().then((res) => {
					if(res.code===ERR_OK) {
						this.hotkey=res.data.hotkey.slice(0,10)
					}
				})
			},
			selectHistory(item) {
				this.query=item
				this.newquery=item
			},
			clearHistory() {
				this.clearSearchHistory()
			},
			getQuery(query) {
				this.$refs.searchBox.setQuery(query)
			},
			getQueryChange(query) {
				this.query=query
			},
			...mapActions([
				'saveSearchHistory',
				'deleteSearchHistory',
				'clearSearchHistory'
				])
		},
		computed:{
			...mapGetters([
				'searchHistory'
				])
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "../../assets/css/style.css"
	.search
		position:fixed
		width:100%
		height:100%
		.searchBox-wrapper
			width:100%
		.content-wrapper
			position:relative
			top:15px
			left:0
			right:0
			.hotkey-wrapper
				padding:0 20px
				.title
					text-align:center
					line-height:20px
					height:20px
					font-size:14px
					color:#fff
				.item
					display:inline-block
					float:left
					padding:5px 10px
					border-radius:4px
					background:rgba(120,144,111,0.5)
					margin: 10px 5px
					.key
						font-size:13px
		.search-history
			position:absolute
			left:0
			top:270px
			width:100%
			.title
				padding:0 20px
				.text
					display:inline-block
					float:left
					font-size:14px
					color:#fff
					line-height:14px
				.clear
					display:inline-block
					float:right
					.icon
						font-size:12px
						line-height:12px
						color:#fff
		.suggest-wrapper
			position:relative
			left:0
			top:15px
			bottom:0
			overflow:hidden
			height:80%

</style>