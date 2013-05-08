if (typeof Object.create !== 'function') {
	Object.create = function (o) {
		var F = function () {};
		F.prototype = o;
		return new F();
	};
}

var isArray = function isArray(array) {
	return array && typeof array === 'object' && array.constructor === Array;
};

var isArray2 = function isArray2(array) {
	return Object.prototype.toString.apply(array) === '[object Array]';
};