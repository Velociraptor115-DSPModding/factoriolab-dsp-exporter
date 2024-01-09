import items from "../../dsp-data/items.json"
import recipes from "../../dsp-data/recipes.json"
import techs from "../../dsp-data/techs.json"
import veins from "../../dsp-data/veins.json"
import { mapping } from "../../mapping"
import { join } from "node:path"
import sharp from "sharp"

const manualAssets = [
  "buildings",
  "components",
  "critical-photon-graviton",
  "module",
  "proliferator-1-products",
  "proliferator-1-speed",
  "proliferator-2-products",
  "proliferator-2-speed",
  "proliferator-3-products",
  "proliferator-3-speed",
]

const dspRipPath = join(__dirname, "../../dsp-data/rips/")

const iconsRaw = (
  [
    ...items.filter(x => mapping.items[x.ID]).map(x => ({
      id: mapping.items[x.ID],
      src: join(dspRipPath, "items", x.iconSprite),
    })),
    ...recipes.filter(x => mapping.recipes[x.ID]).map(x => ({
      id: mapping.recipes[x.ID],
      src: join(dspRipPath, "recipes", x.iconSprite),
    })),
    ...veins.filter(x => mapping.veins[x.ID]).map(x => ({
      id: mapping.veins[x.ID],
      src: join(dspRipPath, "veins", x.iconSprite),
    })),
    ...techs.filter(x => mapping.techs[x.ID]).map(x => ({
      id: mapping.techs[x.ID],
      src: join(dspRipPath, "techs", x.iconSprite),
    })),
    ...manualAssets.map(x => ({
      id: x,
      src: join(__dirname, "manual-assets", `${x}.png`),
    })),
  ]
  .filter((x, idx, arr) => arr.findIndex(y => y.id === x.id) === idx)
)

const iconCount = iconsRaw.length
const squareDims = Math.ceil(Math.sqrt(iconCount))
const iconSize = 64

function getTop(index: number) {
  return Math.floor(index / squareDims)
}

function getLeft(index: number) {
  return Math.floor(index % squareDims)
}

const iconsIntermediate = (
  iconsRaw
    .map((x, idx) => ({
      ...x,
      top: getTop(idx) * iconSize,
      left: getLeft(idx) * iconSize,
      genBuffer: async () => {
        const filePipeline = sharp(x.src)
        const metadata = await filePipeline.clone().metadata()
        const buffer = await (
          metadata.width !== 64 || metadata.height !== 64
            ? filePipeline.clone().resize(64, 64).toBuffer()
            : filePipeline.clone().toBuffer()
        )
        return buffer
      }
    }))
)

export const icons = (
  iconsIntermediate
    .map((x) => ({
      id: x.id,
      position: `${-x.left}px ${-x.top}px`
    }))
)

export async function generateIconsWebp(path) {
  const iconsResized = await Promise.all(iconsIntermediate.map(async x => ({
    ...x,
    buffer: await x.genBuffer()
  })))

  await (
    sharp({
      create: {
        width: squareDims * iconSize,
        height: squareDims * iconSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite(iconsResized.map(icon => ({
      input: icon.buffer,
      top: icon.top,
      left: icon.left,
    })))
    .webp()
    .toFile(path)
  )
}
