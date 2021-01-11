// manager/approvalRouting/approvalRouting.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roles1: [
      {value: '1', name: '部门领导',checked:false},
      {value: '2', name: '综合办主任',checked:false},
      {value: '3', name: '物资部主任',checked:false},
      {value: '4', name: '分部分管领导',checked:false},
      {value: '5', name: '分部主要负责人',checked:false},
    ],
    roles2: [
      {value: '1', name: '部门领导',checked:false},
      {value: '2', name: '综合办主任',checked:false},
      {value: '3', name: '物资部主任',checked:false},
      {value: '4', name: '分部分管领导',checked:false},
      {value: '5', name: '分部主要负责人',checked:false},
    ],
    roles3: [
      {value: '1', name: '部门领导',checked:false},
      {value: '2', name: '综合办主任',checked:false},
      {value: '3', name: '物资部主任',checked:false},
      {value: '4', name: '分部分管领导',checked:false},
      {value: '5', name: '分部主要负责人',checked:false},
    ],
    roles4: [
      {value: '0', name: '部门综合员',checked:false},
      {value: '1', name: '部门领导',checked:false},
      {value: '2', name: '综合办主任',checked:false},
      {value: '3', name: '物资部主任',checked:false},
      {value: '4', name: '分部分管领导',checked:false},
      {value: '5', name: '分部主要负责人',checked:false},
      {value: '6', name: '综合办综合员（系统admin）',checked:false}
    ],
    routStr1:'',
    routStr2:'',
    routStr3:'',
    routStr4:'',
    disabled:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    const _ = db.command;

    const roles1 = this.data.roles1;
    const roles2 = this.data.roles2;
    const roles3 = this.data.roles3;
    const roles4 = this.data.roles4;
    db.collection('zh_approval_routing').orderBy('order', 'asc').get().then(res => {
      var appr_setting1=res.data[0].appr_setting;
      var appr_setting2=res.data[1].appr_setting;
      var appr_setting3=res.data[2].appr_setting;
      var appr_setting4=res.data[3].appr_setting;

      for (let i = 0; i<roles1.length; i++) {
        for (let j = 0;j < appr_setting1.length; j++) {
          if (roles1[i].value === appr_setting1[j]) {
            roles1[i].checked = true
            break
          }   
        }
      }

      for (let i = 0; i<roles2.length; i++) {
        for (let j = 0;j < appr_setting2.length; j++) {
          if (roles2[i].value === appr_setting2[j]) {
            roles2[i].checked = true
            break
          }   
        }
      }

      for (let i = 0; i<roles3.length; i++) {
        for (let j = 0;j < appr_setting3.length; j++) {
          if (roles3[i].value === appr_setting3[j]) {
            roles3[i].checked = true
            break
          }   
        }
      }

      for (let i = 0; i<roles4.length; i++) {
        for (let j = 0;j < appr_setting4.length; j++) {
          if (roles4[i].value === appr_setting4[j]) {
            roles4[i].checked = true
            break
          }   
        }
      }
      this.setData({
        roles1,
        roles2,
        roles3,
        roles4
      })  
    })
  },
  checkboxChange1(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      routStr1:e.detail.value.sort()
    })
  },
  checkboxChange2(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      routStr2:e.detail.value.sort()
    })
  },
  checkboxChange3(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      routStr3:e.detail.value.sort()
    })
  },
  checkboxChange4(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value.sort())
    this.setData({
      routStr4:e.detail.value.sort()
    })
  },

  save1:function(){
    var that=this;
    that.updateRouting('1',this.data.routStr1);
  },
  save2:function(){
    var that=this;
    that.updateRouting('2',this.data.routStr2);
  },
  save3:function(){
    var that=this;
    that.updateRouting('3',this.data.routStr3);
  },
  save4:function(){
    var that=this;
    that.updateRouting('4',this.data.routStr4);
  },
  updateRouting: function(type,value) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否保存修改？',
      success(res) {
        if (res.confirm) {
          that.setData({
            disabled:true
          });
          wx.showLoading({
            title: '保存中...',
          })

          wx.cloud.callFunction({
            name: 'approvalRoutset',
            data: {
              type: type,
              appr_setting: value
            },
            success: res => {
              wx.hideLoading();
              that.setData({
                disabled:false
              });
              wx.showModal({
                title: '保存成功',
                content: '是否继续更改？',
                success (res) {
                  if (res.confirm) {   
                    console.log("ok"); 
                  } else if (res.cancel) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
              })
            },
            fail: err => {
              // handle error
              console.log(err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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