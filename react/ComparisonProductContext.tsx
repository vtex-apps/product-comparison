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
  products: Product[]
}

interface AddAll {
  type: 'ADD_ALL_PRODUCTS'
  args: { products: Product[] }
}

interface RemoveAll {
  type: 'REMOVE_ALL_PRODUCTS'
}

interface Add {
  type: 'ADD_PRODUCT'
  args: { product: Product }
}

interface Remove {
  type: 'REMOVE_PRODUCT'
  args: { product: Product }
}

type ReducerActions = AddAll | Add | RemoveAll | Remove

export type Dispatch = (action: ReducerActions) => void

const listReducer = (state: State, action: ReducerActions): State => {
  switch (action.type) {
    case 'ADD_ALL_PRODUCTS': {
      const products = pathOr([], ['args', 'products'], action)
      return {
        ...state,
        products: [...products],
      }
    }
    case 'ADD_PRODUCT': {
      const { product } = action.args
      const newProductList = [...state.products, product]
      return {
        ...state,
        products: newProductList,
      }
    }
    case 'REMOVE_ALL_PRODUCTS': {
      return {
        ...state,
        products: [],
      }
    }
    case 'REMOVE_PRODUCT': {
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
    default: {
      throw new Error(`Unhandled action type on product-list-context`)
    }
  }
}

const DEFAULT_STATE: State = {
  products: [] as Product[],
}

const ComparisonProductContext = createContext<State>(DEFAULT_STATE)
const ComparisonProductDispatchContext = createContext<Dispatch>(action => {
  console.error('error in dispatch ', action)
})

const initialState: State = {
  products: [] as ProductToCompare[],
}

interface Props {
  products: Product[]
  children: ReactChildren | ReactChild
}

const ComparisonProductProvider = ({ products, children }: Props) => {
  const [state, dispatch] = useReducer(listReducer, initialState)

  useEffect(() => {
    if (products && products.length > 0) {
      dispatch({ type: 'ADD_ALL_PRODUCTS', args: { products: products } })
    }
  }, [products])

  return (
    <ComparisonProductContext.Provider value={state}>
      <ComparisonProductDispatchContext.Provider value={dispatch}>
        {children}
      </ComparisonProductDispatchContext.Provider>
    </ComparisonProductContext.Provider>
  )
}

const useComparisonProductState = () => useContext(ComparisonProductContext)

const useComparisonProductDispatch = () =>
  useContext(ComparisonProductDispatchContext)

export default {
  ComparisonProductProvider,
  useComparisonProductState,
  useComparisonProductDispatch,
}
