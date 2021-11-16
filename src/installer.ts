import * as core from '@actions/core'
import * as io from '@actions/io'
import * as tc from '@actions/tool-cache'
import * as fs from 'fs'
import * as path from 'path'

let tempDirectory = process.env['RUNNER_TEMP'] || ''

const IS_WINDOWS = process.platform === 'win32'
const PIERROT = 'Pierrot'

if (!tempDirectory) {
  let baseLocation
  if (IS_WINDOWS) {
    baseLocation = process.env['USERPROFILE'] || 'C:\\'
  } else {
    if (process.platform === 'darwin') {
      baseLocation = '/Users'
    } else {
      baseLocation = '/home'
    }
  }
  tempDirectory = path.join(baseLocation, 'actions', 'temp')
}

let platform = ''

if (IS_WINDOWS) {
  platform = 'windows'
} else {
  if (process.platform === 'darwin') {
    platform = 'darwin'
  } else {
    platform = 'linux'
  }
}

export async function getPierrot(
  version: string,
  token: string,
  organization: string
): Promise<void> {
  let toolPath = tc.find(PIERROT, version)

  if (toolPath) {
    core.debug(`Pierrot found in cache ${toolPath}`)
  } else {
    const downloadPath = `https://github.com/agorapulse/pierrot/releases/download/${version}/pierrot-${platform}-amd64-v${version}.zip`

    core.info(`Downloading Pierrot from ${downloadPath}`)

    const pierrotFile = await tc.downloadTool(downloadPath)

    const tempDir: string = path.join(
      tempDirectory,
      `temp_${Math.floor(Math.random() * 2000000000)}`
    )

    const pierrotDir = await unzipPierrotDownload(pierrotFile, version, tempDir)

    core.debug(`pierrot extracted to ${pierrotDir}`)

    toolPath = await tc.cacheDir(pierrotDir, PIERROT, version)
  }

  core.addPath(path.join(toolPath, 'bin'))

  if (!organization) {
    const repository = process.env['GITHUB_REPOSITORY'] || '/'
    organization = repository.split('/')[0]
  }

  if (organization) {
    core.exportVariable('PIERROT_ORGANIZATION', organization)
  }

  if (token) {
    core.exportVariable('PIERROT_TOKEN', token)
  }
}

async function extractFiles(
  file: string,
  destinationFolder: string
): Promise<void> {
  const stats = fs.statSync(file)

  if (!stats) {
    throw new Error(`Failed to extract ${file} - it doesn't exist`)
  } else if (stats.isDirectory()) {
    throw new Error(`Failed to extract ${file} - it is a directory`)
  }

  await tc.extractZip(file, destinationFolder)
}

async function unzipPierrotDownload(
  repoRoot: string,
  version: string,
  destinationFolder: string
): Promise<string> {
  await io.mkdirP(destinationFolder)

  const pierrotFile = path.normalize(repoRoot)
  const stats = fs.statSync(pierrotFile)

  if (stats.isFile()) {
    await extractFiles(pierrotFile, destinationFolder)

    fs.readdir(destinationFolder, (err, files) => {
      for (const file of files) {
        core.info(file)
      }
    })

    return path.join(destinationFolder, `pierrot-${platform}-amd64-v${version}`)
  } else {
    throw new Error(`Unzip argument ${pierrotFile} is not a file`)
  }
}
