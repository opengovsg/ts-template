import { GetParametersByPathCommand, SSMClient } from '@aws-sdk/client-ssm'
import fs from 'fs'
import { exit } from 'process'

/**
 * This is a helper for local file runs or jest, as specified in package.json
 * It emulates the loading of SSM which Lambda will do.
 * This is not meant to be used in a deployment and is .mjs so we can use top-level await
 */
async function loadAllParameters () {
  console.log(`Retrieving parameters for ENV=${process.env.ENV}`)

  if (process.env.ENV === 'development') {
    console.log('In develop mode! Not fetching from SSM param store.')
    console.log(
      'Please reference .env.example to populate .env.development file for development environment'
    )
    exit(0)
  }
  const client = new SSMClient({ region: 'ap-southeast-1' })
  const prefix = `/application/${process.env.ENV}/`
  const params = {}

  let nextToken

  do {
    // Handle pagination (max 10 params per call)
    const res = await client.send(
      new GetParametersByPathCommand({
        Path: prefix,
        Recursive: true,
        WithDecryption: true,
        ...(nextToken ? { NextToken: nextToken } : {})
      })
    )

    for (const parameter of res.Parameters ?? []) {
      const paramName = parameter.Name.slice(prefix.length)
      const isStringList = parameter.Type === 'StringList'
      params[paramName] = isStringList
        ? `[${parameter.Value.split(',').map((x) => `"${x}"`)}]`
        : parameter.Value

      console.log(`${paramName}: ${parameter.Type}`)
    }

    nextToken = res.NextToken
  } while (nextToken)

  // format strings, JSON strings, and StringList appropriately
  const envString = Object.entries(params)
    .sort()
    .map(([k, v]) => {
      const strippedValue = v.replace(/\s/g, '')
      const looksLikeJson = strippedValue.includes('{')
      return looksLikeJson ? `${k}=${strippedValue}` : `${k}='${strippedValue}'`
    })
    .join('\n')
    .concat(params.NODE_ENV ? '' : `\nNODE_ENV=${process.env.ENV}`)

  if (Object.entries(params).length > 0) {
    console.log(`Writing to file .env.${process.env.ENV}`)
    await fs.promises.writeFile(`.env.${process.env.ENV}`, envString)
  } else {
    console.log(
      `No env vars found, not writing to file .env.${process.env.ENV}`
    )
  }
}

await loadAllParameters()
