<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <div>
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="updateUser.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="updateUser.username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="updateUser.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  v-model="updateUser.email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="updateUser.password"
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                @click="updateSetting"
              >
                Update Settings
              </button>
            </fieldset>
          </div>

          <hr />
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { updatePersonal } from '@/api/user'
import { mapState} from 'vuex'
//仅在客户端加载js-cookie
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  // middleware: 'authenticated',
  name:'setting',
  computed:{
    ...mapState(['user']),
  },
  data(){
    return {
      updateUser: {
        username: '',
        password: '',
        image: '',
        email: '',
        bio: ''
      }
    }
  },
  methods: {
    async updateSetting() {
      console.log(12233);
      const params = {
        user: this.updateUser
      }
      const res = await updatePersonal(params)
      this.$router.push(('/profile/' + this.updateUser.username))
    },
    logout() {
      Cookie.remove('user')
      this.$store.commit('removeUser')
      this.$router.push('/login')
    }
  },
  mounted() {
    if(this.user){
      this.updateUser = {
        ...this.user
      }
    }
  }
}
</script>