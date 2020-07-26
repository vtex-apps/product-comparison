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
  products: ProductToCompare[]
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

type ReducerActions = AddAll | Add | RemoveAll | Remove

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
      return {
        ...state,
        products: [...state.products, product],
      }
    }
    case 'REMOVE_ALL': {
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
      return { ...state, products: remaining }
    }
    default: {
      throw new Error(`Unhandled action type on product-list-context`)
    }
  }
}

const DEFAULT_STATE: State = {
  products: [] as ProductToCompare[],
}

const ComparisonContext = createContext<State>(DEFAULT_STATE)
const ComparisonDispatchContext = createContext<Dispatch>(action => {
  console.error('error in dispatch ', action)
})

const initialState: State = {
  products: [] as ProductToCompare[],
}

interface Props {
  children: ReactChildren | ReactChild
}

const ProductComparisonProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(listReducer, initialState)

  useEffect(() => {
    const initialProducts = sessionStorage.getItem('PRODUCTS_TO_COMPARE')
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
