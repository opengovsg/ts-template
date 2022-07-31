import { GetParametersByPathCommand, SSMClient } from '@aws-sdk/client-ssm'
import fs from 'fs'
import { exit } from 'process'
import dotenv from 'dotenv'

// This is a helper for local file runs or jest, as specified in package.json
// It emulates the loading of SSM which Lambda will do.
// This file is not meant to be used in a deployment and is .mjs so we can use top-level await
async function saveAllParameters() {
  console.log(`Retrieving parameters for ENV=${process.env.ENV}`)

  if (process.env.ENV === 'development') {
    console.log('In develop mode! Not putting into SSM param store.')
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
        ...(nextToken ? { NextToken: nextToken } : {}),
      }),
    )

    for (const parameter of res.Parameters ?? []) {
      const paramName = parameter.Name.slice(prefix.length)
      const isStringList = parameter.Type === 'StringList'
      params[paramName] = isStringList
        ? `[${parameter.Value.split(',').map((x) => `"${x}"`)}]`
        : parameter.Value
    }

    nextToken = res.NextToken
  } while (nextToken)

  const currentEnv = await fs.promises.readFile(`.env.${process.env.ENV}`)
  const config = dotenv.parse(currentEnv)

  console.log('The following parameters differ from SSM. Run the generated AWS CLI commands to update them (editing the --type field as necessary):\n')

  for (const [k, v] of Object.entries(config)) {
    if (Object.keys(params).includes(k) && params[k] !== v) {
      // different values, set override flag
      console.log(
        `aws ssm put-parameter --overwrite --name /application/${process.env.ENV}/${k} --value ${v} --type String`,
      )
    } else if (!Object.keys(params).includes(k)) {
      console.log(
        `aws ssm put-parameter --name /application/${process.env.ENV}/${k} --value ${v} --type String`,
      )
    }
  }
}

await saveAllParameters()
