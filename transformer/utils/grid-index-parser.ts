export type ParsedGridIndex = {
    page: number
    row: number
    column: number
}

export function parseGridIndex(gridIndex: number) {
    const page = Math.floor(gridIndex / 1000) 
    const row = Math.floor((gridIndex % 1000) / 100)
    const column = gridIndex % 100
    return { page, row, column }
}
