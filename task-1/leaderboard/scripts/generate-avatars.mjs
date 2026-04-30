import fs from 'node:fs'
import path from 'node:path'
import { PNG } from 'pngjs'

const OUTPUT_DIR = path.resolve('public/avatars')
const IMAGE_SIZE = 128
const AVATAR_COUNT = 250

const SKIN_TONES = ['#f2d3b1', '#e5be96', '#d9a97b', '#c89364', '#a77349']
const HAIR_TONES = ['#2f2a26', '#4a3728', '#6a4b35', '#111317', '#7d5f43']
const SHIRT_TONES = ['#4d86d8', '#5d75d6', '#3f9bb7', '#6d7e9a', '#7193d1']
const BACKGROUND_A = ['#dce8ff', '#d7f0eb', '#fde6d8', '#f3e7ff', '#e8eef8']
const BACKGROUND_B = ['#c6dafc', '#bfded7', '#f7d4be', '#e2d0fb', '#d2deee']

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  return {
    r: Number.parseInt(clean.slice(0, 2), 16),
    g: Number.parseInt(clean.slice(2, 4), 16),
    b: Number.parseInt(clean.slice(4, 6), 16),
  }
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t)
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function withDelta(color, delta) {
  return {
    r: clamp(color.r + delta, 0, 255),
    g: clamp(color.g + delta, 0, 255),
    b: clamp(color.b + delta, 0, 255),
  }
}

function setPixel(png, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= png.width || y < 0 || y >= png.height) {
    return
  }
  const idx = (png.width * y + x) << 2
  png.data[idx] = r
  png.data[idx + 1] = g
  png.data[idx + 2] = b
  png.data[idx + 3] = a
}

function fillCircle(png, cx, cy, radius, color) {
  const r2 = radius * radius
  for (let y = cy - radius; y <= cy + radius; y += 1) {
    for (let x = cx - radius; x <= cx + radius; x += 1) {
      const dx = x - cx
      const dy = y - cy
      if (dx * dx + dy * dy <= r2) {
        setPixel(png, x, y, color.r, color.g, color.b)
      }
    }
  }
}

function fillRect(png, x, y, width, height, color) {
  for (let yy = y; yy < y + height; yy += 1) {
    for (let xx = x; xx < x + width; xx += 1) {
      setPixel(png, xx, yy, color.r, color.g, color.b)
    }
  }
}

function fillEllipse(png, cx, cy, radiusX, radiusY, color) {
  const rx2 = radiusX * radiusX
  const ry2 = radiusY * radiusY
  for (let y = cy - radiusY; y <= cy + radiusY; y += 1) {
    for (let x = cx - radiusX; x <= cx + radiusX; x += 1) {
      const dx = x - cx
      const dy = y - cy
      if (dx * dx * ry2 + dy * dy * rx2 <= rx2 * ry2) {
        setPixel(png, x, y, color.r, color.g, color.b)
      }
    }
  }
}

function drawSoftShadow(png, cx, cy, radiusX, radiusY, alpha, color) {
  const rx2 = radiusX * radiusX
  const ry2 = radiusY * radiusY
  for (let y = cy - radiusY; y <= cy + radiusY; y += 1) {
    for (let x = cx - radiusX; x <= cx + radiusX; x += 1) {
      const dx = x - cx
      const dy = y - cy
      const v = dx * dx * ry2 + dy * dy * rx2
      if (v <= rx2 * ry2) {
        const t = 1 - v / (rx2 * ry2)
        setPixel(png, x, y, color.r, color.g, color.b, Math.round(alpha * t))
      }
    }
  }
}

function drawLine(png, x0, y0, x1, y1, color, thickness = 1) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))
  if (steps === 0) {
    fillCircle(png, x0, y0, thickness, color)
    return
  }

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps
    const x = Math.round(x0 + (x1 - x0) * t)
    const y = Math.round(y0 + (y1 - y0) * t)
    fillCircle(png, x, y, thickness, color)
  }
}

