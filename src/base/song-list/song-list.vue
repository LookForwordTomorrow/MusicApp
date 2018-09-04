<template>
	<div class="song-list">
		<ul>
			<li class="item" v-for="(song,index) in songs" @click="SongItem(song,index)">
				<div class="content">
					<div class="l-content" v-show="topshow">
						<i>{{index+1}}</i>
					</div>
					<div class="r-content">
						<h2 class="name">{{song.name}}</h2>
						<p class="desc">{{DescSong(song)}}</p>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
	export default {
		props: {
			songs:{
				type:Array,
				default:{}
			},
			topshow:{
				type:Boolean,
				default:false
			}
		},
		methods:{
			DescSong(song){
				return `${song.singer}   ${song.album}`
			},
			SongItem(item,index) {
				 this.$emit('select',item,index)
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.song-list
		.item
			display:flex
			align-items:center
			box-sizing:border-box
			height:64px
			padding:0 20px
			font-size:12px
			border-bottom:rgba(0,0,0,0.2)
			.content
				flex:1
				display:flex
				line-height:20px
				overflow:hidden
				.l-content
					display:inline-block
					flex:0 0 30px
					width:30px
					text-align:left
					border:1px solid #000
					display:flex
					justify-content:center
					flex-direction:column
					font-size:14px
					color:rgb(254,254,65)
				.r-content
					display:inline-block
					flex:1
					.name
						overflow: hidden
						text-overflow:ellipsis
						white-space: nowrap
						color:#fff
					.desc
						overflow: hidden
						text-overflow:ellipsis
						white-space: nowrap
						margin-top:4px
						color:rgba(110,110,130,1)
</style>