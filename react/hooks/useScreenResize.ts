import { useEffect } from 'react'
import { useDevice } from 'vtex.device-detector'

import { useSliderDispatch, useSliderState } from '../components/SliderContext'

export const useScreenResize = (infinite: boolean) => {
  const {
    navigationStep,
    isPageNavigationStep,
    itemsPerPage,
    totalItems,
  } = useSliderState()
  const { device } = useDevice()
  const dispatch = useSliderDispatch()

  useEffect(() => {
    const newSlidesPerPage =
      totalItems <= itemsPerPage[device] ? totalItems : itemsPerPage[device]
    const newNavigationStep = isPageNavigationStep
      ? newSlidesPerPage
      : navigationStep

    const setNewState = (shouldCorrectItemPosition: boolean) => {
      dispatch({
        type: 'ADJUST_ON_RESIZE',
        payload: {
          shouldCorrectItemPosition,
          slidesPerPage: newSlidesPerPage,
          navigationStep: newNavigationStep,
        },
      })
    }
    const onResize = (value?: UIEvent): void => {
      setNewState(!value || infinite)
    }
    setNewState(false)

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [
    infinite,
    dispatch,
    totalItems,
    itemsPerPage,
    device,
    isPageNavigationStep,
    navigationStep,
  ])
}
