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

    ],
    dataNames:['水笔', 'u盘', '印泥', '回形针','双面胶'],
    dataQuantity:[131, 98, 45, 42, 23]
    
  },
  tabSelect(e) {
    var flag=e.currentTarget.dataset.id;
    this.setData({
      tabCur: e.currentTarget.dataset.id
    })

    if(flag==0){
      this.setData({
        dataNames:['水笔', 'u盘', '印泥', '回形针','双面胶'],
        dataQuantity:[131, 98, 45, 42, 23]
      })
      this.getData(); //更新数据  
    }else if(flag==1){
      this.setData({
        dataNames:['硒鼓', '电风扇', '打印机'],
        dataQuantity:[112, 43, 31]
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
    this.getData(); //获取数据
  },
  getData: function () {
  	/**
  	 * 此处的操作：
  	 * 获取数据json
  	 */
    dataNames=this.data.dataNames;
    dataQuantity=this.data.dataQuantity;
    console.log('更新数据');
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