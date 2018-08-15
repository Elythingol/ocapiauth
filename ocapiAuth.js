const call = require('./ocapiCall')
var { stringify } = require('querystring');

const defaultVersion = '18_7'
const defaultcid = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const defaultAuth = 'YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhOmFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYQ=='
const bm = 'urn:demandware:params:oauth:grant-type:client-id:dwsid:dwsecuretoken'

function createHeaders(type, auth, cid) {
  const h = {
    'x-dw-client-id': cid || defaultcid,
  }
  if (type === 'credentials') {
    h.Authorization = auth.indexOf('Basic') === -1 ? `Basic ${auth}` : auth
  } else if (type === 'refresh') {
    h.Authorization = auth.indexOf('Bearer') === -1 ? `Bearer ${auth}` : auth
  } else if (type === 'session') {
    h.Cookie = auth
  }
  return h
}

function createJwtToken({ hostname, site, clientId, version, type, authorization, raw }, ho) {
  const d = JSON.stringify({ type })
  const o = {
    hostname,
    path: `/s/${site}/dw/shop/v${version || defaultVersion}/customers/auth`,
  }
  const h = createHeaders(type, authorization, clientId)
  return call(o, h, ho, d).then(r => {
    return raw ? r : r.headers.authorization
  })
}

function startSession({ hostname, site, version, authorization, raw }, ho) {
  if (!authorization) {
    throw new Error('JWT token missed')
  }
  const o = {
    hostname,
    path: `/s/${site}/dw/shop/v${version || defaultVersion}/sessions`,
  }
  const h = {
    Authorization: authorization.indexOf('Bearer') === -1 ? `Bearer ${authorization}` : authorization
  }
  return call(o, h, ho).then(r => {
    return raw ? r : r.headers['set-cookie']
  })
}

function getPayload(jwt) {
  const h = jwt.replace('Bearer ', '').split('.')[1]
  return JSON.parse(Buffer.from(h, 'base64').toString('utf8'))
}

function getHeader(jwt) {
  const h = jwt.replace('Bearer ', '').split('.')[0]
  return JSON.parse(Buffer.from(h, 'base64').toString('binary'))
}

function getSignature(jwt) {
  return jwt.replace('Bearer ', '').split('.')[2];
}

function createOauthToken({ hostname, clientId, authorization, raw } = {}, ho) {
  const d = stringify({
    'client_id': clientId || defaultcid,
    'grant_type': hostname ? bm : 'client_credentials'
  })
  const a = authorization ? authorization : defaultAuth
  const o = {
    hostname: hostname || 'account.demandware.com',
    path: '/dw/oauth2/access_token'
  }
  const h = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: a.indexOf('Basic') === -1 ? `Basic ${a}` : a
  }
  return call(o, h, ho, d).then(r => {
    return raw ? r : r.body
  })
}

module.exports = {
  createOauthToken,
  createJwtToken,
  startSession,
  getPayload,
  getHeader,
  getSignature
}
