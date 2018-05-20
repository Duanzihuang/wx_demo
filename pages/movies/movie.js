// pages/movies/movie.js
const globalData = getApp().globalData
import {requestMore} from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowSearch:false, //是否显示搜索
    isShowContent:true, //是否显示列表内容
    keyword:null,//搜索关键字
    movieList:[], //搜索出来的电影数组
    hasMore: true,
    pageIndex: 1, //页码
    pageCount: 20,//页容量
    isPullDown: false, //是否下拉刷新
    total: 0,
    beginSearch:false
  },

  onSearchFocus(){
    this.setData({
      isShowSearch:true,
      isShowContent:false
    })
  },

  //搜索
  search(e){
    if(e.detail.value.trim().length==0){
      wx.showToast({
        title:"请输入要搜索的内容",
        icon:"none"
      })

      return
    }

    this.setData({
      keyword: e.detail.value
    })

    this.setData({
      beginSearch:true
    })

    //搜索
    this.loadMoreMovieListByKeyWord()
  },

  //通过关键字加载更多电影列表
  loadMoreMovieListByKeyWord(){
    const start = (this.data.pageIndex - 1) * this.data.pageCount

    if (start > this.data.total) {
      this.setData({
        hasMore: false
      })
      return
    }

    if (this.data.keyword == null || this.data.keyword.trim().length == 0) {
      wx.showToast({
        title: "请输入要搜索的内容",
        icon: "none"
      })

      return
    }

    const url = `${globalData.api_host}getMovieListByKeyword?keyword=${this.data.keyword}&start=${start}&count=${this.data.pageCount}`

    requestMore(url).then(res => {
      console.log(res.data)
      this.setData({
        total: res.data.total
      })
      this.processSearchMovieListData(res.data.subjects)
    })
  },

  //处理豆瓣电影列表数据
  processSearchMovieListData(movies) {
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

    if (this.data.isPullDown) {//下拉刷新
      lastMovieList = tempMovieList
    } else {
      lastMovieList = this.data.movieList.concat(tempMovieList)
    }
    // console.log(lastMovieList)
    this.setData({
      movieList: lastMovieList
    })
  },

  closeSearch(){
    this.setData({
      isShowSearch: false,
      isShowContent: true,
      keyword:null,
      movieList: []
    })
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
    if (!this.data.isShowSearch) return

    this.setData({
      pageIndex: 1,
      hasMore: true,
      isPullDown: true
    })

    this.loadMoreMovieListByKeyWord()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {   
    if (!this.data.isShowSearch) return

    if (!this.data.hasMore) return

    this.setData({
      pageIndex: this.data.pageIndex + 1,
      isPullDown: false
    })

    this.loadMoreMovieListByKeyWord()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})