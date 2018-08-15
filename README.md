# ocapi-auth

Simple no dependency module, which provide jwt or oauth2 authentication for Salesforce Commerce Cloud (Demandware) OCAPI

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [createJwtToken](#createjwttokenoptions-httpoptions)
  - [startSession](#startsessionoptions-httpoptions)
  - [createOauthToken](#createoauthtokenoptions-httpoptions)
  - [getPayload](#getpayloadjwt)
  - [getHeader](#getheaderjwt)
  - [getSignature](#getsignaturejwt)
- [Examples](#examples)
  - [Refresh JWT token](#refresh-jwt-token)
  - [Create session bridge](#create-session-bridge)
  - [Obtain OAUTH Client Credentials grants](#obtain-oauth-client-credentials-grants)
  - [Obtain OAUTH Business Manager grants](#obtain-oauth-business-manager-grants)

## Installation

`$ npm i ocapi-auth`

## Usage

```javascript
const { createJwtToken } = require('ocapi-auth')
  
const jwt = await createJwtToken({
  hostname: 'test.sandbox.com',
  site: 'SiteGenesis',
  type: 'credentials',
  authorization: 'bG9naW46cGFzc3dvcmQ='
})
```

## API

### createJwtToken(options, httpOptions)

Create and return  JWT token

**options**:
- `raw` - if `true`, will return a response as object in `{header, body}` format (default: `false`)
- `version` - OCAPI version. (default: `18.7`)
- `hostname` - target host for shop API calls without path, e.g `account.demandware.com`.
- `site` - target site
- `type` - type of authorization, can be `credentials`, `guest`, `refresh`, `session`
- `clientId` - OCAPI client Id. If empty - default developer client id will be used
- `authorization` - authorization info
  - for `guest` type - leave it empty
  - for `credentials` type - base64 encode client login:password. Can be with `Basic` keyword or without
  - for `session` type - `dwsid` and `dwsecuretoken` cookie in string format e.g `'dwsid=value;dwsecuretoken_d6=value'`
  - for `refresh`type - JWT token to refresh. Can be with `Bearer` keyword or without

**httpOptions**

- Http options from [http module](https://nodejs.org/api/http.html#http_http_request_options_callback).
Default options for `rejectUnauthorized` is `true` only for production `APP_ENV`

### startSession(options, httpOptions)

Create a session bridge using JWT token. Returns `set-cookie` value from response

Options:
- `raw` - will return a response as object in `{header, body}` format
- `version` - OCAPI version. (default: `18.7`)
- `hostname` - target host for shop API calls without path, e.g `account.demandware.com`.
- `site` - target site
- `authorization` - JWT token to exchange

**httpOptions**

- Http options from [http module](https://nodejs.org/api/http.html#http_http_request_options_callback).
Default options for `rejectUnauthorized` is `true` only for production `APP_ENV`

### createOauthToken(options, httpOptions)

Create a OAUTH token and return response body.Can obtain `Client Credentials` and `Business Manager` user grants

Options:
- `raw` - will return a response as object in `{header, body}` format
- `hostname` - target host for calls without path. If empty, Client Credentials grant will be obtained from `account.demandware.com`
- `authorization` - `User Login:User Password:Client Password` in base64 encoding. If empty, demo values will be used. Can be with `Basic` keyword or without
- `clientId` - OCAPI client Id. If empty - default developer client id will be used

**httpOptions**

- Http options from [http module](https://nodejs.org/api/http.html#http_http_request_options_callback).
Default options for `rejectUnauthorized` is `true` only for production `APP_ENV`

### getPayload(jwt)

Return an object with decoded JWT token payload

- `jwt` - OCAPI jwt token 

### getHeader(jwt)
Return an object with decoded OCAPI JWT token header

- `jwt` - OCAPI jwt token 

### getSignature(jwt)
Return an OCAPI JWT token signature

- `jwt` - OCAPI jwt token

## Examples

### Refresh JWT token

```javascript
const jwt = await createJwtToken({
  type: 'refresh',
  hostname: 'test10.sandbox.com',
  site: 'SiteGenesis',
  clientId: '04ffcb90-121f-4db2-91a1-54cae79da873',
  authorization: 'eyJfdiI6IjEiLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfdiI6IjEiLCJleHAiOjE1MzQzMzI3NDksImlhdCI6MTUzNDMzMDk0OSwiaXNzIjoiYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhIiwic3ViIjoie1wiX3ZcIjpcIjFcIixcImN1c3RvbWVyX2luZm9c1237XCJjdXN0b21lcl9pZFwiOlwiYWI0cU1hNEVXTVhOdG1mTlYzdkpod1MyeUFcIixcImd1ZXN0XCI6dHJ1ZX19In0'
})
console.log(jwt)
//Bearer eyJfdiI6IjEiLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.11.dl8XgldAVo8SGRDrrSAdnbD_tnRnfYwIrohjhsPW78JgTif2kukQqnB74RgKHRx6U5CTBee8ktTVwqnmtguRTwnI1NbYsMyf3pCjz67qrqB6NMoNOscFQpcCpgwh0xvlPUqj8j8bBnYTciUues66WeQI38pvTfH4j3oaucbjiNjwkUGCPs_LS_JYaTNhkdqjlRDBcyYo3h8ArKx_5YJK18aynZ00coTdezBKLTzMb7ByQTjiYk7tOi-111-DBFFb11jtaxaA-LwzP8XZrXJ6c_lBPysEJ_y7GwuPU3HuE
```
### Create session bridge

```javascript
const session = await startSession({
  hostname: 'test10.sandbox.com',
  site: 'SiteGenesis',
  authorization: 'eyJfdiI6IjEiLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.11.dl8XgldAVo8SGRDrrSAdnbD_tnRnfYwIrohjhsPW78JgTif2kukQqnB74RgKHRx6U5CTBee8ktTVwqnmtguRTwnI1NbYsMyf3pCjz67qrqB6NMoNOscFQpcCpgwh0xvlPUqj8j8bBnYTciUues66WeQI38pvTfH4j3oaucbjiNjwkUGCPs_LS_JYaTNhkdqjlRDBcyYo3h8ArKx_5YJK18aynZ00coTdezBKLTzMb7ByQTjiYk7tOi-111-DBFFb11jtaxaA-LwzP8XZrXJ6c_lBPysEJ_y7GwuPU3HuE'
})
console.log(session)
/*[ 'dwsecuretoken_d6ba5aaa95d9e677ab103d74c76dc070=7lEE0m7klEXyyP5H5-Ela-9_NTg5JvfQFA==; Version=1; Comment="Demandware Secure Token for site Sites-adidas-GB-Site"; Path=/; Secure; HttpOnly',
  'dwsid=hxx0vh8XPy7sbyGezjyvGhwkgew84x30r-TKPJtP_m1AUKmVswzkBS31flmUlwC1U7meiMxpCby4I8hYR1CXZw==; Path=/; HttpOnly',
  '__cq_dnt=0; Path=/',
  'dw_dnt=0; Path=/',
  'dwanonymous_d6ba5aaa95d9e677ab103d74c76dc070=ac3MRVWXuTV1eapHtdKXuQL3Bt; Version=1; Comment="Demandware anonymous cookie for site Sites-adidas-GB-Site"; Max-Age=15552000; Expires=Mon, 11-Feb-2019 12:03:23 GMT; Path=/' ] */

```
### Obtain OAUTH Client Credentials grants

```javascript
const oauth = await createOauthToken()
console.log(oauth)
//{"access_token":"903648f4-3c6b-45ee-9655-f8742f0a538e","scope":"mail","token_type":"Bearer","expires_in":1799}
```
### Obtain OAUTH Business Manager grants

```javascript
const oauth = await createOauthToken({
  hostname: 'test10.sandbox.com',
  clientId: '04ffcb90-121f-4db2-91a1-54cae79da873',
  authorization: 'dGVzdDp0ZXN0OnRlc3Q='
})
console.log(oauth)
//{"access_token":"781d451f-0162-4457-a378-6b265038f6be","expires_in":899,"token_type":"Bearer"}
```
