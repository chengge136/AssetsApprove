import * as echarts from '../../ec-canvas/echarts';

var dataNames = [];
var dataQuantity = [];

var k = 0;
var Chart = null;
Page({
	/**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true // 延迟加载
    },
    tabCur: 0, //默认选中
    tabs: [{
        name: '日常办公用品',
        id: 0
      },
      {
        name: '低值易耗品',
        id: 1
      },
      {
        name: '固定资产',
        id: 2
      }

    ]
    
  },
  tabSelect(e) {
    var flag=e.currentTarget.dataset.id;
    this.setData({
      tabCur: e.currentTarget.dataset.id
    })

    if(flag==0){
      //获取办公用品的数据
      dataNames.length = 0;
      dataQuantity.length = 0;

      var sto_bg = wx.getStorageSync('sto_bg');
      for(let i=0;i<sto_bg.length;i++){
        dataNames.push(sto_bg[i].name);
        dataQuantity.push(sto_bg[i].count)
      }
      this.setData({
        dataNames:dataNames,
        dataQuantity:dataQuantity
      })
      this.getData(); //更新数据  
    }else if(flag==1){
      //获取低值易耗品的数据
      dataNames.length = 0;
      dataQuantity.length = 0;
      var sto_dzyh = wx.getStorageSync('sto_dzyh');
      for(let i=0;i<sto_dzyh.length;i++){
        dataNames.push(sto_dzyh[i].name);
        dataQuantity.push(sto_dzyh[i].count)
      }
      this.setData({
        dataNames:dataNames,
        dataQuantity:dataQuantity
      })
      this.getData(); //获取数据
    }else{
      wx.showToast({
        title: '暂无数据',
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.echartsComponnet = this.selectComponent('#mychart');
    this.init_echarts();

    //获取前五的数据，保存到缓存中！
    var date = new Date();
    var begin=new Date(date.getFullYear(),1,1).getTime();
    var end=new Date().getTime();

    wx.showLoading({
      title: '抓取数据中',
    })
    wx.cloud.callFunction({
      name: "getAssetRecords",
      data: {
        begin: begin,
        end: end
      }
     
    }).then(res => {
      var assetsdata=res.result.data;      
      var bginfo = {};
      var dzinfo = {};

       
      for(let i=0;i<assetsdata.length;i++){
        if(assetsdata[i].assettype=='办公用品'){

          var items = assetsdata[i].itemsinfo.split(";"); //拆分为 物品-数量

            for (var j = 0; j < items.length-1; j++) {
              //循环4次这里
              var name =  items[j].split("-")[0];
              var count = items[j].split("-")[1];
              //如果已经有了，则添加数量；若没有，则新增一个！
              if (bginfo.hasOwnProperty(name)){
                bginfo[name] = parseInt(count) + bginfo[name]; 
              }else{
                bginfo[name] = parseInt(count); 
              }      
            }
            
        }else if(assetsdata[i].assettype=='低值易耗品'){
            var items = assetsdata[i].itemsinfo.split(";"); //拆分为 物品-数量
            for (var j = 0; j < items.length-1; j++) {
              //循环4次这里
              var name =  items[j].split("-")[0];
              var count = items[j].split("-")[1];

              if (dzinfo.hasOwnProperty(name)){
                dzinfo[name] = parseInt(count) + dzinfo[name]; 
              }else{
                dzinfo[name] = parseInt(count); 
              }      
            }
        }
        
      }
      //按照数量排序
      var res_bg = Object.keys(bginfo).sort(function(a,b){ return bginfo[b]-bginfo[a]; });
      var res_dzyh = Object.keys(dzinfo).sort(function(a,b){ return dzinfo[b]-dzinfo[a]; });

      
      var sto_bg =[];
      var sto_dzyh =[];
      var count1 = 0;
      for(var key in res_bg){
        sto_bg.push({
          name: res_bg[key],
          count:bginfo[res_bg[key]]
        })
        count1 ++;
        //从字典中，获取前五个保存到数值 sto_bg中
        if(count1>4){
          break; 
        }

      }
      var count2 = 0;
      for(var key in res_dzyh){
        sto_dzyh.push({
          name: res_dzyh[key],
          count:dzinfo[res_dzyh[key]]
        });
        count2 ++;
        if(count2>4){
          break; 
        }

      }

      //将办公用品前五的申请数据，以字典的形式保存到缓存中。
      wx.setStorage({
        key: 'sto_bg',
        data: sto_bg
      });

      wx.setStorage({
        key: 'sto_dzyh',
        data: sto_dzyh
      });
      
     
    }).catch(err => {
      console.error('读取失败' + err)
    })
    wx.hideLoading();

  },
  getData: function () {
  	/**
  	 * 此处的操作：
  	 * 获取数据json
  	 */
    dataNames=this.data.dataNames;
    dataQuantity=this.data.dataQuantity;
    this.setOption(Chart); //更新数据
    

  },
  //初始化图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(Chart);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function (Chart) {
    Chart.clear();  // 清除
    Chart.setOption(this.getOption());  //获取新数据
  },
  getOption: function () {
    // 指定图表的配置项和数据
    var option = {
      color: ['#37a2da', '#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
      xAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: dataNames,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      series: [
        {
          name: '数量',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: dataQuantity,
          itemStyle: {
            // emphasis: {
            //   color: '#37a2da'
            // }
          }
        }
        
      ]
    }
    return option;
  },
 
})