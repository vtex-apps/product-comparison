# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.18.1] - 2024-02-21

## [0.18.0] - 2023-02-24

### Changed

- Uses `publicSettingsForApp` endpoint to retrieve app settings

## [0.17.0] - 2022-06-15

### Added
- French translation.

### Fixed
- Russian translation.

## [0.16.0] - 2022-03-14

### Added
- Portuguese and Spanish translations.

## [0.15.1] - 2022-02-25

### Fixed
- Russian translation.

## [0.15.0] - 2022-02-17

### Added
- Russian translation.

### Fixed
- I18n message variable declaration to render translations properly.

## [0.14.0] - 2022-02-14

### Fixed
- English translation to reflect plurals.

### Added
- Arabic translation.

## [0.13.0] - 2021-12-01

### Added
- Italian translations
- Crowdin configuration file

## [0.12.0] - 2021-06-28
- Added comparison component to the product detail page
## [0.11.0] - 2021-04-29
### Added
- CSS Handles:
  - `drawerTitleOuterContainer`
  - `drawerTitleInnerContainer`
  - `drawerOpened`
  - `drawerClosed`
## [0.10.0] - 2021-04-20

### Added
- Added pixel event

## [0.9.2] - 2021-04-09

### Changed

- Changed hardcoded label string "Show only differences" to use predefined message

## [0.9.1] - 2021-03-19

## [0.9.0] - 2021-02-24
- Translation for main page title
- Translation for "Show only differences" button

### Changed
- Update compare button url to render runtime navigate function
- Extract navigate to a function

## [0.8.0] - 2021-01-13

## [0.7.0] - 2021-01-12

## [0.6.0] - 2021-01-11

### Added
- Implemented loading behaviour for products comparison page.

### Changed
- Limit comparison bucket size and given it as app configuration parameter
- Enhance product comparison context to add array of items at once
- Show notifications when comparison bucket is full


## [0.5.0] - 2020-11-19

## [0.4.0] - 2020-11-10

### Added
- CSS Handles:
  - `removeAllItemsButtonWrapper`
  - `compareProductButtonWrapper`
  - `removeAllWrapper`
  - `hideOrShowText`

## [0.3.0] - 2020-11-06

### Added

- `docs` builder to manifest

## [0.2.1] - 2020-11-03

## [0.2.0] - 2020-10-08

## [0.1.0] - 2020-09-29

### Changed

- Change vendor name and application name

### Added

- Added product specification groups for comparison

### Fixed

- fix requested ui issues
- fix slider refresh issue

### Removed

- remove unused files in product comparison grid

### Changed

- drawer product summary styling
- rename translation key
- Rename `type` to `fieldType` in comparison field
- Product comparison hide fields

### Added

- Product comparison grid basic feature
- Comparison list normalize product for product summary

### Fixed

- Fix ui switch change in comparison drawer

### Changed

- use promise all to get all products at once in product comparison page
- use product query to get product details
- Change back to comparison check box
- Added style changes to comparison drawer

### Added

- Added product comparison basic functionalities
- Add changelog
- Product comparison page basic functionality
