function Random(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min)
}
export function changeRandom(list) {
	let arr=list.slice()
	for(let i=0;i<arr.length;i++) {
		let k=Random(i,0)
		let t=arr[i]
		arr[i]=arr[k]
		arr[k]=t
	}
	return arr
}