<template>
	<div class="noResult">
		<div class="noResultIcon"></div>
		<p class="text">{{gettext}}</p>
	</div>
</template>
<script>
	export default {
		props: {
			text: {
				type:String,
				default:"抱歉  没有搜索的信息"
			}
		},
		computed: {
			gettext() {
				return this.text
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.noResult
		text-align:center
		.noResultIcon
			width:86px
			height:90px
			margin:0 auto
			background:url('../images/icon.jpg')
			background-size:100% 100%
		.text
			margin-top:30px
			font-size:14px
			color:#fff
</style>