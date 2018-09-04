<template>
	<div class="search-list" v-show="searchHistory.length">
		<ul>
			<li class="search-item" v-for="item in searchHistory" @click="selectHistory(item)">
				<span class="text">{{item}}</span>
				<span class="icon" @click.stop="Close(item)">
					×
				</span>
			</li>
		</ul>
	</div>
</template>
<script>
	export default{
		props:{
			searchHistory:{
				type:Array,
				default:[]
			}
		},
		methods:{
			selectHistory(item) {
				this.$emit('selectHistory',item)
			},
			Close(item) {
				this.$emit('closeCache',item)
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.search-list
		width:100%
		margin:30px 0 0 0
		.search-item
			padding:0 20px
			margin:5px 0
			.text
				display:inline-block
				line-height:14px
				font-size:14px
			.icon
				display:inline-block
				float:right
				line-height:12px
				font-size:12px

</style>