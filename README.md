# Introduction

This repository has two purposes. First, it contains the NodeJS program to aggregate all the microservice charts into a central location. Second, it is used to publish the aggregated charts to artifact hub.

For details on running the Ortelius Install Helm charts visit the Ortelius Charts repo.

## Ortelius Helm Chart Aggregator

This code takes in an array of GitHub Repos that runs the `chart-releaser` GitHub action from Helm.

It retrieves the `index.yaml` file from the `gh-pages` branch of each repo and combines their entries into a single, consolidated `index.yaml`, enabling a poly repo chart setup to be uploaded to ArtifactHUB as one package.

### Usage

Simply update the `chartsRepo` variable in `main.js` and insert the appropriate repo name for its `index.yaml` to be retrieved.

```js
const chartRepos = [
    "ortelius/scec-frontend",
]
```
