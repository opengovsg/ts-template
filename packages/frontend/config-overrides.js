/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { aliasWebpack, aliasJest, configPaths } = require('react-app-alias-ex')

const aliasMap = configPaths('./tsconfig.paths.json')

const options = {
  alias: aliasMap,
}
module.exports = aliasWebpack(options)
module.exports.jest = aliasJest(options)
