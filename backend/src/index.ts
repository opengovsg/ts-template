import bootstrap from './bootstrap'
import config from './config'

const port = config.get('port')
bootstrap().then(({ app }) =>
  app.listen(port, () => console.log(`Listening on port ${port}`))
)
