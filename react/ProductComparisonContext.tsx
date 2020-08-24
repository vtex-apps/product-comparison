import React, {
  ReactChildren,
  ReactChild,
  useReducer,
  useContext,
  createContext,
  useEffect,
} from 'react'
import { pathOr, reject, propEq, allPass } from 'ramda'

export interface State {
  isDrawerCollapsed: boolean
  showDifferences: boolean
  products: ProductToCompare[]
}

interface SetShowDifferences {
  type: 'SET_SHOW_DIFFERENCES'
  args: { showDifferences: boolean }
}

interface AddAll {
  type: 'ADD_ALL'
  args: { products: ProductToCompare[] }
}

interface RemoveAll {
  type: 'REMOVE_ALL'
}

interface Add {
  type: 'ADD'
  args: { product: ProductToCompare }
}

interface Remove {
  type: 'REMOVE'
  args: { product: ProductToCompare }
}

interface IsDrawerCollapsed {
  type: 'IS_DRAWER_COLLAPSED'
  args: { isDrawerCollapsed: boolean }
}

type ReducerActions =
  | AddAll
  | Add
  | RemoveAll
  | Remove
  | SetShowDifferences
  | IsDrawerCollapsed

export type Dispatch = (action: ReducerActions) => void

const listReducer = (state: State, action: ReducerActions): State => {
  switch (action.type) {
    case 'ADD_ALL': {
      const products = pathOr([], ['args', 'products'], action)
      return {
        ...state,
        products: [...state.products, ...products],
      }
    }
    case 'ADD': {
      const { product } = action.args
      const newProductList = [...state.products, product]
      localStorage.setItem(
        'PRODUCTS_TO_COMPARE',
        JSON.stringify(newProductList)
      )
      return {
        ...state,
        products: newProductList,
      }
    }
    case 'REMOVE_ALL': {
      localStorage.setItem('PRODUCTS_TO_COMPARE', JSON.stringify([]))
      return {
        ...state,
        products: [],
      }
    }
    case 'REMOVE': {
      const { product } = action.args
      const remaining = reject(
        allPass([
          propEq('productId', product.productId),
          propEq('skuId', product.skuId),
        ])
      )(state.products)

      localStorage.setItem('PRODUCTS_TO_COMPARE', JSON.stringify(remaining))
      return { ...state, products: remaining }
    }
    case 'SET_SHOW_DIFFERENCES': {
      return {
        ...state,
        ...{ showDifferences: action.args.showDifferences },
      }
    }
    case 'IS_DRAWER_COLLAPSED': {
      return {
        ...state,
        isDrawerCollapsed: action.args.isDrawerCollapsed,
      }
    }
    default: {
      throw new Error(`Unhandled action type on product-list-context`)
    }
  }
}

const DEFAULT_STATE: State = {
  isDrawerCollapsed: false,
  showDifferences: false,
  products: [] as ProductToCompare[],
}

const ComparisonContext = createContext<State>(DEFAULT_STATE)
const ComparisonDispatchContext = createContext<Dispatch>(action => {
  console.error('error in dispatch ', action)
})

const initialState: State = {
  showDifferences: false,
  isDrawerCollapsed: false,
  products: [] as ProductToCompare[],
}

interface Props {
  children: ReactChildren | ReactChild
}

const ProductComparisonProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(listReducer, initialState)

  useEffect(() => {
    const initialProducts = localStorage.getItem('PRODUCTS_TO_COMPARE')
    const productsToCompare = (initialProducts
      ? JSON.parse(initialProducts)
      : []) as ProductToCompare[]
    dispatch({ type: 'ADD_ALL', args: { products: productsToCompare } })
  }, [])

  return (
    <ComparisonContext.Provider value={state}>
      <ComparisonDispatchContext.Provider value={dispatch}>
        {children}
      </ComparisonDispatchContext.Provider>
    </ComparisonContext.Provider>
  )
}

const useProductComparisonState = () => useContext(ComparisonContext)

const useProductComparisonDispatch = () => useContext(ComparisonDispatchContext)

export default {
  ProductComparisonProvider,
  useProductComparisonState,
  useProductComparisonDispatch,
}
