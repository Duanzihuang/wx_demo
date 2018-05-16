// pages/movies/movie.js
const globalData = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieListByType("in_theaters","正在热映")
    this.getMovieListByType("coming_soon", "即将上映")
    this.getMovieListByType("top250","Top250")
  },

  getMovieListByType(type,typeName){
    const url = `${globalData.api_host}getMovieListByType?type=${type}&start=0&count=3`

    wx.showLoading({
      title: '数据加载中...',
      mask:true
    })
    wx.request({
      url,
      // header: {
      //   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36', // 默认值
      //   'Referer':'https://www.douban.com/'
      // },
      success:(res)=>{
        this.processMovieListData(res.data.subjects, type, typeName)
        wx.hideLoading()
      }
    })
  },

  //处理豆瓣电影列表数据
  processMovieListData(movies, type, typeName){
    const tempMovieList = []
    movies.forEach(item=>{
        const tempMovie = {}
        tempMovie.title = item.title
        tempMovie.average = item.rating.average
        tempMovie.imgUrl = item.images.small
        tempMovie.movieId = item.id

        tempMovieList.push(tempMovie)
    })

    const tempObj = {}

    //{in_theaters:[{},{},{}]}
    tempObj[type] = {
      type,
      typeName,
      movies: tempMovieList
    }

    this.setData(tempObj)

    console.log(this.data)
  },

  onMoreTap(event){
    const type = event.currentTarget.dataset.movieType

    wx.navigateTo({
      url: `movie-more/movie-more?type=${type}`,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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