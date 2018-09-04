import {commonParams,options} from 'api/config'
import axios from 'axios'
export function getRankList() {
	const url='/api/getRankList'
	const data=Object.assign({},commonParams,{
		g_tk:5381,
		format:'json',
		notice:0,
		platform:'h5',
		needNewCode:1
	})
	return axios.get(url,{
		params:data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}

export function getMusicList(topid) {
	const url="/api/getMusicList"
	const data=Object.assign({},commonParams,{
		topid:topid,
		format:'json',
		notice:0,
		platform:'h5',
		needNewCode:1,
		tpl:3,
		page:'detail',
		type:'top'
	})
	return axios.get(url,{
		params:data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}