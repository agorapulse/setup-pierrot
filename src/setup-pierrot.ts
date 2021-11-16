import * as core from '@actions/core'
import * as installer from './installer'

async function run(): Promise<void> {
  try {
    const version = core.getInput('version')
    const token = core.getInput('token')
    const organization = core.getInput('organization')
    await installer.getPierrot(version, token, organization)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
