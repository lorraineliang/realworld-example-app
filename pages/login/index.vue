<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
          <p class="text-xs-center">
            <!-- <a href="">Have an account?</a> -->
            <nuxt-link v-if="isLogin" to="/register"
              >Need an account?</nuxt-link
            >
            <nuxt-link v-else to="/login">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>

          <form>
            <fieldset class="form-group" v-if="!isLogin">
              <input
                v-model="user.name"
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="user.email"
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="user.password"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                required
                min="8"
              />
            </fieldset>
            <button
              class="btn btn-lg btn-primary pull-xs-right"
              @click.prevent="onSubmit"
            >
              {{ isLogin ? "Sign in" : "Sign up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { login, register } from '@/api/user'
import { mapMutations } from 'vuex'
//仅在客户端加载js-cookie
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  middleware: 'notAuthenticated',
  name:'login',
  data(){
    return {
      user:{
        name:'',
        email:'',
        password:''
      },
      errors:{}
    }
  },
  computed:{
    isLogin(){
      return this.$route.name === 'login'
    }
  },
  methods:{
    ...mapMutations({
      setUser:'setUser'
    }),
    async onSubmit(){
      try {
        //提交表单请求登录 
        const { data } = this.isLogin ? await login({
          user:this.user
        }) : await register({
          user:this.user
        })
        console.log(data);
        //保存用户登录状态
        this.setUser(data.user)

        //为了防止页面刷新后数据丢失，需要把数据持久化
        Cookie.set('user',data.user)

        //跳转到首页
        this.$router.push('/')
      } catch(err){
        this.errors = err.response.data.errors
      }
    }
  }
}
</script>