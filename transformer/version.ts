import versionRaw from '../dsp-data/version.json'

const v = versionRaw.gameVersion

export const version = {
  DSP: `${v.Major}.${v.Minor}.${v.Release}.${v.Build}`
}
