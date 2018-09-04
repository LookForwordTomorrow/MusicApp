<template>
	<transition name="slider">
		<div class="favourite" v-show="Show">
			<div class="top-wrapper">
				<h1 class="title">{{getTitle}}</h1>
				<span class="close" @click.stop="Hide">×</span>
			</div>
			<div class="list-wrapper">
				<tab-list @changeTabNumOne="numOne" @changeTabNumTwo="numTwo" :tabnum="num"></tab-list>
			</div>
			<div class="searchHistoryList" v-show="num===1">
				<search-list v-show="searchHistory.length"
				 @closeCache="closeCache" 
				 :searchHistory="searchHistory" 
				 @selectHistory="selectHistory"></search-list>
			</div>
			<div class="favouriteHistoryList" v-show="num===2">
				
			</div>
		</div>
	</transition>
</template>
<script>
	import TabList from 'base/tab-list/tab-list'
	import SearchList from 'base/search-list/search-list'
	import {mapGetters,mapActions} from 'vuex'
	export default {
		props: {
			title: {
				type:String,
				default:'我的收藏'
			}
		},
		data () {
			return {
				show:true,
				num:1,
				query:''
			}
		},
		computed: {
			getTitle() {
				return this.title
			},
			Show() {
				return this.show=true
			},
			...mapGetters([
				'searchHistory'
				])
		},
		methods: { 
			Hide() {
				this.$router.back()
				return this.show=false
			},
			numOne() {
				this.num=1
			},
			numTwo() {
				this.num=2
			},
			selectHistory(item) {
				this.query=item
			},
			closeCache(item) {
				this.deleteSearchHistory(item)
			},
			...mapActions([
				'deleteSearchHistory',
				])
		},
		components: {
			TabList,
			SearchList
		}
	}
</script>
<style scoped rel="stylesheet/stylus" lang="stylus">
	.favourite
		position:fixed
		left:0
		right:0
		top:0
		bottom:0
		width:100%
		z-index:300
		background:rgb(30,10,50)
		&.slider-enter-active,&.slider-leave-active
			transition:all 0.1s
		&.slider-enter,&.slider-leave-to
			transform:translate3d(100%,0,0)
		.top-wrapper
			position:relative
			left:0
			top:20px
			text-align:center
			width:100%
			.title
				font-size:14px
				color:#fff
				line-height:14px
			.close
				padding:0 5px
				position:absolute
				right:5px
				top:0px
				font-size:16px
				font-weight:bolder
				color:red
		.searchHistoryList
			position:relative
			left:0
			top:70px
			padding:0 20px
</style>