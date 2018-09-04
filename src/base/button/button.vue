<template>
	<div class="button">
		<span class="icon" @click.stop="toFavourite()">{{getTitle}}</span>
	</div>
</template>
<script>
	export default {
		props: {
			title: {
				type:String,
				default:'点击添加喜欢列表'
			}
		},
		data() {
			return {

			}
		},
		computed: {
			getTitle() {
				return this.title
			}
		},
		methods: {
			toFavourite() {
				this.$emit("toFavourite")
			}
		}
	}
</script>
<style scoped rel="stylesheet/stylus" lang="stylus">
	.button
		position:relative
		top:30px
		width:100%
		text-align:center
		.icon
			padding:8px 12px
			width:80px
			height:40px
			border-radius:40px
			border:1px solid red
</style>