import { post } from '../http-config'
import { login_code, register_code } from '../../../common/code'
import { Notify } from 'vant'
import { TOKEN_NAME } from '../../../common/config'

function login(data) {
  return post({
    url: '/login'
  }, data).then(res => {
    Notify(res.code)
    if (res.code.value != login_code.success.value) {
      return false
    } else {
      localStorage.setItem(TOKEN_NAME, res.data)
      return true
    }
  })
}

function register(data) {
  return post({
    url: '/register'
  }, data).then(res => {
    console.log(res)
    Notify(res.code)
    if (res.code.value != register_code.success.value) {
      return false
    }
    return true
  })
}

export {
  login,
  register,
}