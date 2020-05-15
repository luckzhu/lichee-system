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
