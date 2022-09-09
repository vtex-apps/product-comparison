/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { pathOr, isEmpty } from 'ramda'
import { Button, Collapsible, withToast } from 'vtex.styleguide'
import { ExtensionPoint, useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl, defineMessages } from 'react-intl'
import { usePixel } from 'vtex.pixel-manager'

import ComparisonContext from '../../ProductComparisonContext'
import './drawer.css'

const CSS_HANDLES = [
  'drawerContainer',
  'expandCollapseButton',
  'comparisonButtons',
  'compareProductsButton',
  'drawer',
  'compareProductButtonWrapper',
  'removeAllWrapper',
  'hideOrShowText',
  'drawerTitleOuterContainer',
  'drawerTitleInnerContainer',
  'drawerOpened',
  'drawerClosed',
]

const messages = defineMessages({
  removeAll: {
    defaultMessage: '',
    id: 'store/product-comparison.drawer.remove-all',
  },
  products: {
    defaultMessage: '',
    id: 'store/product-comparison.drawer.products',
  },
  compare: {
    defaultMessage: '',
    id: 'store/product-comparison.drawer.compare',
  },
  removeAllMessage: {
    defaultMessage: '',
    id: 'store/product-comparison.drawer.remove-all-message',
  },
  show: {
    defaultMessage: '',
    id: 'store/product-comparison.drawer.show',
  },
  hide: {
    defaultMessage: '',
    id: 'store/product-comparison.drawer.hide',
  },
  minItemsMessage: {
    defaultMessage: '',
    id: 'store/product-comparison.drawer.min-items-message',
  },
  maxItemsMessage1: {
    defaultMessage: '',
    id: 'store/product-comparison.drawer.max-items-message-1',
  },
  maxItemsMessage2: {
    defaultMessage: '',
    id: 'store/product-comparison.drawer.max-items-message-2',
  },
})

interface Props extends InjectedIntlProps {
  showToast?: (input: ToastInput) => void
  comparisonPageUrl?: string
}

const ComparisonDrawer = ({ showToast, intl, comparisonPageUrl }: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const { navigate } = useRuntime()
  const { push }: any = usePixel()
  // const [isCollapsed, setCollapsed] = useState(false)
  const { useProductComparisonState, useProductComparisonDispatch } =
    ComparisonContext

  const comparisonData = useProductComparisonState()
  const dispatchComparison = useProductComparisonDispatch()

  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  const isCollapsed = pathOr(false, ['isDrawerCollapsed'], comparisonData)

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
    push({
      event: 'compareProducts',
      products: comparisonProducts,
      action: 'remove',
    })
  }

  const onExpandCollapse = () => {
    dispatchComparison({
      args: {
        isDrawerCollapsed: !isCollapsed,
      },
      type: 'IS_DRAWER_COLLAPSED',
    })
  }

  const onClickCompare = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!comparisonProducts || comparisonProducts.length < 2) {
      showMessage(intl.formatMessage(messages.minItemsMessage))
      e.preventDefault()
      e.stopPropagation()
    } else if (comparisonProducts.length > 10) {
      showMessage(
        `${intl.formatMessage(
          messages.maxItemsMessage1
        )} ${10} ${intl.formatMessage(messages.maxItemsMessage2)}`
      )
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const navigateToComparisonPage = () => {
    const url =
      comparisonProducts.length < 2
        ? '#'
        : comparisonPageUrl || '/product-comparison'

    navigate({ to: url })
  }

  return isEmpty(comparisonProducts) ? (
    <div />
  ) : (
    <div
      className={`${cssHandles.drawerContainer} ${
        isCollapsed ? cssHandles.drawerClosed : cssHandles.drawerOpened
      } bg-white w-100 bt-ns b--light-gray flex justify-center`}
    >
      <div className="mw9 w-100 ">
        <Collapsible
          header={
            <div
              className={`${cssHandles.comparisonButtons} flex flex-row ma3`}
            >
              <div
                className={`flex items-center-ns mr2 ml2  ${cssHandles.drawerTitleOuterContainer}`}
              >
                <span
                  className={`fw5 black  ${cssHandles.drawerTitleInnerContainer}`}
                >
                  <span>{intl.formatMessage(messages.compare)} </span>{' '}
                  <span>{comparisonProducts.length}</span>{' '}
                  <span>
                    {intl.formatMessage(messages.products, {
                      productsLength: comparisonProducts.length,
                    })}
                  </span>
                </span>
              </div>
              <div className="flex-grow-1" />
              <div className="flex mr2 ml2">
                <button
                  onClick={onExpandCollapse}
                  className={`${cssHandles.expandCollapseButton} bg-transparent bn-ns t-small c-action-primary hover-c-action-primary pointer`}
                >
                  <span className={cssHandles.hideOrShowText}>
                    {!isCollapsed
                      ? intl.formatMessage(messages.hide)
                      : intl.formatMessage(messages.show)}
                  </span>
                </button>
              </div>
              <div className={`flex mr2 ml2 ${cssHandles.removeAllWrapper}`}>
                <Button
                  block
                  variation="danger-tertiary"
                  size="small"
                  onClick={removeAllItems}
                >
                  {intl.formatMessage(messages.removeAll)}
                </Button>
              </div>
              <div
                className={`flex mr2 ml2 ${cssHandles.compareProductButtonWrapper}`}
                onClick={onClickCompare}
              >
                <Button
                  block
                  size="small"
                  className={`${cssHandles.compareProductsButton} ma3`}
                  onClick={navigateToComparisonPage}
                >
                  {intl.formatMessage(messages.compare)}
                </Button>
              </div>
            </div>
          }
          isOpen={!isCollapsed}
        >
          <div
            className={`${cssHandles.drawer} flex flex-row justify-center pl3 pr3`}
          >
            <ExtensionPoint id="list-context.comparison-product-summary-slider" />
          </div>
        </Collapsible>
      </div>
    </div>
  )
}

ComparisonDrawer.schema = {
  title: 'admin/editor.comparison-drawer.title',
  description: 'admin/editor.comparison-drawer.description',
  type: 'object',
  properties: {
    comparisonPageUrl: {
      title: 'admin/editor.comparison-grid.drawer.title',
      type: 'string',
    },
  },
}

export default withToast(injectIntl(ComparisonDrawer))
