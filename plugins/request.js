
/* 
基于axios的封装请求
*/

import axios from 'axios'

export const request = axios.create({
  baseURL:'https://conduit.productionready.io'
})

//通过插件机制获取到上下文对象(query\params\req\res\app\store)
//插件导出函数必须作为 default 成员
export default ({ store }) => {
  /* 
  请求拦截器
  任何请求都要经过请求拦截器
  我们可以在请求拦截器中做一些业务处理，如统一设置token 
  */
  
  request.interceptors.request.use((config) => {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
    return config
  }, (error) => {
    //如果请求还未发出去就失败了，会走到这里
    return Promise.reject(error)
  })

}

//响应拦截器