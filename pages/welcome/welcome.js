Page({
    onTap: function (event) {
        // wx.navigateTo({
        //     url:"../posts/post"
        // });
        
        wx.redirectTo({
          url: '/pages/posts/post'
          // url: '../posts/post',
        })
    }
})