import treatBearUrl from '@/assets/treat-bear.png'
import { getWeekOutline, PROGRAMME } from '@/content/course'
import { formatDayYear } from './dates'

/**
 * Treat coupons: one image per completed week, drawn on a canvas so it can be
 * shared to WhatsApp or saved as a PNG.
 */

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O or 1/I, easy to read aloud

/** Same week always gives the same code, so a coupon can be re-checked if it is sent twice. */
export function couponCode(week: number): string {
  let hash = 2166136261
  for (const ch of `${PROGRAMME.learnerName}|week-${week}|treat`) {
    hash ^= ch.charCodeAt(0)
    hash = Math.imul(hash, 16777619) >>> 0
  }
  let suffix = ''
  for (let i = 0; i < 4; i++) {
    suffix += CODE_CHARS[hash % CODE_CHARS.length]
    hash = Math.floor(hash / CODE_CHARS.length)
  }
  return `JJ-W${String(week).padStart(2, '0')}-${suffix}`
}

export function couponFilename(week: number): string {
  return `journo-treat-coupon-week-${week}.png`
}

const C = {
  paper: '#F5F0E6',
  surface: '#FBF8F2',
  ink: '#1C1A16',
  ink2: '#57524A',
  ink3: '#6E675B',
  rule: '#CFC6B4',
  accent: '#B42318',
  accentLight: '#F0705F',
  cone: '#D9A35B',
  coneDark: '#8A5A00',
  vanilla: '#F3D9A4',
  strawberry: '#E58F8F',
  blush: '#F4E1DC',
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * The bear eating ice cream, on a rounded pink panel. The drawing is cut off at the
 * bottom, so it sits flush on the panel's bottom edge where the cut is hidden.
 */
function drawTreatBear(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  box: { x: number; y: number; w: number; h: number },
) {
  const radius = 28
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(box.x, box.y, box.w, box.h, radius)
  ctx.fillStyle = C.blush
  ctx.fill()
  ctx.clip()

  // The trimmed image keeps 8px of transparent padding; push it down so the cut meets the edge.
  const width = box.w - 20
  const scale = width / img.width
  const height = img.height * scale
  const padding = 8 * scale
  ctx.drawImage(img, box.x + (box.w - width) / 2, box.y + box.h - height + padding, width, height)
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  ctx.roundRect(box.x, box.y, box.w, box.h, radius)
  ctx.strokeStyle = C.ink
  ctx.lineWidth = 4
  ctx.stroke()
  ctx.restore()
}

const SERIF = '"Newsreader Variable", Georgia, serif'
const SANS = '"Libre Franklin Variable", "Segoe UI", Roboto, sans-serif'

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

function drawIceCream(ctx: CanvasRenderingContext2D, cx: number, top: number) {
  ctx.save()
  // Cone
  ctx.beginPath()
  ctx.moveTo(cx - 62, top + 150)
  ctx.lineTo(cx + 62, top + 150)
  ctx.lineTo(cx, top + 330)
  ctx.closePath()
  ctx.fillStyle = C.cone
  ctx.fill()
  ctx.save()
  ctx.clip()
  ctx.strokeStyle = C.coneDark
  ctx.globalAlpha = 0.45
  ctx.lineWidth = 3
  for (let i = -6; i <= 6; i++) {
    ctx.beginPath()
    ctx.moveTo(cx + i * 24 - 100, top + 150)
    ctx.lineTo(cx + i * 24 + 100, top + 350)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx + i * 24 + 100, top + 150)
    ctx.lineTo(cx + i * 24 - 100, top + 350)
    ctx.stroke()
  }
  ctx.restore()

  // Scoops
  ctx.fillStyle = C.vanilla
  ctx.beginPath()
  ctx.arc(cx, top + 140, 72, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = C.strawberry
  ctx.beginPath()
  ctx.arc(cx, top + 62, 62, 0, Math.PI * 2)
  ctx.fill()

  // Cherry
  ctx.fillStyle = C.accent
  ctx.beginPath()
  ctx.arc(cx + 12, top - 8, 17, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = C.ink
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(cx + 12, top - 24)
  ctx.quadraticCurveTo(cx + 18, top - 52, cx + 40, top - 58)
  ctx.stroke()

  // Sprinkles
  const sprinkles: [number, number, number, string][] = [
    [-32, 40, 0.6, C.ink],
    [18, 30, -0.4, C.surface],
    [-4, 70, 1.1, C.accent],
    [34, 76, 0.2, C.ink],
    [-38, 90, -0.9, C.surface],
    [8, 100, 0.5, C.coneDark],
  ]
  for (const [dx, dy, angle, color] of sprinkles) {
    ctx.save()
    ctx.translate(cx + dx, top + dy)
    ctx.rotate(angle)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(-9, -3, 18, 6, 3)
    ctx.fill()
    ctx.restore()
  }
  ctx.restore()
}

export async function renderCoupon(week: number, earnedAt: string): Promise<Blob> {
  const W = 1080
  const H = 1350
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Make sure the app fonts are ready, so the image does not fall back to system fonts.
  try {
    await Promise.all([
      document.fonts.load(`700 96px ${SERIF}`),
      document.fonts.load(`italic 400 52px ${SERIF}`),
      document.fonts.load(`600 30px ${SANS}`),
    ])
  } catch {
    // Fallback fonts are fine.
  }

  const outline = getWeekOutline(week)
  const code = couponCode(week)
  const from = PROGRAMME.rewardsFrom
  const x = 110

  // Background and ticket
  ctx.fillStyle = C.paper
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = C.surface
  ctx.strokeStyle = C.ink
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.roundRect(60, 60, 960, 1230, 40)
  ctx.fill()
  ctx.stroke()

  // Header band
  ctx.fillStyle = C.ink
  ctx.beginPath()
  ctx.roundRect(60, 60, 960, 210, [40, 40, 0, 0])
  ctx.fill()
  ctx.textBaseline = 'alphabetic'
  ctx.letterSpacing = '6px'
  ctx.font = `600 28px ${SANS}`
  ctx.fillStyle = C.paper
  ctx.textAlign = 'left'
  ctx.fillText('MY JOURNO JOURNEY', x, 140)
  ctx.fillStyle = C.accentLight
  ctx.textAlign = 'right'
  ctx.fillText('TREAT COUPON', 970, 140)
  ctx.letterSpacing = '0px'
  ctx.textAlign = 'left'
  ctx.fillStyle = C.paper
  ctx.font = `700 68px ${SERIF}`
  ctx.fillText(`Week ${week} complete`, x, 228)

  // Illustration: the treat bear, or a drawn ice cream if the image cannot load.
  try {
    drawTreatBear(ctx, await loadImage(treatBearUrl), { x: 700, y: 318, w: 270, h: 316 })
  } catch {
    drawIceCream(ctx, 840, 380)
  }

  // Main offer
  ctx.fillStyle = C.ink
  ctx.font = `700 84px ${SERIF}`
  ctx.fillText('One ice cream', x, 420)
  ctx.fillText('or snack', x, 510)
  ctx.fillStyle = C.ink2
  ctx.font = `italic 400 50px ${SERIF}`
  ctx.fillText('of your choice', x, 580)

  // Awarded to
  ctx.fillStyle = C.ink3
  ctx.font = `500 30px ${SANS}`
  ctx.fillText('Awarded to', x, 740)
  ctx.fillStyle = C.ink
  ctx.font = `700 76px ${SERIF}`
  ctx.fillText(PROGRAMME.learnerName, x, 820)
  ctx.fillStyle = C.ink3
  ctx.font = `500 30px ${SANS}`
  ctx.fillText('for finishing', x, 880)
  ctx.fillStyle = C.ink
  ctx.font = `600 50px ${SERIF}`
  const titleLines = wrapLines(ctx, `Week ${week}: ${outline?.title ?? ''}`, 860).slice(0, 2)
  titleLines.forEach((line, i) => ctx.fillText(line, x, 945 + i * 60))

  // Perforation
  const perfY = 1070
  ctx.fillStyle = C.paper
  for (const px of [60, 1020]) {
    ctx.beginPath()
    ctx.arc(px, perfY, 34, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.strokeStyle = C.ink
  ctx.lineWidth = 4
  for (const [px, start, end] of [
    [60, -Math.PI / 2, Math.PI / 2],
    [1020, Math.PI / 2, (3 * Math.PI) / 2],
  ] as const) {
    ctx.beginPath()
    ctx.arc(px, perfY, 34, start, end)
    ctx.stroke()
  }
  ctx.strokeStyle = C.rule
  ctx.lineWidth = 3
  ctx.setLineDash([16, 12])
  ctx.beginPath()
  ctx.moveTo(x, perfY)
  ctx.lineTo(970, perfY)
  ctx.stroke()
  ctx.setLineDash([])

  // Stub
  ctx.fillStyle = C.ink2
  ctx.font = `500 32px ${SANS}`
  ctx.fillText(`Send this coupon to ${from} to claim your treat.`, x, 1140)
  ctx.letterSpacing = '4px'
  ctx.fillStyle = C.ink3
  ctx.font = `600 22px ${SANS}`
  ctx.fillText('CODE', x, 1200)
  ctx.textAlign = 'right'
  ctx.fillText('EARNED', 970, 1200)
  ctx.fillStyle = C.accent
  ctx.font = `700 50px ${SANS}`
  ctx.textAlign = 'left'
  ctx.fillText(code, x, 1256)
  ctx.letterSpacing = '0px'
  ctx.fillStyle = C.ink
  ctx.font = `600 42px ${SERIF}`
  ctx.textAlign = 'right'
  ctx.fillText(formatDayYear(earnedAt.slice(0, 10)), 970, 1256)

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not create coupon image'))), 'image/png'),
  )
}

export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export type SendResult = 'shared' | 'saved' | 'cancelled'

/**
 * Opens the tablet's share sheet with the coupon attached (so she can pick WhatsApp).
 * Where sharing files is not supported, the image is saved instead.
 */
export async function sendCoupon(blob: Blob, week: number): Promise<SendResult> {
  const filename = couponFilename(week)
  const file = new File([blob], filename, { type: 'image/png' })
  const text = `Hi ${PROGRAMME.rewardsFrom}, I finished Week ${week} of My Journo Journey. Here is my treat coupon (${couponCode(week)}).`
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Treat coupon', text })
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'
    }
  }
  saveBlob(blob, filename)
  return 'saved'
}
