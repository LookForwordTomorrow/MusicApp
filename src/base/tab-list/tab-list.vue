<template>
	<div class="tab-list">
		<div class="tab-wrapper">
			<span class="tab-left" :class="{'active':tabnum===1}" @click="changeTabNumOne">{{getLeftTitle}}</span>
			<span class="tab-right" :class="{'active':tabnum===2}" @click="changeTabNumTwo">{{getRightTitle}}</span>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			leftTitle: {
				type:String,
				default:'最近播放'
			},
			rightTitle: {
				type:String,
				default:'我的收藏'
			},
			tabnum: {
				type:Number,
				default:1
			}
		},
		computed: {
			getLeftTitle() {
				return this.leftTitle
			},
			getRightTitle() {
				return this.rightTitle
			}
		},
		methods: {
			changeTabNumOne() {
				this.$emit('changeTabNumOne')
			},
			changeTabNumTwo() {
				this.$emit('changeTabNumTwo')
			}
		},
		watch: {
			tabnum(newVal) {
				return newVal 
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.tab-list
		position:relative
		top:50px
		left:25%
		width:100%
		text-align:center
		.tab-wrapper
			width:50%
			.tab-left,.tab-right
				width:40%
				display:inline-block
				line-height:14px
				height:14px
				font-size:12px
				box-sizing:box-border
				border:1px solid #fff
				padding:2% 4%
				float:left
			.tab-left
				border-radius:4px 0 0 4px
				&.active
					background:#fff
					color:rgb(30,10,50)
			.tab-right
				border-radius:0 4px 4px 0
				&.active
					background:#fff
					color:rgb(30,10,50)
</style>