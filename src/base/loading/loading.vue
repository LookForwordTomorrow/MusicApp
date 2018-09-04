<template>
	<div class="loading">
		<img src="./images/icon.gif" width="24" height="24">
		<p class="desc">{{title}}</p>
	</div>
</template>
<script>
	export default{
		props:{
			title:{
				type:String,
				default:"正在加载..."
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.loading
		width:100%
		z-index:200
		text-align:center
		.desc
			margin-top:10px
			line-height:12px
			font-size:12px
			color:#fff
</style>