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

//获取文章评论
export const getComments = slug => {
  return request({
    url: `/api/articles/${slug}/comments`,
    method: 'GET'
  })
}

//发表评论
export const postComment = (slug, data) => {
  return request({
    url: `/api/articles/${slug}/comments`,
    method: 'POST',
    data
  })
}

//发表文章
export const createArticle = data => {
  return request({
    url: '/api/articles',
    method: 'POST',
    data
  })
}

//修改/更新文章
export const updateArticle = (slug, data) => {
  return request({
    url: `/api/articles/${slug}`,
    method: 'PUT',
    data
  })
}

//删除文章
export const delArticle = slug => {
  return request({
    url: `/api/articles/${slug}`,
    method: 'DELETE'
  })
}

//关注作者
export const followUser = username => {
  return request({
    url: `/api/profiles/${username}/follow`,
    method: 'POST'
  })
}

//取消关注作者
export const unfollowUser = username => {
  return request({
    url: `/api/profiles/${username}/follow`,
    method: 'DELETE'
  })
}