# CurrenC – COMP3074 Assignment 2

React Native Android app for currency conversion.

## Features

- Two screens:
  - **MainScreen** – Currency converter with:
    - Base currency code (default `CAD`)
    - Destination currency code
    - Amount (default `1`)
    - Input validation (3-letter ISO codes, positive amount)
    - API call to [FreeCurrencyAPI](https://api.freecurrencyapi.com/v1/latest)
    - Error handling for invalid input, API key issues, and network failures
    - Optional features:
      - Loading indicator
      - Disabled Convert button while fetchingg
      - Reusable components (`LabeledInput`, `CurrencyChips`)
      - Modern dark UI with card + glow effect
  - **AboutScreen** – Shows:
    - Name: **Henrique Custodio**
    - Student ID: **101497015**
    - Short description of the application

## Tech stack

- React Native
- React Navigation (stack navigation)
- TypeScript
- FreeCurrencyAPI

## Running the app

From inside the project folder:

```bash
# install dependencies
npm install

# start Metro dev server
npm start

# in another terminal, run on Android emulator / device
npm run android
