import * as types from './mutations-types'

const matutaions = {
	/*[types.SET_SINGER](state,singer){
		state.singer=singer
	}*/
	[types.SET_SINGER](state,singer){
		state.singer=singer
	},
	[types.SET_PLAYING_STATE](state,flag) {
		state.playing=flag
	},
	[types.SET_FULL_SCREEN](state,flag) {
		state.fullScreen=flag
	},
	[types.SET_PLAYLIST](state,list) {
		state.playList=list
	},
	[types.SET_SEQUENCE_LIST](state,flag) {
		state.sequenceList=flag
	},
	[types.SET_PLAY_MODE](state,mode) {
		state.mode=mode
	},
	[types.SET_CURRENT_INDEX](state,index) {
		state.currentIndex=index
	},

	[types.SET_DISC](state,disc){
		state.disc=disc
	},

	[types.SET_SEARCH_HISTORY](state,searchHistory){
		state.searchHistory=searchHistory
	},
	[types.SET_TOP_LIST](state,toplist) {
		state.toplist=toplist
	},

}

export default matutaions