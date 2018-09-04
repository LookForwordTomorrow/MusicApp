import * as types from './mutations-types'
import {saveSearch,deleteSearch,clearHistory} from 'assets/js/cache'
export const selectPlay = function ({commit,state},{list,index}) {
	commit(types.SET_SEQUENCE_LIST,list)
	commit(types.SET_PLAYLIST,list)
	commit(types.SET_FULL_SCREEN,true)
	commit(types.SET_CURRENT_INDEX,index)
	commit(types.SET_PLAYING_STATE,true)
}
function findIndex(list , song) {
	return list.findIndex((item) => {
		return item.id===song.id
	})
}
export const insertSong=function({commit,state},song) {
	let playList=state.playList.slice()
	let sequenceList=state.sequenceList.slice()
	let currentIndex=state.currentIndex
	let currentSong=playList[currentIndex]
	let fIndex=findIndex(playList,song)
	currentIndex++
	playList.splice(currentIndex,0,song)
	if(fIndex>-1) {
		if(currentIndex>fIndex) {
			playList.splice(fIndex,1)
			currentIndex--
		}
		else {
			playList.splice(fIndex+1,1)

		}
	}
	let	currentSeqenceIndex=findIndex(sequenceList,currentSong)+1
	let fsIndex=findIndex(sequenceList,song)
	sequenceList.splice(currentSeqenceIndex,0,song)
	if(fsIndex>-1) {
		if(currentSeqenceIndex>fsIndex) {
			sequenceList.splice(fsIndex,1)
		}
		else {
			sequenceList.splice(fsIndex+1,1)
		}
	}
	commit(types.SET_PLAYLIST,playList)
	commit(types.SET_SEQUENCE_LIST,sequenceList)
	commit(types.SET_CURRENT_INDEX,currentIndex)
	commit(types.SET_FULL_SCREEN,true)
	commit(types.SET_PLAYING_STATE,true)
}

export const saveSearchHistory = function ({commit,state},query) {
	commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}

export const deleteSearchHistory = function({commit},query){
  commit(types.SET_SEARCH_HISTORY,deleteSearch(query));
} 

export const clearSearchHistory = function ({commit,state}) {
	commit(types.SET_SEARCH_HISTORY,clearHistory())
}
export const deleteSong = function ({commit,state},song) {
	let playList=state.playList.slice()
	let sequenceList=state.sequenceList.slice()
	let currentIndex=state.currentIndex
	let pIndex=findIndex(playList,song)
	playList.splice(pIndex,1)
	let sIndex=findIndex(sequenceList,song)
	sequenceList.splice(sIndex,1)
	if(currentIndex>pIndex || currentIndex===playList.length) {
		currentIndex--
	}
	commit(types.SET_PLAYLIST,playList)
	commit(types.SET_SEQUENCE_LIST,sequenceList)
	commit(types.SET_CURRENT_INDEX,currentIndex)
	const playingState = playList.length>0
	commit(types.SET_PLAYING_STATE,playingState)

}

export const deleteSongList = function({commit,state},songs) {
	commit(types.SET_PLAYLIST,[])
	commit(types.SET_SEQUENCE_LIST,[])
	commit(types.SET_CURRENT_INDEX,-1)
	commit(types.SET_PLAYING_STATE,false)
}
