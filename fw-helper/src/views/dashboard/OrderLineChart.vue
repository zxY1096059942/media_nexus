<template>
  <el-card style="margin: 20px 0px; font-size: 14px;">
    <div slot="header" class="clearfix">
      <el-row>
        <el-col :span="6">
          <div style="font-weight: bold;font-size: 16px">APP账户新增趋势</div>
        </el-col>
        <el-col :span="18">
          <div style="text-align: right">
            <el-radio-group  v-model="params.type" size="small" @change="orderStat">
              <el-radio-button label="1">近七日</el-radio-button>
              <el-radio-button label="2">近三十日</el-radio-button>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
    </div>
    <div :style="{minHeight:height,minWidth:width}">
      <div ref="chart" class="chart" :style="{height:height,width:width}"/>
    </div>
  </el-card>
</template>
<script>

import {memberAccountStatistics} from "@/api/statistics";
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  name: "OrderLineChart",
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '240px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            let start = new Date();
            start.setFullYear(2018);
            start.setMonth(10);
            start.setDate(1);
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一月',
          onClick(picker) {
            const end = new Date();
            let start = new Date();
            start.setFullYear(2018);
            start.setMonth(10);
            start.setDate(1);
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      orderCountDate: '',
      params: {
        type: 2
      },
      chartData: {},
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  created() {
    this.orderStat()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({dateList, orderCount} = {}) {
      this.chart.setOption({
        title: {
          text: '账户新增量',
          textStyle: {
            fontSize: 14,
            fontWeight: 'bolder',
            color: '#000000'          // 主标题文字颜色
          },
        },
        grid:{
          left:15,
          right:15,
          bottom:10,
          top:60,
          containLabel:true

        },
        xAxis: {
          data: dateList,
          type: 'category',
          boundaryGap: true,
          axisLabel: {
            rotate: 40
          },
          textStyle: {
            fontSize: 12,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#000000"
            }
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: [
          {
            type: 'value',
            name: '数量',
            position: 'left',
            alignTicks: true,
            splitLine:{
              show: false
            },
            axisTick:{
              show: true
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#000000"
              }
            },
          }
        ],
        legend: {
          data: ['新增数']  //['订单金额', '订单数']
        },
        series: [
          {
            name: '新增数',
            itemStyle: {
              normal: {
                color: '#5b8ff9',
              }
            },
            type: 'bar',
            barMaxWidth: 20,
            data: orderCount,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
 
          ]
      })
    },
    handleDateChange() {
      this.getData();
    },
    orderStat(){
      memberAccountStatistics(this.params).then(res => {
        console.log(res)
        const orderCount = res.map(it => {
          return it.newNum
        })
        const dateList = res.map(it => {
          return it.date.substr(5)
        })
        this.chartData = {dateList,  orderCount}//  {dateList, orderAmount, orderCount}
        
        this.initChart()
      })
    }
  }

}
</script>
<style scoped lang="scss">

</style>
