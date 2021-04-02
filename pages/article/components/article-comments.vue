<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="newComment"
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" @click="postComent">
          Post Comment
        </button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name: '/profile',
            params: {
              username: comment.author.username,
            },
          }"
          class="comment-author"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <a href="" class="comment-author">{{ comment.author.username }}</a>
        <span class="date-posted">{{
          comment.updatedAt | date("MMM DD, YYYY")
        }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getComments, postComment } from '@/api/articles.js'
export default {
  name:'article-comments',
  props:['article'],
  data(){
    return {
      comments:[],
      newComment:''
    }
  },
  computed:{
    ...mapState(['user'])
  },
  async mounted(){
    await this.getComments()
  },
  methods: {
    async getComments(){
      const { data } = await getComments(this.article.slug)
      this.comments = data.comments
    },
    async postComent(){
      const { data } = await postComment(this.article.slug,{
        "comment": {
          "body": this.newComment
        }
      })
      await this.getComments()
    }
  }
}
</script>