import {ExecJSON} from 'inspecjs'
import _ from 'lodash'

export function omitHDFChangingFields(
  input: Partial<ExecJSON.Execution> & {profiles: ExecJSON.Profile[]},
) {
  return {
    ..._.omit(input, ['version', 'platform.release', 'profiles[0].sha256']),
    profiles: input.profiles.map(profile => {
      return {
        ...profile,
        controls: profile.controls.map(control => {
          return {
            ...control,
            attestation_data: {
              ..._.omit(control.attestation_data, 'updated'),
            },
            results: control.results.map(result => {
              return {
                ..._.omit(result, 'start_time'),
                message: result.message?.replace(/Updated:.*\n/g, ''),
              }
            }),
          }
        }),
      }
    }),
  }
}

export function omitChecklistChangingFields(input: string) {
  // remove UUIDs
  return input.replaceAll(/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/gm, '')
}
