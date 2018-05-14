import postList from '../../../data/posts-data.js'

const globalData = getApp().globalData

// pages/posts/post-detail/post-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCollection:false, //是否收藏，默认false
    isPlayingMusic:false,//是否播放音乐
    postId:null
  },

  onColletionTap(){
    //去获取本地中，该postId的收藏状态
    const collectionInfo = wx.getStorageSync("collectionInfo")
    let isCollection = collectionInfo[this.data.postId]

    //取反
    isCollection = !isCollection

    //把结果保存到本地
    collectionInfo[this.data.postId] = isCollection
    wx.setStorageSync("collectionInfo", collectionInfo)

    //更新视图的值
    this.setData({
      isCollection
    })

    wx.showToast({
      title: isCollection ? '收藏成功':'取消收藏成功',
    })

  },

  onShareTap(){
    const itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ]

    wx.showActionSheet({
      itemList: itemList,
      itemColor:"#405f80",
      success(res){
        wx.showModal({
          title: `用户${itemList[res.tapIndex]}`,
          content: `${res.errMsg}---${res.tapIndex}`,
          confirmColor:"#405f80"
        })
      },
      fail(res){
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const postData = postList.filter(item=>{
      return item.postId == options.postId
    })[0]

    //去本地读取该postId的收藏状态，来显示对应的图片
    let collectionInfo = wx.getStorageSync("collectionInfo")
    if (!collectionInfo){ //不存在
      collectionInfo = {}
      collectionInfo[options.postId] = false
      wx.setStorageSync("collectionInfo", collectionInfo)
    }

    //判断是否显示播放还是暂停音乐
    if (globalData.g_isPlayingMusic && globalData.g_postId === options.postId){
      this.setData({
        isPlayingMusic: true
      })
    }

    this.setData({
      postData,
      postId: options.postId,
      isCollection: collectionInfo[options.postId]
    })

    wx.onBackgroundAudioPlay(()=>{
      if (globalData.g_postId===options.postId){
        this.setData({
          isPlayingMusic: true
        })

        globalData.g_isPlayingMusic = true
        globalData.g_postId = options.postId
      }
    })

    wx.onBackgroundAudioPause(()=>{
      if (globalData.g_postId === options.postId) {
        this.setData({
          isPlayingMusic: false
        })

        globalData.g_isPlayingMusic = false
        globalData.g_postId = options.postId
      }
    })
  },

  playOrPause(){
    //获取对应的音乐数据
    const music = this.data.postData.music

    if (this.data.isPlayingMusic){//正在播放则暂停播放
      wx.pauseBackgroundAudio()

      this.setData({
        isPlayingMusic:false
      })

      globalData.g_isPlayingMusic = false
      globalData.g_postId = null
    }else{//没有播放，则开始播放
      wx.playBackgroundAudio({
        dataUrl: music.url,
        title:music.title,
        coverImgUrl: music.coverImg
      })

      globalData.g_isPlayingMusic = true
      globalData.g_postId = this.data.postId

      this.setData({
        isPlayingMusic: true
      })
    }

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