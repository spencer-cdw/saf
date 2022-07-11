import {Command, Flags} from '@oclif/core'
import fs from 'fs'
import {ScoutsuiteMapper as Mapper} from '@mitre/hdf-converters'
import {checkInput, checkSuffix} from '../../utils/global'

export default class Scoutsuite2HDF extends Command {
  static usage = 'convert scoutsuite2hdf -i, --input=JS -o, --output=OUTPUT -w, --with-raw'

  static description = 'Translate a ScoutSuite results from a Javascript object into a Heimdall Data Format JSON file\nNote: Currently this mapper only supports AWS.'

  static examples = ['saf convert scoutsuite2hdf -i scoutsuite-results.js -o output-hdf-name.json -w']

  static flags = {
    help: Flags.help({char: 'h'}),
    input: Flags.string({char: 'i', required: true, description: 'Input ScoutSuite file'}),
    output: Flags.string({char: 'o', required: true, description: 'Output HDF file'}),
    'with-raw': Flags.boolean({char: 'w', required: false}),
  }

  async run() {
    const {flags} = await this.parse(Scoutsuite2HDF)

    // Check for correct input type
    const data = fs.readFileSync(flags.input, 'utf8')
    checkInput({data: data, filename: flags.input}, 'scoutsuite', 'ScoutSuite results from a Javascript object')

    const converter = new Mapper(data, flags['with-raw'])
    fs.writeFileSync(checkSuffix(flags.output), JSON.stringify(converter.toHdf()))
  }
}
