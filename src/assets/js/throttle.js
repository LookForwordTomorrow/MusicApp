export default function throttle(func,delay) {
	let timer
	return function (...args) {
		if(timer) {
			clearTimeout(timer)
		}
		timer=setTimeout(() => {
			func.apply(this,args)
		},delay)
	}
}