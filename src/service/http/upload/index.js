import { Notify } from "vant";
import { code } from "../../../common/code";
import { postFile } from "../http-config";

function url(childRoute) {
  return '/upload' + childRoute
}

function uploadAvatar(fileData) {
  let formData = new FormData()
  formData.append('avatar', fileData)
  return postFile({
    url: url('/avatar')
  }, formData).then(res => {
    console.log(res)
    if (res.code.value == code.default.success.value) {
      return res.data
    } else {
      Notify(res.code)
    }
  })
}

function uploadBackImage(fileData) {
  let formData = new FormData()
  formData.append('backImage', fileData)
  return postFile({
    url: url('/back-image')
  }, formData).then(res => {
    console.log(res)
    if (res.code.value == code.default.success.value) {
      return res.data
    } else {
      Notify(res.code)
    }
  })
}


export {
  uploadAvatar,
  uploadBackImage
}