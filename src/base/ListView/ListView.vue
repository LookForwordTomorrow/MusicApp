<template>
	<scroll :data="data" 
	class="list-view" 
	ref="listview" 
	:listenScroll="listenScroll"
	:probeType="probeType"
	@scroll="scroll">
		<ul>
			<li v-for="group in data" class="group-wrapper" ref="listgroup">
				<h2 class="list-group-title">{{group.title}}</h2>
				<ul>
					<li v-for="item in group.items" class="group-item" @click="selectItem(item)">
						<img width="40" height="40" class="avatar" v-lazy="item.avatar">
						<span class="name">{{item.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div class="list-shortcut">
			<ul>
				<li v-for="(item,index) in shortCutList" 
				class="item" 
				@touchstart="onClickToPosition" 
				:data-index="index"  
				@touchmove.stop.prevent="onShortCutTouchMove"
				:class="{'current':currentIndex===index}">{{item}}</li>
			</ul>
		</div>
		<div class="list-fixed" v-show="fixedTextList" ref="fixed">
			<h1 class="fixedTitle">{{fixedTextList}}</h1>
		</div>
	</scroll>
</template>
<script>
	import scroll from 'base/scorll/scroll'
	import {getElementStyle} from 'assets/js/dom'
	import loading from 'base/loading/loading'
	const TOUCH_TEDAL=16
	const TITLE_DIFF=30
	export default {
		props: {
			data:{
				type:Array,
				default:[]
			}
		},
		data() {
			return {
				scrollY:-1,
				currentIndex:0,
				diff:-1
			}
		},
		created() {
			this.touch={},
			this.listenScroll=true,
			this.probeType=3
		},
		methods: {
			selectItem(item) {
				this.$emit('select',item)
			},
			scroll(pos) {
				this.scrollY=pos.y
			},
			refresh() {
				this.$refs.listview.refresh()
			},
			onClickToPosition(e) {
				let getindex=getElementStyle(e.target,'index')
				let firstTouch=e.touches[0]
				this.touch.y1=firstTouch.pageY;
				this.touch.nowIndex=getindex;
				this._scrollTo(getindex)
			},
			onShortCutTouchMove(e) {
				let firstTouch=e.touches[0]
				this.touch.y2=firstTouch.pageY;
				let delta=(this.touch.y2-this.touch.y1)/ TOUCH_TEDAL | 0
				let getindex = parseInt(this.touch.nowIndex)+delta
				this._scrollTo(getindex)
			},
			_scrollTo(index) {
				if(!index && index!=0) {
					return
				}
				if(index<0) {
					index=0
				}else if(index>this.listHeight.length-2) {
					index=this.listHeight.length-2
				}
				this.scrollY=-this.listHeight[index]
				this.$refs.listview.scrollToElement(this.$refs.listgroup[index],500)
			},
			_catchHeight() {
				this.listHeight=[]
				const list=this.$refs.listgroup
				let height=0
				this.listHeight.push(height)
				for(let i=0;i<list.length;i++) {
					let item=list[i]
					height+=item.clientHeight
					this.listHeight.push(height)
				}
			}
		},
		watch: {
			data() {
			setTimeout(() => {
				this._catchHeight();
				},20);
			},
			scrollY(newY) {
				const listHeight=this.listHeight
				if(newY>0){
					this.currentIndex=0
					return
				}
				for(let i=0;i<listHeight.length-1;i++) {
					let height1=listHeight[i]
					let height2=listHeight[i+1]
					if(-newY>=height1 && -newY<height2) {
						this.currentIndex = i
						this.diff=height2+newY
						return 
					}
				}

				this.currentIndex = listHeight-2
			},
			diff(newval) {
				let fixedTop=(newval>0 && newval<TITLE_DIFF) ? newval-TITLE_DIFF : 0
				if(this.fixedTop===fixedTop) {
					return 
				}
				this.fixedTop=fixedTop
				this.$refs.fixed.style.transform=`translate3d(0,${fixedTop}px,0)`
			}

		},
		components: {
			scroll,
			loading
		},
		computed: {
			shortCutList() {
				return this.data.map((group) => {
					return group.title.substr(0,1)
				})
			},
			fixedTextList(){
				if(this.scrollY>0){
					return ''
				}
				return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.list-view
		position:relative
		left:0
		top:0
		width:100%
		height:100%
		overflow:hidden
		z-index:30
		.group-wrapper
			padding-bottom:30px
			.list-group-title
				height:30px
				line-height:30px
				padding-left:20px
				font-size:14px
				background:rgb(149,153,157)
			.group-item
				display:flex
				align-items:center
				padding:20px 0 0 30px
				.avatar
					width:50px
					height:50px
					border-radius:50%
				.name
					margin-left:20px
					font-size:12px
		.list-shortcut
			position:absolute
			right:0
			top:50%
			transform:translateY(-50%)
			width:20px
			padding:20px 0
			border-radius:10px
			text-align:center
			.item 
				padding:3px
				line-height:1
				color:rgb(220,220,200)
				font-size:12px
				&.current
					color:yellow
		.list-fixed
			position:absolute
			left:0
			top:0px
			width:100%
			z-index:20
			.fixedTitle
				height:30px
				line-height:30px
				padding-left:20px
				font-size:14px
				background:rgb(149,153,157)
</style>