import express from 'express'
import path from 'path'

import config from './config'

const app = express()
const port = config.get('port')

app.use(express.static(path.resolve(__dirname + '/../../client/build')))
app.get('/api/hello', (_req, res) => res.send('Hello World'))

app.listen(port, () => console.log(`Listening on port ${port}`))
