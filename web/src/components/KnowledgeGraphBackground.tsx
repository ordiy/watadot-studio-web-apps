import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'

type GraphNode = { x: number; y: number }

function generateNodes(count: number): GraphNode[] {
  const nodes: GraphNode[] = []
  const cx = 0.5
  const cy = 0.46
  const halfW = 0.34
  const halfH = 0.3
  let guard = 0
  while (nodes.length < count && guard < count * 50) {
    guard += 1
    const x = Math.random()
    const y = Math.random()
    if (Math.abs(x - cx) < halfW && Math.abs(y - cy) < halfH) continue
    nodes.push({ x, y })
  }
  return nodes
}

type Props = {
  /** Section (or wrapper) that fills the hero; mouse/touch tracked here. */
  containerRef: RefObject<HTMLElement | null>
}

export function KnowledgeGraphBackground({ containerRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<GraphNode[]>([])
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  })
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })

  const nodes = useMemo(() => generateNodes(78), [])

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { w, h, dpr } = sizeRef.current
    if (w === 0 || h === 0) return

    const nodesList = nodesRef.current
    const { x: px, y: py, active } = mouseRef.current
    const R = Math.min(w, h) * 0.14

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    const line = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      alpha: number,
    ) => {
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = `rgba(23,23,23,${alpha})`
      ctx.stroke()
    }

    if (active) {
      for (let i = 0; i < nodesList.length; i += 1) {
        const nx = nodesList[i].x * w
        const ny = nodesList[i].y * h
        const di = Math.hypot(nx - px, ny - py)
        if (di >= R) continue
        for (let j = i + 1; j < nodesList.length; j += 1) {
          const nx2 = nodesList[j].x * w
          const ny2 = nodesList[j].y * h
          const dj = Math.hypot(nx2 - px, ny2 - py)
          if (dj >= R) continue
          const strength = (1 - di / R) * (1 - dj / R)
          line(nx, ny, nx2, ny2, 0.06 + strength * 0.22)
        }
      }

      for (const n of nodesList) {
        const nx = n.x * w
        const ny = n.y * h
        const d = Math.hypot(nx - px, ny - py)
        if (d < R) {
          const strength = 1 - d / R
          line(px, py, nx, ny, 0.05 + strength * 0.14)
        }
      }
    }

    for (let i = 0; i < nodesList.length; i += 1) {
      for (let j = i + 1; j < nodesList.length; j += 1) {
        const nx = nodesList[i].x * w
        const ny = nodesList[i].y * h
        const nx2 = nodesList[j].x * w
        const ny2 = nodesList[j].y * h
        const dist = Math.hypot(nx - nx2, ny - ny2)
        const max = Math.min(w, h) * 0.09
        if (dist < max) {
          const t = 1 - dist / max
          line(nx, ny, nx2, ny2, 0.02 + t * 0.05)
        }
      }
    }

    for (const n of nodesList) {
      const nx = n.x * w
      const ny = n.y * h
      ctx.beginPath()
      ctx.arc(nx, ny, 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(23,23,23,0.22)'
      ctx.fill()
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const setSize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.floor(rect.width))
      const h = Math.max(1, Math.floor(rect.height))
      sizeRef.current = { w, h, dpr }
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      draw()
    }

    setSize()
    const ro = new ResizeObserver(setSize)
    ro.observe(canvas.parentElement!)

    const local = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        active: true,
      }
      draw()
    }

    const onMove = (e: MouseEvent) => local(e.clientX, e.clientY)
    const onLeave = () => {
      mouseRef.current.active = false
      draw()
    }
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length === 0) return
      const t = e.touches[0]
      local(t.clientX, t.clientY)
    }
    const onTouchEnd = () => {
      mouseRef.current.active = false
      draw()
    }

    container.addEventListener('mousemove', onMove)
    container.addEventListener('mouseleave', onLeave)
    container.addEventListener('touchmove', onTouch, { passive: true })
    container.addEventListener('touchstart', onTouch, { passive: true })
    container.addEventListener('touchend', onTouchEnd)

    return () => {
      ro.disconnect()
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
      container.removeEventListener('touchmove', onTouch)
      container.removeEventListener('touchstart', onTouch)
      container.removeEventListener('touchend', onTouchEnd)
    }
  }, [containerRef, draw])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  )
}
