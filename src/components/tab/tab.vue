<template>
	<div class="tab">
		<router-link tag="div" class="tab-item" to="/recommend">
			<span class="tab-link">推荐</span>
		</router-link>
		<router-link tag="div" class="tab-item" to="/singer">
			<span class="tab-link">歌手</span>
		</router-link>
		<router-link tag="div" class="tab-item" to="/rank">
			<span class="tab-link">排行</span>
		</router-link>
		<router-link tag="div" class="tab-item" to="/search">
			<span class="tab-link">搜索</span>
		</router-link>
	</div>
</template>
<script>
</script>
<style rel="stylesheet/stylus" scoped lang="stylus">
	.tab
		display:flex
		.tab-item
			flex:1
			text-align:center
			float:left
			font-size:16px
			line-height:18px
		.router-link-active::after
			text-align:center
			content:' '
			display:block
			position:relative
			left:12.5%
			padding-bottom:8px
			width:75%
			border-bottom:2px solid red

</style>