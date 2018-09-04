<template>
	<div class="searchBox">
		<i class="search-icon icon-search"></i>
		<input type="text" ref="input" v-model="query" name="searchBox" class="input" :placeholder="placeholder">
		<div class="search-dismiss"  @click="queryClear">
			<i class="icon" v-show="query">×</i>
		</div>
	</div>
</template>
<style type="text/css">
	{
		text-indent: 
	}
</style>
<script>
	import throttle from 'assets/js/throttle'
	export default {
		props: {
			placeholder: {
				type:String,
				default:'请输入歌手/专辑/歌曲'
			},
			newQuery:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				query:''
			}
		},
		methods:{
			blur() {
				this.$refs.input.blur()
			},
			queryClear() {
				this.query=''
			},
			setQuery(query) {
				this.query=query
			}
		},
		created() {
			this.$watch('query',throttle((newQuery) => {
				this.$emit('query',newQuery)
			},200))
		},
		watch:{
			newQuery(nquery) {
				this.query=nquery
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '../../assets/css/style.css'
	.searchBox
		display:flex
		align-items:center
		box-sizing:border-box
		width:100%
		padding:0 35px
		height:40px
		background:rgba(30,10,50,0.5)
		.search-icon
			flex:0 0 40px
			width:40px
			font-size:20px
			line-height:30px
			height:30px
			text-align:center
			background:#fff
			color:rgb(149,153,157)
			border:none
			border-radius:8px 0 0 8px
			box-sizing:border-box
		.input
			flex:0 0 70%
			text-indent:10px
			width:70%
			height:30px
			line-height:40px
			font-size:14px
			color:#000
			border:none
			box-sizing:border-box
			outline:none
		.search-dismiss
			display:inline-block
			flex:0 0 40px
			width:40px
			line-height:30px
			height:30px
			text-align:center
			border-radius:0 8px 8px 0
			box-sizing:border-box
			text-align:center
			background:#fff
			.icon
				color:rgb(149,153,157)
				font-size:30px
</style>