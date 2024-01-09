import { generateIconsWebp } from "./transformer/icons"
import { join } from "node:path"
import { mkdirSync } from "node:fs"

const outputPath = join(__dirname, "output")
const iconSheetPath = join(outputPath, "icons.webp")

mkdirSync(outputPath, { recursive: true })

await generateIconsWebp(iconSheetPath)
