'use strice'

exports.signature = function *(next) {
	this.body = {
		success: true
	};
}
