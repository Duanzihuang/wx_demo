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
  return new Promise((success, fail)=>{
    wx.request({
      url,
      method,
      success,
      fail
    })
  })
}