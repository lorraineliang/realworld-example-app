<template>
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
      >
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
    </div>
    <template v-if="article.author.username === user.username">
      <!-- 修改文章 -->
      <button
        class="btn btn-outline-secondary btn-sm"
        :class="{ active: article.author.following }"
        @click="updateArticle"
      >
        <i class="ion-edit"></i>
        &nbsp; Edit Article
      </button>
      &nbsp;&nbsp;
      <!-- 删除文章 -->
      <button
        class="btn btn-outline-danger btn-sm"
        :class="{ active: article.favorited }"
        @click="delArticle"
      >
        <i class="ion-trash-a"></i>
        &nbsp; Delete Article
      </button>
    </template>
    <template v-else>
      <!-- 关注/取消关注作者 -->
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{ active: article.author.following }"
        @click="followAuthor(article.author.following, article.author.username)"
      >
        <i class="ion-plus-round"></i>
        &nbsp; Follow {{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <!-- 点赞/取消点赞文章 -->
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{ active: article.favorited }"
        @click="addFavorite(article.favorited, article.slug)"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>
<script>
import {addFavorite, unfavorite,followUser, unfollowUser, delArticle} from '@/api/articles'
import { mapState, mapMutations } from 'vuex'
export default {
  name:'article-meta',
  props:['article'],
  computed:{
    ...mapState(['user']),
  },
  methods: {
    ...mapMutations({
      setArticle:'setArticle'
    }),
    updateArticle(){
      this.setArticle(this.article)
      this.$router.push(('/edit/'+ this.article.slug) )
    },
    async delArticle(){
      await delArticle(this.article.slug)
      this.$router.push('/')
    },
    async followAuthor(following, username){
      if(following){
        await unfollowUser(username)
        this.article.author.following = false
      }else{
        await followUser(username)
        this.article.author.following = true
      }
    },
    async addFavorite(favorited, slug){
      if(favorited){
        await unfavorite(slug)
        this.article.favorited = false
        this.article.favoritesCount --
      }else{
        await addFavorite(slug)
        this.article.favorited = true
        this.article.favoritesCount ++
      }
    }
  }
}
</script>