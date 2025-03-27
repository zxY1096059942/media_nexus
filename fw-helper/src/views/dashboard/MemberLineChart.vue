<template>
  <el-card style="margin: 20px 0px; font-size: 14px;">
    <div slot="header" class="clearfix">
      <el-row>
        <el-col :span="6">
          <div style="font-weight: bold;font-size: 16px">APP账户活跃趋势</div>
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
      <div ref="chart0" class="chart" :style="{height:height,width:width}"/>
    </div>
  </el-card>
</template>
<script>

import {memberAccountStatistics} from "@/api/statistics";
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { Container } from "element-ui";

export default {
  mixins: [resize],
  name: "MemberLineChart",
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
            start.setFullYear(2024);
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
            start.setFullYear(2024);
            start.setMonth(10);
            start.setDate(1);
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      orderCountDate: '',
      params: {
        type: 2,
        code: 1
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
    if (!this.chart0) {
      return
    }
    this.chart0.dispose()
    this.chart0 = null
  },
  created() {
    this.orderStat()
  },
  methods: {
    initChart() {
      this.chart0 = echarts.init(this.$refs.chart0, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({dateList, orderAmount} = {}) {
      this.chart0.setOption({
        title: {
          text: '账户活跃量',
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
              show: false
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
          data: ['活跃数']  
        },
        series: [
          {
            name: '活跃数',
            itemStyle: {
              normal: {
                color: '#5b8ff9',
              }
            },
            type: 'bar',
            barMaxWidth: 20,
            data: orderAmount,
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
        const orderAmount = res.map(it => {
          return it.activeNum
        })
        const dateList = res.map(it => {
          return it.date.substr(5)
        })
        this.chartData = {dateList,  orderAmount}//  

        this.initChart()
      })
    }
  }

}
</script>
<style scoped lang="scss">

</style>
