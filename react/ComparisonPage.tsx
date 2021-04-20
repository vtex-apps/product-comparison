import type { ReactChild, ReactChildren } from 'react'
import React from 'react'
import { isEmpty, pathOr } from 'ramda'
import { useCssHandles } from 'vtex.css-handles'
import {
  Button,
  Layout,
  PageBlock,
  PageHeader,
  Spinner,
  withToast,
} from 'vtex.styleguide'
import type { InjectedIntlProps } from 'react-intl'
import { defineMessages, injectIntl } from 'react-intl'

import ComparisonContext from './ProductComparisonContext'
import './global.css'

const CSS_HANDLES = ['pageContainer', 'sortBy', 'removeAllItemsButtonWrapper']

interface Props extends InjectedIntlProps {
  children: ReactChildren | ReactChild
  showToast?: (input: ToastInput) => void
}

const messages = defineMessages({
  removeAll: {
    defaultMessage: '',
    id: 'store/product-comparison.drawer.remove-all',
  },
  removeAllMessage: {
    defaultMessage: '',
    id: 'store/product-comparison.drawer.remove-all-message',
  },
  backToProducts: {
    defaultMessage: '',
    id: 'store/product-comparison.main-page.back-to-products',
  },
  sortBy: {
    defaultMessage: '',
    id: 'store/product-comparison.main-page.sort-by',
  },
  orderAdded: {
    defaultMessage: '',
    id: 'store/product-comparison.main-page.order-added',
  },
  title: {
    defaultMessage: '',
    id: 'store/product-comparison.main-page.title',
  },
})

const ComparisonPage = ({ children, intl, showToast }: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const {
    useProductComparisonState,
    useProductComparisonDispatch,
  } = ComparisonContext

  const comparisonData = useProductComparisonState()
  const dispatchComparison = useProductComparisonDispatch()

  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  const showMessage = (message: string) => {
    if (showToast) {
      showToast({
        message,
      })
    }
  }

  const removeAllItems = () => {
    dispatchComparison({
      type: 'REMOVE_ALL',
    })
    showMessage(intl.formatMessage(messages.removeAllMessage))
    window.history.back()
  }

  const onBackButtonClick = () => {
    window.history.back()
  }

  return isEmpty(comparisonProducts) ? (
    <div className="mw3 center">
      <Spinner />
    </div>
  ) : (
    <div className={`${cssHandles.pageContainer} mw9 center`}>
      <Layout
        fullWidth
        pageHeader={
          <PageHeader
            title={intl.formatMessage(messages.title, {
              productsLength: ` ${comparisonProducts.length}`,
            })}
            linkLabel={intl.formatMessage(messages.backToProducts)}
            onLinkClick={onBackButtonClick}
          >
            <div className="flex">
              <div className={`${cssHandles.sortBy} flex items-center`}>
                {/* <span className="mr2">
                  {intl.formatMessage(messages.sortBy)}
                </span>
                <Dropdown
                  variation="inline"
                  size="default"
                  options={[
                    { value: 'productName', label: 'Product Name' },
                    { value: 'price', label: 'Price' },
                  ]}
                  value={`productName`}
                /> */}
              </div>
              <div className={cssHandles.removeAllItemsButtonWrapper}>
                <Button
                  variation="tertiary"
                  size="regular"
                  onClick={removeAllItems}
                >
                  {intl.formatMessage(messages.removeAll)}
                </Button>
              </div>
            </div>
          </PageHeader>
        }
      >
        <PageBlock>{children}</PageBlock>
      </Layout>
    </div>
  )
}

export default withToast(injectIntl(ComparisonPage))
