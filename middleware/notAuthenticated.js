/* 
如果已经是登录状态，不允许直接在地址栏进入登录注册页
*/
export default function ({store , redirect}) {
  if (store.state.user) {
    return redirect('/')
  }
}