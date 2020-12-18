import React, { ReactChildren, ReactChild } from 'react'
import { pathOr, isEmpty } from 'ramda'
import { useCssHandles } from 'vtex.css-handles'
import {
  Layout,
  PageHeader,
  PageBlock,
  Button,
  withToast,
  // Dropdown,
} from 'vtex.styleguide'
import ComparisonContext from './ProductComparisonContext'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
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
        message: message,
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
    <div />
  ) : (
    <div className={`${cssHandles.pageContainer} mw9 center`}>
      <Layout
        fullWidth
        pageHeader={
          <PageHeader
            title={intl.formatMessage(messages.title, {
              productsLength: ` ` + comparisonProducts.length,
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
