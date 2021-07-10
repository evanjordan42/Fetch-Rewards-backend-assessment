# Fetch-Tech-Assessment
Backend technical assessment for Fetch

## To use:
1. Run `npm install`
2. Run `npm start`

The server will run on localhost:3000

## Endpoints:

### POST `/transaction`
#### Query parameters:
* payer: `string`
* points: `integer`
* timestamp: `string`

### POST `/spend`
#### Query parameters:
* points: `integer`

### GET `/balances`
