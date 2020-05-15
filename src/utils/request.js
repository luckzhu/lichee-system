import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000, // request timeout
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 请求增加时间戳
    config.params = {
      _t: Date.parse(new Date()) / 1000,
      ...config.params
    }
    if (config.method === 'post') {
    //   const data = config.data
    //   for (const i in data) {
    //     if (data[i] === undefined || data[i] === null) {
    //       delete data[i]
    //     } else if (typeof (data[i]) === 'object') {
    //       data[i] = JSON.stringify(data[i])
    //     }
    //   }

      config.data = qs.stringify(config.data)
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 201) {
      Message({
        message: res.data.info || '操作失败',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res)
    } else if (res.code === 401) {
      if (response.config.method === 'post') {
        store.commit('user/SET_LoginDialog', true)
      }
      Message({
        message: '登录超时',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else if (res.code === 403) {
      Message({
        message: '无权限访问数据',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
