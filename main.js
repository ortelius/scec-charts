const axios = require('axios')
const yaml = require('js-yaml')
const fs = require('fs')
require('process')

const chartRepos = [
  'ortelius/scec-domain'
]

// Helper functions
async function getChartEntries () {
  let sha = ''

  await axios.get('https://api.github.com/repos/ortelius/scec-charts/commits/main').then(response => {
    sha = response.data.sha
  })

  const url = 'https://raw.githubusercontent.com/ortelius/scec-charts/' + sha + '/charts/ortelius-scec/Chart.yaml'

  await axios.get(url).then(response => {
    let parts = []
    let ver = ''
    const parsedYaml = yaml.load(response.data)
    chartVersion = parsedYaml.version
    parts = chartVersion.split('.')
    ver = parseInt(parts[2]) + 1
    parts[2] = ver.toString()
    chartVersion = parts.join('.')
  })

  const latestChart = []

  for (let i = 0; i < chartRepos.length; i++) {
    await axios.get('https://api.github.com/repos/' + chartRepos[i] + '/commits/gh-pages').then(response => {
      sha = response.data.sha
    })

    const repoUrl = 'https://raw.githubusercontent.com/' + chartRepos[i] + '/' + sha + '/index.yaml'

    await axios.get(repoUrl).then(response => {
      const parsedYaml = yaml.load(response.data)
      const entries = parsedYaml.entries

      Object.keys(entries).forEach(key => {
        let latest = null

        Object.entries(entries[key]).forEach(entry => {
          if (latest == null) { latest = entry } else if (latest.created < entry.created) { latest = entry }
        })
        latest = latest[1]
        const dep = {}
        dep.name = latest.name
        dep.version = latest.version

        dep.repository = 'https://ortelius.github.io/' + key + '/'
        latestChart.push(dep)

        //    chartEntries[key] = entries[key]
        //    console.log(entries[key]);
      })
    })
  }
  chartEntries = latestChart
  return latestChart
}

function createYamlOutput () {
  const output = yaml.dump({
    apiVersion: 'v2',
    name: 'ortelius-scec',
    description: 'Ortelius v11 Supply Chain Evidence Catalog',
    home: 'https://www.ortelius.io',
    icon: 'https://ortelius.github.io/ortelius-charts/logo.png',
    keywords: ['Service Catalog', 'Microservices', 'SBOM', 'Supply Chain', 'Evidence Catalog'],
    type: 'application',
    version: chartVersion,
    appVersion: '11.0.0',
    dependencies: chartEntries
  }, { noArrayIndent: true })

  return output
}
// -----------------

let chartEntries = []
let chartVersion = ''

getChartEntries().then(() => {
  const yamlOutput = createYamlOutput()
  console.log(yamlOutput)
  fs.writeFileSync('./charts/ortelius-scec/Chart.yaml', yamlOutput, 'utf8', (err) => {
    console.log(err)
  })
})
