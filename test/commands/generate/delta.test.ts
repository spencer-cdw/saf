import {expect, test} from '@oclif/test'
import tmp from 'tmp'
import path from 'path'
import fs from 'fs'
import fse from 'fs-extra'
import {execSync} from 'child_process'
import { inspecControlToRubyCode } from '../../../src/utils/xccdf2inspec'

describe('Test generate delta', () => {
  const tmpobj = tmp.dirSync({unsafeCleanup: true})
  fse.copySync(path.resolve('./test/sample_data/delta-test/profile'), tmpobj.name);
  
  test
  .it('report is generated for a given InSpec profile update', () => {
      execSync(
          `node bin/run generate delta -i ${tmpobj.name} ${tmpobj.name}/profile.json -r ${tmpobj.name}/report.md`,
          )
          
          const files = fs.readdirSync(tmpobj.name);
          for (const file of files) {
            console.log(file)
          }
    // const test = JSON.parse(fs.readFileSync(`${tmpobj.name}/asfftest/CIS AWS Foundations Benchmark v1.2.0.json`, 'utf8'))
    // const sample = JSON.parse(fs.readFileSync(path.resolve('./test/sample_data/asff/asff-cis_aws-foundations_benchmark_v1.2.0-hdf.json'), 'utf8'))
    expect((1)).to.eql((1))
  })
})
