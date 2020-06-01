import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(params) {
  return request({
    url: '/user/getMyInfo',
    method: 'get',
    params
  })
}
// 荔枝系统省级 440 abcd1234
export function queryUnit(params) {
  return request({
    url: 'user/queryUnit',
    method: 'get',
    params
  })
}
// 审核企业信息 userId state
export function validUnit(data) {
  return request({
    url: '/user/validUnit',
    method: 'post',
    data
  })
}

// 获取单位类型,角色列表
export function queryRoles(params) {
  return request({
    url: '/auth/queryRoles',
    method: 'get',
    params
  })
}

// 注册register
export function register(data) {
  return request({
    url: '/auth/sign',
    method: 'post',
    data
  })
}

// 检查账号是否已存在 account 账号
export function checkAccount(params) {
  return request({
    url: '/auth/checkAccount',
    method: 'get',
    params
  })
}

// 检查信用代码有没有存在，再检查有没有在已入库那里 orgCode
export function checkOrgCode(params) {
  return request({
    url: '/auth/checkOrgCode',
    method: 'get',
    params
  })
}

// 获取手机短信验证码
export function getMsg(params) {
  return request({
    url: '/auth/getMsg',
    method: 'get',
    params
  })
}

// 手机短信验证码登录
export function phoneLogin(data) {
  return request({
    url: '/auth/phoneLogin',
    method: 'post',
    data
  })
}

// 同步名牌账号 account  contactName contactPhone
export function syncAccount(data) {
  return request({
    url: '/auth/syncAccount',
    method: 'post',
    data
  })
}
