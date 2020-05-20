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
