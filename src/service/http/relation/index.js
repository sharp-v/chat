import { post } from '../http-config'
import { code } from '../../../common/code'
import { Notify } from 'vant'


function url(childRoute) {
  return '/relation' + childRoute
}

function add(relation) {
  return post({
    url: url('/add')
  }, relation)
}

function confirm(relation) {
  return post({
    url: url('/confirm-add')
  }, relation)
}


function update(relation) {
  return post({
    url: url('/update')
  }, relation).then(res => {
    Notify(res.code)
    if (res.code.value == code.relation.update.success.value) {
      return false
    } else {
      return true
    }
  })
}



export {
  add,
  update,
  confirm,
}