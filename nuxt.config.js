/* 
nuxt.js 配置文件
*/

module.exports = {
  router: {
    linkActiveClass: 'active',
    //自定义路由表规则
    extendRoutes(routes, resolve) {
      routes.splice(0)//清空nuxt自动配置默认路由
      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'pages/layouts/index.vue'),
          children: [
            {
              path: '',//默认子路由
              name: 'home',
              component: resolve(__dirname,'pages/home/')
            }, {
              path: '/login',
              name: 'login',
              component: resolve(__dirname,'pages/login/')
            }, {
              path: '/register',
              name: 'register',
              component: resolve(__dirname,'pages/login/')
            }, {
              path: '/profile/:username',
              name: 'profile',
              component: resolve(__dirname,'pages/profile/')
            }, {
              path: '/settings',
              name: 'settings',
              component: resolve(__dirname, 'pages/setting/')
            }, {
              path: '/edit',
              name: 'edit',
              component: resolve(__dirname, 'pages/edit/')
            }, {
              path: '/article/:id',
              name: 'article',
              component: resolve(__dirname, 'pages/article/')
            }
            
          ]
        }
      ])
    }
  },
  //服务
  server: {
    //host: 'localhost'//本地环境访问 局域网访问
    host: '0.0.0.0',//生产环境 对外访问
    port:3000
  },
  plugins: [
    '~/plugins/request.js',
    '~/plugins/dayjs.js'
  ]
}