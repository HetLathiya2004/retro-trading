const fs = require('fs')
const csv = require('csvtojson')

// dd-mm-yyyy
const fetch_close = async (ticker, from, to) => {
	const requestOpts = {
		method: 'GET',
		headers: {
			'Cookie': 'nsit=txQPdMLS4B-RYSIGLS8yN5XN; AKA_A2=A; _abck=920EF0F1B5B2BB7DC340AC4B7D89A258~0~YAAQxm4/F4xsLeaOAQAAEbxS+QueGJMzZefjy2eKXwEGXJ4ZHOmsrLjuNKbYV6f18/Ku4rtCcAHqPOlPzWMxVBjz09jC3R08F1VmvnuxDLJKXQR6b9E5Wr0AuNQge+d53qgxhsBD4Z2RrTOpKD179gkmoGVqzV20UDO13Bnen8WJruTk7LMP10CBTUhh4MgiTGKKXvTIEs6QPzPasOwu3ImHATcWlxcCgcf52dAlL008HemX+kr/0CRl11F5/zzfIN+SDO29may6CQsS+g0nZqhJNcAy7aEBuc7YokLJfyoxOPmftZKsLYSWZ4QzgZD1j8tDJJJb8g/j+Pa2an/T9rgiSyIdFRAr9n4nloYp7EIlmQGJioXth6T5u0D7YJczivhMCtL3e5PhGRcv/GwD6PawUhwQAlxX/3E=~-1~-1~-1; defaultLang=en; ak_bmsc=42D070C6105D88B7B07D2B389A0D2633~000000000000000000000000000000~YAAQxm4/F7psLeaOAQAARc1S+RfK1PKhjbT2nIOquM3upIBsx1JmTfiU6NXrpgeIK/8e/7eve4TOMle+9t+pDWLUlv+X2SF3NkDpxEW3GRtHBHw72LcOLEMjd2exLbimgs0l+YxSoJ4c02AgHp35eEF2/WaemIkRF/dKibAI2d/27B4vS8Q948XYFCoB92h2Qf3y/CJ+I/ZZYxbpu284SCV7lf5gEYoLFUM6r/h4YCS2MOacb6JedhWWqQsPhQ6bTtie4v/BAW9qpnTqPfRbChhfBJYjfgn0MDfGm1Ca7VcG7w/FF6V+WSMJIzMonP5q4kZ1zg7K3WTdu5OqPJVeXijPO8IX4jJnu9vc3mwvlIybl2RElYZPgTQqkxZoy1nKyc+0nDyaG3miWW0WLtMn3XvOKzWTmZ6G/ZBRorVubttoF2jo79eKHY0Ma4q8ePfzHMNctYs3S8gZjSt8sw==; nseappid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkubnNlIiwiYXVkIjoiYXBpLm5zZSIsImlhdCI6MTcxMzU3OTk1MSwiZXhwIjoxNzEzNTg3MTUxfQ.iozwTunnfNZnWU-exaFK1WvCqXwec7JAW_LO4Vx-CX8; bm_sz=AC458532253DD0692B51E4CE86D07490~YAAQxm4/Fy5tLeaOAQAA+OlS+RfLc1yVWbDyAMBKvC352vomVQ7kXxvqSc26DSTsCsRpLGaRsNwnigk9SSjGgJ+rcv0rEBNT5zVwYjIjgV9a2OAq/bZk3QTrBqACOVOJfYvdm/jZfuJbsYbUhkM8uN/xfKaFFmzZJixcyQWdE+Gsvd5eJzzg4ii5KqV7QqGBh9z5BV7CBJQAuyCbI/YdzTca/0iHhNLJ/A0YUm57tx1V2NXlax1l54lNOdhTvEyr28sZ8BDiHWnay+K0lKHXzO/WFUfHQr149M9KtizO51jAk2RvCl5vqQdPG/zET3Qll8SZzrRtiSTaOFdrZQ9P18dDVjREjnvpRPXC1kfBDDFdjm7nGJmV1ZNXjTBDrmZqE0Zj16EsGWJxhYuvs9GHeo5/t4Y=~3359286~4539189; nseQuoteSymbols=[{"symbol":"RELIANCE","identifier":null,"type":"equity"}]; bm_sv=2FD3DC3990728BCBF38E32A8904EB450~YAAQxm4/F7FtLeaOAQAAAxJT+Rc71anJb29Sb91G72eQ6ZqjstwJV8TuwQsZ0cGpaHDeYCfoK916uf3iX6ifkfJ918yIdQ578e8/OxGgcYyh40y0vV6gSB/isTsCY7ycdQsJYtw9zW5WQ0PxoQ6/WvbS+GNFaClwrxIkVpe0VbyqizRRQAw/CQrc40FJhWT1ISCgEeGAtNJDWI6qLdfsjxgUZCcKlvyFEJmd0zQezB3t461sVzRp14ppf5tcGQxR+gLY~1'
		}
	}
	const res = await fetch(`https://www.nseindia.com/api/historical/cm/equity?symbol=${ticker}&series=["EQ"]&from=${from}&to=${to}&csv=true`, requestOpts)
	const text = await res.text()
	if (!res.ok) {
		throw new Error(`Failed to fetch data for ${ticker}. Status: ${res.status}. Text: ${text}`)
	}
	const data = await csv().fromString(text)
	// clear duplicates
	const uniqueData = []

	for (const d of data) {
		if (!uniqueData.find(ud => ud['Date '] === d['Date '])) {
			uniqueData.push(d)
		}
	}
	return uniqueData.map(d => {
		return parseFloat(d['close '].replace(/,/g, ''))
	}
	).reverse()
}

const main = async () => {
	const tickers = [
		{
			name: 'RELIANCE',
			from: '01-03-2020',
			to: '01-03-2021'
		},
		{
			name: 'TCS',
			from: '01-01-2015',
			to: '01-01-2016'
		},
		{
			name: 'RVNL',
			from: '01-03-2023',
			to: '01-03-2024'
		},
		{
			name: 'IRCON',
			from: '01-01-2023',
			to: '01-01-2024'
		},
		{
			name: 'VEDL',
			from: '01-04-2023',
			to: '01-04-2024'
		},
		{
			name: 'PAYTM',
			from: '01-01-2022',
			to: '01-01-2023'
		},
		{
			name: 'HAL',
			from: '01-01-2020',
			to: '01-01-2021'
		},
		{
			name: 'BANKBARODA',
			from: '01-01-2021',
			to: '01-01-2022'
		},
		{
			name: 'BAJAJ-AUTO',
			from: '01-01-2023',
			to: '01-01-2024'
		},
		{
			name: 'TITAN',
			from: '01-01-2010',
			to: '01-01-2011'
		}

	]

	const data = {}
	for (const ticker of tickers) {
		const close = await fetch_close(ticker.name, ticker.from, ticker.to)
		data[ticker.name] = close
	}

	// now find minimum length
	let minLen = Infinity
	let stock = ''
	for (const ticker in data) {
		minLen = Math.min(minLen, data[ticker].length)
		if (data[ticker].length === minLen) {
			stock = ticker
		}
	}
	console.log('Stock with min length:', stock)
	console.log('Min length:', minLen)

	const aggregatedData = []
	for (let i = 1; i < minLen; i++) {
		const row = []
		for (const ticker in data) {
			row.push({
				ticker,
				close: data[ticker][i],
				change: (data[ticker][i] - data[ticker][i - 1]) * 100 / data[ticker][i - 1]
			})
		}
		aggregatedData.push(row)
	}

	fs.writeFileSync('data.json', JSON.stringify(aggregatedData))
}

main()