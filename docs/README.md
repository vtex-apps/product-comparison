📢 Use this project, [contribute](https://github.com/vtex-apps/product-comparison) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Product Comparison

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

The Product Comparison app compares specifications of pre-selected SKUs, allowing store users to better understand their needs when shopping.

The app exports several blocks, which you can leverage from in order to display a Product Comparison drawer on seach results page and a new Product Comparison page in your store.

![Comparison drawer](https://user-images.githubusercontent.com/2637457/90900569-43a41a00-e3e7-11ea-9aa9-9a12bbec8c5e.png)
*Product Comparison drawer on the store's search results page*
![image](https://user-images.githubusercontent.com/2637457/90900828-a1386680-e3e7-11ea-96d1-e9ba2022aa7d.png)
*Product Comparison page*

## Configuration

### Step 1 - Adding the Product Comparison app to your theme's dependencies

In your theme's `manifest.json` file, add the `Product Comparison` app as a dependency:

```diff
 "dependencies": {
+  "vtex.product-comparison": "0.x"
 }
```

### Step 2 - Adding extended interfaces

In the theme's `interfaces.json` file, add the following extented interfaces:

```diff
+{
+  "store.search.product-comparison": {
+    "around": ["comparison-context-wrapper"]
+  },
+  "search-result-layout.desktop.product-comparison": {
+    "allowed": ["product-comparison-drawer"]
+  }
+}
```

### Step 3 - Wraping the search blocks with Product Comparison context

1. In the theme's `search.jsonc` file, replace the default `store.search` blocks with the `store.search.product-comparison` blocks as shown in the example below:

```diff
{
  ...
- "store.search": {
+ "store.search.product-comparison": {
    ...
  },
- "store.search#brand": {
+ "store.search.product-comparison#brand": {
    ...
  },
- "store.search#department": {
+ "store.search.product-comparison#department": {
    ...
  }
- "store.search#category": {
+ "store.search.product-comparison#category": {
    ...
  }
- "store.search#subcategory": {
+ "store.search.product-comparison#subcategory": {
    ...
  }
  ...
```

:information_source: *The `store.search.product-comparison` blocks will wraps the `store.search` block with comparison context. The replacement is needed so we can synchronously display the selected products in the Product Comparison drawer.*

2. Replace the `search-result-layout.desktop` blocks with the `search-result-layout.desktop.product-comparison` blocks as shown below:

```diff
{
  ...
"search-result-layout": {
  "blocks": [
-   "search-result-layout.desktop#search"
+   "search-result-layout.desktop.product-comparison#search",
    "search-result-layout.mobile",
    "search-not-found-layout"
  ]
},
...

- "search-result-layout.desktop#search": {
+ "search-result-layout.desktop.product-comparison#search": {
  "children": [
    "flex-layout.row#did-you-mean",
    "flex-layout.row#suggestion",
    "flex-layout.row#banner-one",
    "flex-layout.row#searchbread",
    "flex-layout.row#searchtitle",
    "flex-layout.row#result",
+    "product-comparison-drawer"
  ],
  "props": {
    "pagination": "show-more",
    "preventRouteChange": false,
    "mobileLayout": {
      "mode1": "small",
      "mode2": "normal"
    }
  }
}
...
```

:information_source: *This will add the Product Comparison drawer to the store's search results page..

3. Replace the `product-summary.shelf`, child of the `gallery` block, with the `product-summary.shelf.product-comparison`:

```diff
"gallery": {
-  "blocks": ["product-summary.shelf"]
+  "blocks": ["product-summary.shelf.product-comparison#search"]
}
...
```

### Step 4 - Building the Product Comparison page

1. In the `/store/blocks` folder, create a new file called `product-comparison.json` and add in it the following JSON:

```diff
+{
+  "store.custom#product-comparison-list": {
+    "children": [
+      "comparison-page"
+    ]
+  },
+  "product-summary.shelf.product-comparison#search": {
+    "children": [
+      "product-summary-image",
+      "product-summary-name",
+      "product-summary-attachment-list",
+      "product-summary-space",
+      "product-summary-column#1",
+      "product-comparison-block.selector"
+    ]
+  }
+}
```

2. In the theme's `routes.json` file, add the following new routes for the Product Comparison page:

```diff
+{
+  "store.custom#product-comparison-list": {
+    "path": "/product-comparison"
+  }
+}
```

# Blocks
Check out the full list of `product-comparison` app below:

| Block name   | Description                |
| :--------:   | :------------------------: |
| `product-comparison-drawer` | product comparison drawer which holds items in product summary view |
| `list-context.comparison-product-summary-slider` | Product summary list with slider layout |
| `product-summary.shelf.product-comparison` | Extended product summary block for product comparison features |
| `product-comparison-block` | This is the generic component which was extended to develop feature blocks |
| `product-comparison-block.selector` | This is the product selector checkbox for product summary |
| `product-comparison-block.close-button` | This is the remove button for product summary |
| `product-comparison-block.product-summary-row` : First row of comparison row |
| `list-context.comparison-row` | This block represents single row in product comparison page |
| `product-comparison-block.product-summary-row` | Row with product summary lisging |
| `product-comparison-block.grouped-product-specifications` | Product specifications separating with specification groups |
| `product-comparison-block.product-specifications` | Product specification section (Not comes with default setup) |
| `product-comparison-block.sku-specifications` | Sku specification section (Not comes with default setup) |

#### `product-comparison-block.grouped-product-specifications` props

| Prop name      | Type          | Description                    | Default value |
| :------------: | :-----------: | :----------------------------: | :-----------: |
| `productSpecificationsToHide` | `[string]` | List of product fields that should be hidden in the Product Comparison page. The desired product fields must be separated by comma. | `undefined` |
| `productSpecificationGroupsToHide` | `[string]` | List of product specification groups that should be hidden on the Product Comparison page. The desired product specification groups must be separated by comma. | `undefined` |

#### `product-comparison-block.product-specifications` props

| Prop name      | Type          | Description                    | Default value |
| :------------: | :-----------: | :----------------------------: | :--------:    |
| `productSpecificationsToHide` | `[string]` | List of product fields that should be hidden in the Product Comparison page. The desired product fields must be separated by comma. | `undefined` |

#### `product-comparison-block.sku-specifications` props

| Prop name      | Type          | Description                    | Default value |
| :------------: | :-----------: | :----------------------------: | :--------:    |
| `skuSpecificationsToHide` | `[string]` | List of SKU specification fields that should be hidden on the Product Comparison page. The desired SKU specification fields must be separated by comma. | `undefined` |

# Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles                  |
| :--------------------------: |
| `closeButton`                |
| `closeButtonContainer`       |
| `compareProductsButton`      |
| `comparisonButtons`          |
| `comparisonCol`              |
| `drawer`                     |
| `drawerContainer`            |
| `expandCollapseButton`       |
| `fieldNameCol`               |
| `fieldNameCol`               |
| `productFieldValue`          |
| `productSelectorContainer`   |
| `productSpecificationValue`  |
| `productSpecificationValues` |
| `productSummaryRowContainer` |
| `rowContainer`               |
| `showDifferencesContainer`   |
| `skuFieldValue`              |
| `skuSpecificationValue`      |
| `skuSpecificationValues`     |
| `title`                      |
| `removeAllItemsButtonWrapper`|
| `compareProductButtonWrapper`|
| `removeAllWrapper`           |
| `hideOrShowText`             |

<!-- DOCS-IGNORE:start -->
## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
