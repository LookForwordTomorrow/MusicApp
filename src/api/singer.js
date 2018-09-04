import jsonp from 'assets/js/jsonp'
import {commonParams,options} from 'api/config'
import axios from 'axios'
export function getSingerList() {
	const url='https://c.y.qq.com/v8/fcg-bin/v8.fcg';
	const data=Object.assign({},commonParams,{
			pagesize: 100,
			pagenum: 1,
			page:'list',
			g_tk: 1664029744,
			loginUin: 0,
			hostUin: 0,
			notice: 0,
			platform: 'yqq',
			needNewCode: 0,
			channel:'singer',
			key:'all_all_all'
	})
	return jsonp(url,data,options);
}
export function getSingerDetails(singerID) {
	const url='https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
	const data=Object.assign({},commonParams,{
			begin: 0,
			num: 100,
			g_tk: 1664029744,
			hostUin: 0,
			platform:'yqq',
			needNewCode: 0,
			order:'listen',
			songstatus:1,
			singermid:singerID
	})
	return jsonp(url,data,options);
}