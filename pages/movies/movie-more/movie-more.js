// pages/movies/movie-more/movie-more.js
// import getData from '../../../utils/request.js'
import { requestMore } from '../../../utils/request.js'
const globalData = getApp().globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:null,
    movieList:[],
    hasMore:true,
    pageIndex:1, //页码
    pageCount:20,//页容量
    isPullDown:false, //是否下拉刷新
    total:0
  },

  onReachBottom(){
    if(!this.data.hasMore) return

    this.setData({
      pageIndex:this.data.pageIndex+1,
      isPullDown: false
    })

    this.loadMovieListByType()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.type = options.type

    this.loadMovieListByType()
  },

  loadMovieListByType(){
    const start = (this.data.pageIndex - 1) * this.data.pageCount

    if(start > this.data.total){
      this.setData({
        hasMore:false
      })
      return
    }

    const url = `${globalData.api_host}getMovieListByType?type=${this.data.type}&start=${start}&count=${this.data.pageCount}`
    // console.log(url)

    requestMore(url).then(res => {
      // console.log(res.data)
      this.setData({
        total: res.data.total
      })
      this.processMovieListData(res.data.subjects)
    })
  },

  //处理豆瓣电影列表数据
  processMovieListData(movies) {
    const tempMovieList = []
    movies.forEach(item => {
      const tempMovie = {}
      tempMovie.title = item.title
      tempMovie.average = item.rating.average
      tempMovie.imgUrl = item.images.small
      tempMovie.movieId = item.id

      tempMovieList.push(tempMovie)
    })

    let lastMovieList = []

    if(this.data.isPullDown){//下拉刷新
      lastMovieList = tempMovieList
    }else{
      lastMovieList = this.data.movieList.concat(tempMovieList)
    }

    this.setData({
      movieList: lastMovieList
    })

    wx.stopPullDownRefresh()
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
    this.setData({
      pageIndex:1,
      hasMore:true,
      isPullDown:true
    })

    this.loadMovieListByType()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})