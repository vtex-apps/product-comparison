import type { ReactChildren, ReactChild } from 'react'
import React, { useReducer, useContext, createContext, useEffect } from 'react'
import { pathOr, reject, propEq, allPass } from 'ramda'
import { useQuery } from 'react-apollo'

import AppSettings from './queries/AppSettings.graphql'

export interface State {
  isDrawerCollapsed: boolean
  showDifferences: boolean
  products: ProductToCompare[]
  maxNumberOfItemsToCompare: number
}

interface SetShowDifferences {
  type: 'SET_SHOW_DIFFERENCES'
  args: { showDifferences: boolean }
}

interface AddAll {
  type: 'ADD_ALL'
  args: { products: ProductToCompare[] }
}

interface AddMultiple {
  type: 'ADD_MULTIPLE'
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

interface SetMaxLimit {
  type: 'SET_MAX_LIMIT'
  args: { maxLimit: number }
}

type ReducerActions =
  | AddAll
  | AddMultiple
  | Add
  | RemoveAll
  | Remove
  | SetShowDifferences
  | IsDrawerCollapsed
  | SetMaxLimit

export type Dispatch = (action: ReducerActions) => void

const listReducer = (state: State, action: ReducerActions): State => {
  switch (action.type) {
    case 'ADD_ALL': {
      const products = pathOr([], ['args', 'products'], action)
      const productsToCompare = [...state.products, ...products].slice(
        0,
        state.maxNumberOfItemsToCompare
      )

      return {
        ...state,
        products: productsToCompare,
      }
    }

    case 'ADD_MULTIPLE': {
      const products = pathOr([], ['args', 'products'], action)

      const productsToAdd = products.filter(
        (product: ProductToCompare) =>
          state.products.filter(
            (existing: ProductToCompare) =>
              existing.productId === product.productId &&
              existing.skuId === product.skuId
          ).length === 0
      )

      const newProductList = [...state.products, ...productsToAdd].slice(
        0,
        state.maxNumberOfItemsToCompare
      )

      localStorage.setItem(
        'PRODUCTS_TO_COMPARE',
        JSON.stringify(newProductList)
      )

      return {
        ...state,
        products: newProductList,
      }
    }

    case 'ADD': {
      const { product } = action.args
      const newProductList = [...state.products, product].slice(
        0,
        state.maxNumberOfItemsToCompare
      )

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

    case 'SET_MAX_LIMIT': {
      return {
        ...state,
        maxNumberOfItemsToCompare: action.args.maxLimit,
      }
    }

    default: {
      throw new Error(`Unhandled action type on product-list-context`)
    }
  }
}

const MAX_ITEMS_TO_COMPARE = 10

const DEFAULT_STATE: State = {
  isDrawerCollapsed: false,
  showDifferences: false,
  products: [] as ProductToCompare[],
  maxNumberOfItemsToCompare: MAX_ITEMS_TO_COMPARE,
}

const ComparisonContext = createContext<State>(DEFAULT_STATE)
const ComparisonDispatchContext = createContext<Dispatch>((action) => {
  console.error('error in dispatch ', action)
})

const initialState: State = {
  showDifferences: false,
  isDrawerCollapsed: false,
  products: [] as ProductToCompare[],
  maxNumberOfItemsToCompare: MAX_ITEMS_TO_COMPARE,
}

interface Props {
  children: ReactChildren | ReactChild
}

const ProductComparisonProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(listReducer, initialState)

  const { data: appSettingsData } = useQuery(AppSettings, {
    variables: {
      // eslint-disable-next-line no-undef
      version: process.env.VTEX_APP_VERSION,
    },
    ssr: false,
  })

  useEffect(() => {
    const appSettings = JSON.parse(
      pathOr(`{}`, ['publicSettingsForApp', 'message'], appSettingsData)
    )

    dispatch({
      type: 'SET_MAX_LIMIT',
      args: {
        maxLimit: pathOr(
          MAX_ITEMS_TO_COMPARE,
          ['maxNumberOfItemsToCompare'],
          appSettings
        ),
      },
    })
  }, [appSettingsData])

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
