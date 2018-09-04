export function addClass(el,className) {
	if(hasClass(el,className)){
		return
	}
	let newClass=el.className.split(' ');
	newClass.push(className);
	el.className=newClass.join(' ');
}
export function hasClass(el,className) {
	let reg=new RegExp('(^|\\s)'+className+'(\\s|$)');
	return reg.test(el.className);
}
export function getElementStyle(el,name,value) {
	const prev='data-'
	name=prev+name
	if(value) {
		return el.setAttribute(name,value)
	}else {
		return el.getAttribute(name)
	}
}