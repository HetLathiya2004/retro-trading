const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT || 3000
const max_connections = process.env.MAX_CONNECTIONS || 50

const data = require('./data.json')
const connection = []
const app = express()

const start_time = Number(process.env.START_TIME)

app.use(cors())

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.get('/stock-stream', (req, res) => {
	if (connection.length > max_connections) {
		res.status(503).end()
		return
	}

	connection.push(res)
	req.on('close', () => {
		connection.splice(connection.indexOf(res), 1)
		res.end()
	})
	res.set({
		"Content-Type": "text/event-stream"
	})
})

const sendStockData = () => {
	setTimeout(() => {
		const currentTime = Date.now() / 1000
		const elapsedTime = currentTime - start_time
		const index = (Math.floor(elapsedTime / 30)) % data.length

		console.log('Current Time:', currentTime)
		console.log('Elapsed Time:', elapsedTime)
		console.log('Index:', index)
		console.log('\n')

		const stockData = data[index]
		connection.forEach(res => {
			const out = {
				index: index,
				stockData: stockData
			}
			const stockDataString = JSON.stringify(out)
			res.write(`data: ${stockDataString}\n\n`)
		})

		sendStockData()
	}, 10000) // 30 seconds
}

app.listen(3000, () => {
	console.log('Server is listening on port 3000')
	sendStockData()
})
