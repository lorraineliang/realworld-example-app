<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">Lorraine Blog</h1>
        <p>欢迎光临！！！热烈欢迎！！！</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'your_feed' }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed',
                    },
                  }"
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'global_feed' }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed',
                    },
                  }"
                  >Global Feed</nuxt-link
                >
              </li>
              <li class="nav-item" v-if="tag">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'tag' }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed',
                      tag: tag,
                    },
                  }"
                  >#{{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                  class="author"
                  >{{ article.author.username }}
                </nuxt-link>
                <span class="date">{{
                  article.createdAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                @click="isFavorite(article)"
                :class="{ active: article.favorited }"
                :disabled="article.isDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  id: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span @click="toArticleDetail(article.slug)">Read more...</span>
            </nuxt-link>
          </div>
          <!-- 分页器 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ active: item === page }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag: $route.query.tag,
                      tab: tab,
                    },
                  }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    tag: item,
                    tab: 'tag',
                  },
                }"
                class="tag-pill tag-default"
                v-for="(item, index) in tags"
                :key="index"
                >{{ item }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getArticles, getFeedArticles, addFavorite, unfavorite } from '@/api/articles.js'
import { getTags } from '@/api/tag.js'
import { mapState } from 'vuex'
export default {
  name:'homeIndex',
  async asyncData({ query, store }) {
    const limit = 10
    const page = +(query.page || 1)
    const { tag,tab = 'global_feed' } = query
    //串行 耗时
    //全局文章
    // const { data } = await getArticles({
    //   limit,
    //   offset:(page - 1)*limit
    // })
    // //文章标签
    // const { data:tagsData } = await getTags()
    //并行 提高性能
    const loadArticles = store.state.user && tab === 'your_feed' ? getFeedArticles : getArticles
    const [articlesRes, tagsRes] = await Promise.all([
      loadArticles({
        limit,
        offset:(page - 1)*limit,
        tag
      }),
      getTags()
    ])
    const { articles, articlesCount } = articlesRes.data
    const { tags } = tagsRes.data
    articles.forEach(item => item.isDisabled = false)
    return {
      articles,
      articlesCount,
      limit,
      page,
      tags,
      tag,
      tab
    }
  },
  watchQuery:['page','tag','tab'],//监听URL参数变化刷新组件 执行asyncData
  computed:{
    ...mapState(['user']),
    totalPage(){
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async isFavorite (article) {
      //个人感觉这里用fetch代替asyncData更好，可以在取消点赞或者点赞后重新调用方法获取服务中的数据
      article.isDisabled = true
      if(article.favorited){
        await unfavorite(article.slug)
        article.favorited = false
        article.favoritesCount --
      }else{
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount ++
      }
      article.isDisabled = false
    },
    toArticleDetail(slug){
      this.$router.push({
        name: 'article',
        params: {
          id: slug
        }
      })
    }
  }
}
</script>