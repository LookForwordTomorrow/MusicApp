import {mapGetters,mapMutations} from 'vuex'
import {playMode} from 'assets/js/config'
import {changeRandom} from 'assets/js/random' 
export const playListMixin= {
	computed:{
		...mapGetters([
			'playList'
			])
	},
	mounted() {
		this.handlePlayList(this.playList)
	},
	activated() {
		this.handlePlayList(this.playList)
	},
	watch:{
		playList(newVal) {
				this.handlePlayList(newVal)
		}
	},
	methods:{
		handlePlayList(){
			throw new Error('components must import a handlePlayList function')
		}
	}
}

export const modeMixin = {
	computed:{
		ModeIcon() {
				return this.mode === playMode.sequence ? 'icon-loop2' : this.mode === playMode.loop ? 'icon-infinite' : 'icon-shuffle'
			},
			...mapGetters([
				'mode',
				'sequenceList'
				])
	},
	methods:{
		changeMode() {
				const mode=(this.mode+1) % 3
				this.setPlayMode(mode)
				let list=null
				if(mode===playMode.random) {
					list=changeRandom(this.sequenceList)
				} else {
					list=this.sequenceList
				}
				this.resetCurrentSong(list)
				this.setPlayList(list)
			},
			resetCurrentSong(list) {
				let index=list.findIndex((item) => {
					return item.id===this.currentSong.id
				})
				this.setCurrentIndex(index)
			},
			...mapMutations({
				setPlayMode:'SET_PLAY_MODE',
				setPlayList:'SET_PLAYLIST'
			})
	}
}