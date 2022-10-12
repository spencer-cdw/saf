import {Command, Flags} from '@oclif/core'
import {ASFFResults as Mapper} from '@mitre/hdf-converters'
import {checkInput, checkSuffix} from '../../utils/global'
import _ from 'lodash'
import path from 'path'
import {createFolderIfNotExists, readFileURI, writeFileURI} from '../../utils/io'

export default class Prowler2HDF extends Command {
  static usage = 'convert prowler2hdf -i <prowler-finding-json> -o <hdf-output-folder> [-h]'

  static description = 'Translate a Prowler-derived AWS Security Finding Format results from JSONL into a Heimdall Data Format JSON file'

  static examples = ['saf convert prowler2hdf -i prowler-asff.json -o output-folder']

  static flags = {
    help: Flags.help({char: 'h'}),
    input: Flags.string({char: 'i', required: true, description: 'Input Prowler ASFF JSON File'}),
    output: Flags.string({char: 'o', required: true, description: 'Output HDF JSON Folder'}),
  }

  async run() {
    const {flags} = await this.parse(Prowler2HDF)
    const data = await readFileURI(flags.input, 'utf8')
    checkInput({data: data, filename: flags.input}, 'asff', 'Prowler-derived AWS Security Finding Format results')
    const converter = new Mapper(data)
    const results = converter.toHdf()

    // Create output folder if not exists
    await createFolderIfNotExists(flags.output);

    _.forOwn(results, async (result, filename) => {
      await writeFileURI(
        path.join(flags.output, checkSuffix(filename)),
        JSON.stringify(result),
      )
    })
  }
}

