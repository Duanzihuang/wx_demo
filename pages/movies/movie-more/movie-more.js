// pages/movies/movie-more/movie-more.js
import getData from '../../../utils/request.js'
const globalData = getApp().globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.type = options.type

    const url = `${globalData.api_host}getMovieListByType?type=${options.type}&start=0&count=20` 
    console.log(url)
    // console.log(getData)
    getData(url).then(res=>{
      console.log(res.data.subjects)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let typeName = ""
    switch (this.data.type){
      case "in_theaters":
        typeName="正在热映"
        break
      case "coming_soon":
        typeName = "即将上映"
        break
      case "top250":
        typeName = "Top250"
        break
    }

    wx.setNavigationBarTitle({
      title: typeName,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})