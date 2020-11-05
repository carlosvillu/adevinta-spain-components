import {useCallback, useEffect, useState} from 'react'
import useMount from '../useMount'

const THRESHOLDS = {
  DISTANCE: 100,
  TIME: 100
}

export default function useSwipe(ref) {
  const [start, setStart] = useState({x: 0, y: 0, time: 0})
  const [capturing, setCapturing] = useState(false)
  const [end, setEnd] = useState({x: 0, y: 0})
  const [direction, setDirection] = useState(undefined)

  const onStart = ({clientX: x, clientY: y}) => {
    setCapturing(true)
    setStart({x, y, time: +new Date()})
  }

  const onMove = useCallback(({clientX: x, clientY: y}) => setEnd({x, y}), [])

  useEffect(() => {
    const {current} = ref

    if (current) {
      if (capturing) {
        current.addEventListener('pointermove', onMove)
      } else {
        current.removeEventListener('pointermove', onMove)

        const {TIME} = THRESHOLDS
        const deltaTime = +new Date() - start.time

        if (deltaTime > TIME) {
          setEnd()
          const {DISTANCE} = THRESHOLDS
          const deltaX = end?.x - start.x
          const deltaY = end?.y - start.y

          if (deltaX > DISTANCE && Math.abs(deltaY) < DISTANCE) {
            setDirection('right')
          } else if (-deltaX > DISTANCE && Math.abs(deltaY) < DISTANCE) {
            setDirection('left')
          } else if (deltaY > DISTANCE && Math.abs(deltaX) < DISTANCE) {
            setDirection('down')
          } else if (-deltaY > DISTANCE && Math.abs(deltaX) < DISTANCE) {
            setDirection('up')
          } else {
            setDirection(undefined)
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturing])

  const onEnd = () => setCapturing(false)

  useMount(() => {
    const {current} = ref

    if (current) {
      current.addEventListener('pointerdown', onStart)
      current.addEventListener('pointerup', onEnd)
      current.addEventListener('pointerleave', onEnd)
      current.addEventListener('pointercancel', onEnd)
    }

    return () => {
      if (current) {
        current.removeEventListener('pointerdown', onStart)
        current.removeEventListener('pointerup', onEnd)
        current.removeEventListener('pointerleave', onEnd)
        current.removeEventListener('pointercancel', onEnd)
      }
    }
  })

  return direction
}
