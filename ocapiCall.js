const { request } = require('https')

function call(o, h, ho = {}, data = '') {
	const callOptions = Object.assign(
		{
			method: 'POST',
			rejectUnauthorized: process.env.APP_ENV === 'prod',
			headers: Object.assign({
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(data)
			}, h)
		}, o, ho
	)
	return new Promise((resolve, reject) => {
		let body = ''
		const req = request(callOptions, (res) => {
			res.setEncoding('utf8')
			res.on('data', (chunk) => {
				body += chunk
			})
			res.on('end', () => {
				resolve({
					body,
					headers: res.headers
				})
			})
		})
		req.on('error', (e) => {
			reject(e)
		})
		if (data) {
			req.write(data)
		}
		req.end()
	})
}

module.exports = call