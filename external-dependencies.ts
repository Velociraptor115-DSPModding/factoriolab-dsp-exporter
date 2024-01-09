import "node:fs"
import { join } from 'node:path'

export const factoriolabPath = join(__dirname, import.meta.env?.FACTORIOLAB_PATH || "../factoriolab")
export const useFactoriolabMapping = (import.meta.env?.USE_FACTORIOLAB_MAPPING)?.toLowerCase() === "true"
