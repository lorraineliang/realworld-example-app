<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ urlUsername }}</h4>
            <p>{{ profile.bio }}</p>
            <template v-if="user.username === urlUsername">
              <button
                class="btn btn-sm btn-outline-secondary action-btn"
                @click="editProfile"
              >
                <i class="ion-plus-round"></i>
                &nbsp; Edit Profile Settings
              </button>
            </template>
            <template v-else>
              <button
                class="btn btn-sm btn-outline-secondary action-btn"
                :class="{ active: profile.following }"
                @click="followAuthor(profile.following, profile.username)"
              >
                <i class="ion-plus-round"></i>
                &nbsp;{{ profile.following ? "" : "Not" }} Follow
                {{ urlUsername }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'myArticle' }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'myArticle',
                    },
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'favorites' }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favorites',
                    },
                  }"
                  >Favorited Articles</nuxt-link
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
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                  class="author"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{
                  article.createdAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                @click="isFavorite(article)"
                :class="{ active: article.favorited }"
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
              <ul class="tag-list">
                <li
                  class="tag-default tag-pill tag-outline"
                  v-for="(tag, index) in article.tagList"
                  :key="index"
                >
                  {{ tag }}
                </li>
              </ul>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getProfile } from '@/api/user'
import { getArticles, unfollowUser, followUser, unfavorite, addFavorite} from '@/api/articles'
import { mapState } from 'vuex'
export default {
  middleware: 'authenticated',
  name:'profile',
  data(){
    return {
      // urlUsername: '',
      // profile: {},
      // articles: []
    }
  },
  computed:{
    ...mapState(['user']),
  },
  async asyncData({ params,query }) {
    const urlUsername = params.username
   
    let requestParams = {
      author: urlUsername,
      limit: 5,
      offset: 0,
      favorited: urlUsername
    }
    const { tab = 'myArticle' } = query
    if(tab === 'favorites'){
      delete requestParams.author
    }else {
      delete requestParams.favorited
    }

    const [ proFileRes , articleRes] = await Promise.all([getProfile(urlUsername),getArticles(requestParams)])
    const { articles } = articleRes.data
    const { profile } = proFileRes.data
    return {
      urlUsername,
      profile,
      articles,
      tab
    }
  },
  // async fetch({ params,query }) {
    // this.urlUsername = params.username
    // const { data } = await getProfile(this.urlUsername)
    // this.profile = data.profile
    // const { tag, tab = '' } = query
    // let requestParams = {
    //   author: this.urlUsername,
    //   limit: 5,
    //   offset: 0,
    //   favorited: tag
    // }
    // if(tag){
    //   delete requestParams.author
    // }
    // const { data: articles } = await getArticles(requestParams)
    // this.articles = articles.articles
    // console.log(this.articles)
  // },
  // watch: {
  //   '$route.params': '$fetch',
  //   '$route.query': '$fetch'
  // },
  watchQuery:['tab'],
  methods: {
    editProfile() {
      this.$router.push({
        name:'settings'
      })
    },
    async followAuthor(following, username){
      if(following){
        await unfollowUser(username)
        this.profile.following = false
      }else{
        await followUser(username)
        this.profile.following = true
      }
    },
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