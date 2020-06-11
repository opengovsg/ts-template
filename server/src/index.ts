import express from 'express'
import path from 'path'

const app = express()
const port = Number(process.env.PORT) || 8080

app.use(express.static(path.resolve(__dirname + '/../../client/build')))
app.get('/api/hello', (_req, res) => res.send('Hello World'))

app.listen(port, () => console.log(`Listening on port ${port}`))
