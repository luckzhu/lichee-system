import request from '@/utils/request'

// 查询自己的数据列表 year
export function queryMyAreaData(params) {
  return request({
    url: '/areaData/queryMyAreaData',
    method: 'get',
    params
  })
}

// 查询市县级的列表 year
export function queryAreaDataByRegionCode(params) {
  return request({
    url: '/areaData/queryAreaDataByRegionCode',
    method: 'get',
    params
  })
}

// 市县级数据的具体内容 id
export function getAreaDataDetail(params) {
  return request({
    url: '/areaData/getAreaDataDetail',
    method: 'get',
    params
  })
}

// 提交区域数据 breedData info unitData
export function addOrUpdateAreaData(data) {
  return request({
    url: '/areaData/addOrUpdateAreaData',
    method: 'post',
    data
  })
}
