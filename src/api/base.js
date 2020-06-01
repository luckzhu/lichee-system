import request from '@/utils/request'

// name 企业字号
// regionCode 地区编码
// address 基地详细地址
// scale 基地面积
// yield 预计产量
// coldScale 冷库容积
// coldCar 冷链车
// levelDevice 分级设备
// packDevice 打包设备
// arrestPoint 快递驻点
// exportFile 出口备案
// data 5个品种的信息 [{"bId":101,"scale":12,"yield":13}]

export function addBase(data) {
  return request({
    url: '/base/addBaseInfo',
    method: 'POST',
    data
  })
}

// 获取该企业的基地列表，不传就是获取自己的
export function queryBase(params) {
  return request({
    url: '/base/queryBaseByUnitId',
    method: 'get',
    params
  })
}

// 获取该地区的基地列表，不传就是获取自己地区的
export function queryBaseByRegionCode(params) {
  return request({
    url: '/base/queryBaseByRegionCode',
    method: 'get',
    params
  })
}

// 审核基地 id state
export function validBase(data) {
  return request({
    url: '/base/validBase',
    method: 'post',
    data
  })
}
// 生成基地账号 基地id
export function generateBaseAccount(data) {
  return request({
    url: '/base/generateBaseAccount',
    method: 'post',
    data
  })
}
// 获取合同
export function queryContract(params) {
  return request({
    url: '/base/queryContract',
    method: 'get',
    params
  })
}

// 新增合同 BId bId baseId contractFile price purchase weight
export function addContract(data) {
  return request({
    url: '/base/addContract',
    method: 'post',
    data
  })
}
// 删除合同 合同id
export function delContract(data) {
  return request({
    url: '/base/delContract',
    method: 'post',
    data
  })
}
// 获取品牌标识 unitId 企业Id，没有就是获取自身
export function queryIdentification(params) {
  return request({
    url: '/base/queryIdentification',
    method: 'get',
    params
  })
}
// 新增品牌标识
export function addIdentification(data) {
  return request({
    url: '/base/addIdentification',
    method: 'post',
    data
  })
}
// 作废品牌标识 品牌标识id
export function cancelIdentification(data) {
  return request({
    url: '/base/cancelIdentification',
    method: 'post',
    data
  })
}
