import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import './AnimatedList.css'

function AnimatedItem({ children, index, onMouseEnter, onClick }) {
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <motion.div
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={reduceMotion ? false : { scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25, delay: reduceMotion ? 0 : index * 0.06 }}
      style={{ marginBottom: '0.65rem', cursor: 'pointer' }}
    >
      {children}
    </motion.div>
  )
}

export default function AnimatedList({
  items = [],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1,
}) {
  const listRef = useRef(null)
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex)
  const [keyboardNav, setKeyboardNav] = useState(false)
  const [topGradientOpacity, setTopGradientOpacity] = useState(0)
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1)

  const handleScroll = useCallback((event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    setTopGradientOpacity(Math.min(scrollTop / 50, 1))
    const bottomDistance = scrollHeight - (scrollTop + clientHeight)
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1))
  }, [])

  useEffect(() => {
    if (!enableArrowNavigation) return undefined

    const handleKeyDown = (event) => {
      const root = listRef.current?.parentElement
      if (!root?.contains(document.activeElement) && document.activeElement !== root) return

      if (event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey)) {
        event.preventDefault()
        setKeyboardNav(true)
        setSelectedIndex((prev) => Math.min((prev < 0 ? -1 : prev) + 1, items.length - 1))
      } else if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
        event.preventDefault()
        setKeyboardNav(true)
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (event.key === 'Enter' && selectedIndex >= 0) {
        event.preventDefault()
        onItemSelect?.(items[selectedIndex], selectedIndex)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enableArrowNavigation, items, onItemSelect, selectedIndex])

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return
    const selectedItem = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
    selectedItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    setKeyboardNav(false)
  }, [selectedIndex, keyboardNav])

  return (
    <div className={`scroll-list-container ${className}`} tabIndex={0} aria-label="Highlights">
      <div
        ref={listRef}
        className={`scroll-list ${displayScrollbar ? '' : 'no-scrollbar'}`}
        onScroll={handleScroll}
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={item}
            index={index}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => {
              setSelectedIndex(index)
              onItemSelect?.(item, index)
            }}
          >
            <div className={`item ${selectedIndex === index ? 'selected' : ''} ${itemClassName}`}>
              <p className="item-text">{item}</p>
            </div>
          </AnimatedItem>
        ))}
      </div>
      {showGradients ? (
        <>
          <div className="top-gradient" style={{ opacity: topGradientOpacity }} />
          <div className="bottom-gradient" style={{ opacity: bottomGradientOpacity }} />
        </>
      ) : null}
    </div>
  )
}
