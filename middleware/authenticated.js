/* 
校验是否登录状态的中间件
*/
export default function ({store , redirect}) {
  if (!store.state.user) {
    return redirect('/login')
  }
}