function drawMouth(png, cy) {
  const color = hexToRgb('#8f5a43')
  for (let x = 52; x <= 76; x += 1) {
    const centered = x - 64
    const y = Math.round(cy + (centered * centered) / 54)
    setPixel(png, x, y, color.r, color.g, color.b)
    setPixel(png, x, y + 1, color.r, color.g, color.b)
  }
}

function renderAvatar(index) {
  const png = new PNG({ width: IMAGE_SIZE, height: IMAGE_SIZE })
  const random = mulberry32(24042026 + index * 977)

  const bgA = hexToRgb(BACKGROUND_A[index % BACKGROUND_A.length])
  const bgB = hexToRgb(BACKGROUND_B[index % BACKGROUND_B.length])
  const skin = hexToRgb(SKIN_TONES[Math.floor(random() * SKIN_TONES.length)])
  const hair = hexToRgb(HAIR_TONES[Math.floor(random() * HAIR_TONES.length)])
  const shirt = hexToRgb(SHIRT_TONES[Math.floor(random() * SHIRT_TONES.length)])
  const shirtDark = withDelta(shirt, -20)
  const skinShade = withDelta(skin, -10)
  const skinLight = withDelta(skin, 12)

  // Soft vertical background blend.
  for (let y = 0; y < IMAGE_SIZE; y += 1) {
    const t = y / (IMAGE_SIZE - 1)
    const r = lerp(bgA.r, bgB.r, t)
    const g = lerp(bgA.g, bgB.g, t)
    const b = lerp(bgA.b, bgB.b, t)
    for (let x = 0; x < IMAGE_SIZE; x += 1) {
      setPixel(png, x, y, r, g, b)
    }
  }

  // Circular crop mask.
  const center = IMAGE_SIZE / 2
  const radius = IMAGE_SIZE / 2
  for (let y = 0; y < IMAGE_SIZE; y += 1) {
    for (let x = 0; x < IMAGE_SIZE; x += 1) {
      const dx = x + 0.5 - center
      const dy = y + 0.5 - center
      if (dx * dx + dy * dy > radius * radius) {
        setPixel(png, x, y, 0, 0, 0, 0)
      }
    }
  }

  const outline = hexToRgb('#d6dde9')
  const eyeColor = hexToRgb('#1e2434')
  const browColor = withDelta(hair, -8)
  const lipColor = hexToRgb('#8f5a43')

  // Neck and shoulders.
  fillRect(png, 57, 70, 14, 12, skinShade)
  fillEllipse(png, 64, 128, 58, 42, shirt)
  fillEllipse(png, 64, 134, 48, 30, shirtDark)

  // Head and ears.
  const faceRadiusX = 21 + Math.floor(random() * 3)
  const faceRadiusY = 25 + Math.floor(random() * 3)
  fillEllipse(png, 64, 50, faceRadiusX + 3, faceRadiusY + 3, skinShade)
  fillEllipse(png, 64, 50, faceRadiusX, faceRadiusY, skin)
  fillEllipse(png, 41, 53, 4, 7, skinShade)
  fillEllipse(png, 87, 53, 4, 7, skinShade)
  fillEllipse(png, 42, 53, 3, 6, skin)
  fillEllipse(png, 86, 53, 3, 6, skin)

  // Hair cap and side shape variation.
  const fringeDrop = Math.floor(random() * 8)
  const hairTop = 18 + Math.floor(random() * 4)
  const hairHeight = 18 + Math.floor(random() * 6)
  fillEllipse(png, 64, hairTop + 7, 28, 17, hair)
  fillRect(png, 36, hairTop + 9, 56, hairHeight, hair)
  fillEllipse(png, 39, hairTop + 15, 7, 11, hair)
  fillEllipse(png, 89, hairTop + 16, 7, 11, hair)
  fillRect(png, 44, 30 + fringeDrop, 40, 8, hair)

  // Face highlights and shading.
  fillEllipse(png, 56, 46, 9, 7, skinLight)
  fillEllipse(png, 72, 46, 9, 7, skinLight)
  drawSoftShadow(png, 64, 65, 18, 10, 70, skinShade)

  // Eyes and brows.
  const eyeY = 50 + Math.floor(random() * 3)
  const eyeOffsetX = 10 + Math.floor(random() * 2)
  fillEllipse(png, 64 - eyeOffsetX, eyeY, 4, 3, hexToRgb('#ffffff'))
  fillEllipse(png, 64 + eyeOffsetX, eyeY, 4, 3, hexToRgb('#ffffff'))
  fillCircle(png, 64 - eyeOffsetX, eyeY, 2, eyeColor)
  fillCircle(png, 64 + eyeOffsetX, eyeY, 2, eyeColor)
  fillCircle(png, 64 - eyeOffsetX + 1, eyeY - 1, 1, hexToRgb('#ffffff'))
  fillCircle(png, 64 + eyeOffsetX + 1, eyeY - 1, 1, hexToRgb('#ffffff'))

  drawLine(png, 64 - eyeOffsetX - 5, eyeY - 6, 64 - eyeOffsetX + 5, eyeY - 7, browColor, 1)
  drawLine(png, 64 + eyeOffsetX - 5, eyeY - 7, 64 + eyeOffsetX + 5, eyeY - 6, browColor, 1)

  // Nose.
  drawLine(png, 64, eyeY + 2, 63, eyeY + 10, withDelta(skinShade, -6), 1)
  drawLine(png, 63, eyeY + 10, 66, eyeY + 11, withDelta(skinShade, -4), 1)

  // Optional facial hair or glasses to increase uniqueness.
  if (random() > 0.7) {
    fillEllipse(png, 64, eyeY + 18, 10, 4, withDelta(hair, -10))
  }
  if (random() > 0.82) {
    drawLine(png, 64 - eyeOffsetX - 5, eyeY, 64 - eyeOffsetX + 5, eyeY, withDelta(eyeColor, 20), 1)
    drawLine(png, 64 + eyeOffsetX - 5, eyeY, 64 + eyeOffsetX + 5, eyeY, withDelta(eyeColor, 20), 1)
    drawLine(png, 64 - eyeOffsetX + 5, eyeY, 64 + eyeOffsetX - 5, eyeY, withDelta(eyeColor, 20), 1)
  }

  // Mouth.
  drawMouth(png, 66 + Math.floor(random() * 3))
  drawLine(png, 54, 67, 74, 67, lipColor, 1)

  // Subtle border ring for better contrast on light backgrounds.
  for (let y = 0; y < IMAGE_SIZE; y += 1) {
    for (let x = 0; x < IMAGE_SIZE; x += 1) {
      const dx = x + 0.5 - center
      const dy = y + 0.5 - center
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist >= radius - 1.5 && dist <= radius - 0.25) {
        setPixel(png, x, y, outline.r, outline.g, outline.b, 255)
      }
    }
  }

  return png
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  const existingFiles = fs
    .readdirSync(OUTPUT_DIR)
    .filter((fileName) => /^avatar-\d{3}\.png$/.test(fileName))

  for (const fileName of existingFiles) {
    fs.unlinkSync(path.join(OUTPUT_DIR, fileName))
  }

  for (let i = 1; i <= AVATAR_COUNT; i += 1) {
    const png = renderAvatar(i)
    const fileName = `avatar-${String(i).padStart(3, '0')}.png`
    const filePath = path.join(OUTPUT_DIR, fileName)
    fs.writeFileSync(filePath, PNG.sync.write(png))
  }

  console.log(`Generated ${AVATAR_COUNT} avatars in ${OUTPUT_DIR}`)
}

main()
