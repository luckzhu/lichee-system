import request from '@/utils/request'

// 获取品种列表
export function queryBreed(params) {
  return request({
    url: '/normal/queryBreed',
    method: 'GET',
    params
  })
}
// 获取市县列表 type 1市 2县
export function queryRegion(params) {
  return request({
    url: '/normal/queryRegion',
    method: 'GET',
    params
  })
}
