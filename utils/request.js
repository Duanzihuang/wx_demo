/** 
async function getData(url,method="GET"){
  console.log(url)
  let result = await wx.request({
    url,
    method
  })

  console.log(result)
}

export default getData
*/

export default (url,method="GET") => {
  wx.showLoading({
    title: '数据加载中...',
  })
  return new Promise((success, fail)=>{
    wx.request({
      url,
      method,
      success:(res)=>{
        wx.hideLoading()
        success(res)
      },
      fail
    })
  })
}

const requestMore = (url, method = "GET")=>{
  return new Promise((success, fail) => {
    wx.request({
      url,
      method,
      success: success,
      fail
    })
  })
}
 
export { requestMore }