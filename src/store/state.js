import {playMode} from 'assets/js/config'
import {getCacheHistory} from 'assets/js/cache'
const state= {
	singer:{},
	playing:false,
	fullScreen:false,
	playList:[],
	sequenceList:[],
	mode:playMode.sequence,
	currentIndex:-1,

	disc:{},

	searchHistory:getCacheHistory(),

	toplist:{}
}
export default state