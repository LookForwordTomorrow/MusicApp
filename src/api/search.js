import {commonParams} from 'api/config'
import axios from 'axios'
export function getHotSinger() {
	const url='/api/getHotSinger'
	const data=Object.assign({},commonParams,{
		format:'json',
		notice:0,
		platform:'h5',
		needNewCode:1,
		notice:0
	})
	return axios.get(url,{
		params:data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function getSearchKey(searchKey,page,zhida,perpage) {
	const url='/api/getSearchKey'
	const data=Object.assign({},commonParams,{
		format:'json',
		notice:0,
		platform:'h5',
		needNewCode:1,
		w:searchKey,
		zhidaqu:1,
		catZhida:zhida ? 1 : 0,
		t:0,
		flag:1,
		ie:'utf-8',
		sem:1,
		aggr:0,
		perpage,
		n:perpage,
		p:page,
		remoteplace:'txt.mqq.all'
	})
	return axios.get(url,{
		params:data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}