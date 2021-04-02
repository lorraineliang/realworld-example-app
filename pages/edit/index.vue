<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="newArticle.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="newArticle.description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="newArticle.body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="newArticle.tags"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="publishArticle"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import html2markdown from 'html2markdown'
import { createArticle, updateArticle } from "@/api/articles.js"
import { mapState } from 'vuex'
export default {
  middleware: "authenticated",
  name: "edit",
  data() {
    return {
      newArticle: {
        title: '',
        description: '',
        body: '',
        tags:''
      },
      articleDetail: {},
    }
  },
  computed:{
    ...mapState(['article']),
    isEdit(){
      if(this.$route.query.slug){
        return false
      }
      return true
    }
  },
  methods: {
    async publishArticle() {
      const params = {
        article:{
          ...this.newArticle,
          tagList:this.newArticle.tags?[this.newArticle.tags]:[]
        }
      }
      const { data } = this.isEdit ? await updateArticle(this.article.slug,params) : await createArticle(params)
      this.articleDetail = data.article
      this.$router.push(('/article/'+ this.articleDetail.slug))
    },
  },
  mounted() {
    if(this.isEdit){
      const { title ,description,body,tagList } = this.article
      this.newArticle = {
        title,
        description,
        body: html2markdown(body),
        tags: tagList && tagList.join()
      }
    }
  },
}
</script>