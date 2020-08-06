import React, {
  createContext,
  useReducer,
  useContext,
  FC,
  // ReactNode,
  useMemo,
} from 'react'
import { useDevice } from 'vtex.device-detector'

interface AdjustOnResizeAction {
  type: 'ADJUST_ON_RESIZE'
  payload: {
    shouldCorrectItemPosition: boolean
    slidesPerPage: number
    navigationStep: number
  }
}

interface SlideAction {
  type: 'SLIDE'
  payload: {
    transform?: number
    currentSlide: number
  }
}

interface TouchAction {
  type: 'TOUCH'
  payload: {
    transform?: number
    isOnTouchMove: boolean
  }
}

interface DisableTransitionAction {
  type: 'DISABLE_TRANSITION'
}

interface AdjustCurrentSlideAction {
  type: 'ADJUST_CURRENT_SLIDE'
  payload: {
    currentSlide: number
    transform?: number
  }
}

interface State extends SliderLayoutProps {
  /** Width of each slide */
  slideWidth: number
  /** Number of slides to show per page */
  slidesPerPage: number
  /** Index of the leftmost slide of the current page */
  currentSlide: number
  /** Current transform value */
  transform: number
  /** Total number of slides */
  totalItems: number
  /** Number of slides to slide in navigation */
  navigationStep: number
  /** Whether or not navigationStep prop is set to 'page' */
  isPageNavigationStep: boolean
  /** Whether or not a touchmove event is happening */
  isOnTouchMove: boolean
  useSlidingTransitionEffect: boolean
  transformMap: Record<number, number>
  // slides: Array<Exclude<ReactNode, boolean | null | undefined>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slides: any
}

interface SliderContextProps extends SliderLayoutProps {
  totalItems: number
  infinite: SliderLayoutSiteEditorProps['infinite']
  // This type comes from React itself. It is the return type for
  // React.Children.toArray().
  // slides: Array<Exclude<ReactNode, boolean | null | undefined>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slides: any
}

type Action =
  | AdjustOnResizeAction
  | SlideAction
  | TouchAction
  | DisableTransitionAction
  | AdjustCurrentSlideAction
type Dispatch = (action: Action) => void

const SliderStateContext = createContext<State | undefined>(undefined)
const SliderDispatchContext = createContext<Dispatch | undefined>(undefined)

function sliderContextReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADJUST_ON_RESIZE':
      return {
        ...state,
        slidesPerPage: action.payload.slidesPerPage,
        navigationStep: action.payload.navigationStep,
        transform: action.payload.shouldCorrectItemPosition
          ? -state.slideWidth * state.currentSlide
          : state.transform,
      }

    case 'SLIDE':
      return {
        ...state,
        transform: action.payload.transform ?? state.transform,
        currentSlide: action.payload.currentSlide,
        useSlidingTransitionEffect: true,
      }

    case 'TOUCH':
      return {
        ...state,
        transform: action.payload.transform ?? state.transform,
        isOnTouchMove: action.payload.isOnTouchMove,
      }

    case 'DISABLE_TRANSITION':
      return {
        ...state,
        useSlidingTransitionEffect: false,
      }

    case 'ADJUST_CURRENT_SLIDE':
      return {
        ...state,
        currentSlide: action.payload.currentSlide,
        transform: action.payload.transform ?? state.transform,
      }

    default:
      return state
  }
}

const SliderContextProvider: FC<SliderContextProps> = ({
  autoplay,
  children,
  totalItems,
  label = 'slider',
  navigationStep = 'page',
  slides,
  infinite = false,
  slideTransition = {
    speed: 400,
    delay: 0,
    timing: '',
  },
  itemsPerPage = {
    desktop: 5,
    tablet: 3,
    phone: 1,
  },
}) => {
  const { device } = useDevice()

  const resolvedNavigationStep =
    navigationStep === 'page' ? itemsPerPage[device] : navigationStep

  const resolvedSlidesPerPage =
    totalItems <= itemsPerPage[device] ? totalItems : itemsPerPage[device]

  const postRenderedSlides = infinite
    ? slides.slice(0, resolvedSlidesPerPage)
    : []

  const preRenderedSlides = infinite
    ? slides.slice(slides.length - resolvedSlidesPerPage)
    : []

  const newSlides = preRenderedSlides.concat(slides, postRenderedSlides)

  const slideWidth = useMemo(() => 100 / newSlides.length, [newSlides.length])

  const transformMap = useMemo(() => {
    const currentMap: Record<number, number> = {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newSlides.forEach((_: any, idx: number) => {
      currentMap[idx - resolvedSlidesPerPage] = -(slideWidth * idx)
    })

    return currentMap
  }, [slideWidth, newSlides, resolvedSlidesPerPage])

  const [state, dispatch] = useReducer(sliderContextReducer, {
    slideWidth,
    slidesPerPage: resolvedSlidesPerPage,
    currentSlide: 0,
    transform: transformMap[0],
    transformMap,
    slides: newSlides,
    navigationStep: resolvedNavigationStep,
    slideTransition,
    itemsPerPage,
    label,
    autoplay,
    totalItems,
    isPageNavigationStep: navigationStep === 'page',
    isOnTouchMove: false,
    useSlidingTransitionEffect: false,
  })

  return (
    <SliderStateContext.Provider value={state}>
      <SliderDispatchContext.Provider value={dispatch}>
        {children}
      </SliderDispatchContext.Provider>
    </SliderStateContext.Provider>
  )
}

function useSliderState() {
  const context = useContext(SliderStateContext)

  if (context === undefined) {
    throw new Error(
      'useSliderState must be used within a SliderContextProvider'
    )
  }

  return context
}

function useSliderDispatch() {
  const context = useContext(SliderDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useSliderDispatch must be used within a SliderContextProvider'
    )
  }

  return context
}

export { SliderContextProvider, useSliderDispatch, useSliderState }
