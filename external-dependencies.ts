import "node:fs"

export const factoriolabPath = import.meta.env?.FACTORIOLAB_PATH || "../factoriolab"
export const useFactoriolabMapping = (import.meta.env?.USE_FACTORIOLAB_MAPPING)?.toLowerCase() === "true"
