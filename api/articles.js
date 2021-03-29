import { request } from '@/plugins/request'

//获取全局文章列表

export const getArticles = params => {
  return request({
    url: '/api/articles',
    method: 'GET',
    params
  })
}

//获取关注用户的文章列表

export const getFeedArticles = params => {
  return request({
    url: '/api/articles/feed',
    method: 'GET',
    params
  })
}

//点赞文章

export const addFavorite = slug => {
  return request({
    url: `/api/articles/${slug}/favorite`,
    method: 'POST'
  })
}

  //取消点赞文章

export const unfavorite = slug => {
  return request({
    url: `/api/articles/${slug}/favorite`,
    method: 'DELETE'
  })
}

//获取文章详情
export const getArticle = slug => {
  return request({
    url: `/api/articles/${slug}`,
    method: 'GET'
  })
}

//获取文章评论1
export const getComments = slug => {
  return request({
    url: `/api/articles/${slug}/comments`,
    method: 'GET'
  })
}