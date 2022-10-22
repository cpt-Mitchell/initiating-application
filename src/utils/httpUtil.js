import axios from 'axios'
import * as DingTalkApi from 'dingtalk-jsapi'
import { API } from '@/api'
import vuet from '@/vuet'

const fetch = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '',
  timeOut: 5000
  // onUploadProgress: p=> {
  //     console.log(p)
  //     if (progressEvent.lengthComputable){
  //         return Math.round((p.loaded * 100) / p.total)
  //     }
  // }
})
fetch.interceptors.request.use(
  config => {
    // if (config.url !== API.DINGTALK_USERID) {
    //   config.headers.common['Authorization'] = vuet.modules.home.token || vuet.modules.home._LOGINUSER_.token
    // }
    config.headers.common['Authorization'] =
      'eyJhbGciOiJSUzI1NiJ9.eyJ1c2VySWQiOiJBMjAyNDk0IiwidXNlcm5hbWUiOiLpu47mmIznm5siLCJleHAiOjE2Nzk5MTkyNzZ9.ehkb0X9nSVmPxbpmQooUTCWY7VqY_6-K-I6t8jYx60tv85h3qVfMnseCeaazcCwt-Jxk9zBVegP3bFmNoO5HKQ4nafuJZaBOFdgjph_nm7GqS-VrkYbM1d1abGHoTJbLZxJT-2Mho6ZZ5Wp6KqtAlixkBZkCb76m_R3bmiddxc0'
    // config.headers.common['Authorization'] =
    //   'eyJhbGciOiJSUzI1NiJ9.eyJ1c2VySWQiOiJBMjAyNDc0IiwidXNlcm5hbWUiOiLmnY7ojaPlvrciLCJleHAiOjE2NjUxODAzODl9.SvQMkb2pdo8GEcWmmkyxOjAkrJkHh2AZcoo3S4dwiRjaDFpSreaj8DAEZWT0XOUncl3Bx74i4XZBi8brIVODDJOzIMPHdfyBL5iU2w_495il9v1R3FAPMfXPoEAWnvbV_W4n2xujUaJfL3bxoDF8YnTe4hHgSsjLlS6S0V7seeQ'
    return config
  },
  error => {}
)

fetch.interceptors.response.use(
  res => {
    return res
  },
  error => {
    if (error.response) {
      let errMsg = (error.response && error.response.data && error.response.data.msg) || ''
      switch (error.response.status) {
        case 500:
          errMsg = errMsg || '系统异常: errorCode = 500'
          break
        case 503:
          errMsg = errMsg || '系统异常: 503,后台服务未启动'
          break
        case 400:
          errMsg = errMsg || '提交参数异常'
          break
        case 401:
          errMsg = '登录失效，将重新获取用户信息'
          DingTalkApi.util.domainStorage.removeItem({ name: 'loginuser' })
          break
        case 404:
          errMsg = errMsg || '访问接口不存在'
          break
      }
      if (error.response.status === 401) {
        window.location.reload()
      } else if (errMsg) {
        dd.device.notification.alert({
          message: (error.response.data ? error.response.data.msg : '') || errMsg || '',
          title: '系统提示',
          buttonName: '确定',
          onSuccess: function() {}
        })
      }
    }
    return Promise.reject(error.response)
  }
)
export default fetch
