import React, { useLayoutEffect, useState } from 'react'

function WidthSizeCustHook() {
  const [size, setSize] = useState([0, 0])
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    // console.log(size)
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size
}

export default WidthSizeCustHook
