import {createReadStream} from 'fs'
import AbstractPlugin from "./abstractPlugin"
const ChromeWebStore = require('chrome-webstore-upload')


export default class ChromeWebStoreUploadPlugin extends AbstractPlugin {
  private chromeWebStore: any
  readonly zipFilePath: string

  constructor({extensionId, clientId, clientSecret, refreshToken, zipFilePath}: Options) {
    super();
    this.chromeWebStore = ChromeWebStore({extensionId, clientId, clientSecret, refreshToken})
    this.zipFilePath = zipFilePath
  }

  upload(stats) {
    const zipFile = createReadStream(this.zipFilePath)
    this.chromeWebStore.uploadExisting(zipFile).then(res => {
      if (res.uploadState === 'SUCCESS') {
        console.log('Success upload webstore')
        console.log(res)
      } else {
        console.error(res)
        throw Error('Fail upload webstore')
      }
    }).catch(e => {
      console.error(e)
      process.exit(1)
    })
  }

  apply(compiler) {
    compiler.plugin('done', (stats) => this.upload(stats))
  }
}