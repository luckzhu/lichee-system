import request from '@/utils/request'

// 获取企业下有多少个周报要填 unitId 企业id，不传就是获取自己的
export function queryIssueByUnitId(params) {
  return request({
    url: '/task/queryIssueByUnitId',
    method: 'get',
    params
  })
}

// 获取基地下有多少个周报要填 unitId 企业id，不传就是获取自己的
export function queryIssueByBaseId(params) {
  return request({
    url: '/task/queryIssueByBaseId',
    method: 'get',
    params
  })
}

// 获填写周报 id data 用json list格式 [{"biId":"65015","name":"桂味","bId":"101","d1":"1.2","d2":"1","d3":"3"}]
export function addOrUpdateBaseData(data) {
  return request({
    url: '/task/addOrUpdateBaseData',
    method: 'post',
    data
  })
}

// 获取当期周报数据 id
export function getBaseDataByIssueId(params) {
  return request({
    url: '/task/getBaseDataByIssueId',
    method: 'get',
    params
  })
}
