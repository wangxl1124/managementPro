<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="value"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd hh:mm:ss"
          format="yyyy年 MM 月 dd 日 hh 时 mm 分 ss 秒"
        ></el-date-picker>
        <el-button type="primary" style="margin-left:10px;" @click="clickquery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-card class="box-card">
      <div id="myecharts"></div>
    </el-card>
  </div>
</template> 

<script>
import echarts from "echarts";
import { API_ORDER_TOTAL } from "@/api/apis";

export default {
  data() {
    return {
      value: "",
      orderTime: [],
      orderAmount: []
    };
  },

  mounted() {
    this.getecharts()
  },
  methods: {
    getecharts() {
      var myecharts = echarts.init(document.getElementById("myecharts"));
      API_ORDER_TOTAL(JSON.stringify(this.value)).then(res => {
        //console.log(res.data.data);
        this.orderTime = res.data.data.map(i => {
          return new Date(i.orderTime)
            .toJSON()
            .substr(0, 19)
            .replace("T", " ");
        });
        this.orderAmount = res.data.data.map(i => {
          return i.orderAmount;
        });
        // console.log(this.orderTime)
        // console.log(this.orderAmount)
        let option = {
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["蒸发量", "降水量"]
          },
          toolbox: {
            show: true,
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          calculable: true,
          xAxis: [
            {
              type: "category",
              data: this.orderTime
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: "下单时间",
              type: "bar",
              data: this.orderAmount,
              markPoint: {
                data: [
                  { type: "max", name: "最大值" },
                  { type: "min", name: "最小值" }
                ]
              }
            }
          ]
        };
        myecharts.setOption(option);
      });
    },
    clickquery() {
      //console.log(this.value)
      
      API_ORDER_TOTAL(JSON.stringify(this.value)).then(res => {
        //console.log(res.data.data)
        
        this.orderTime = res.data.data.map(i => {
          return new Date(i.orderTime)
            .toJSON()
            .substr(0, 19)
            .replace("T", " ");
        });
        this.orderAmount = res.data.data.map(i => {
          return i.orderAmount;
        });
        this.getecharts()
      });
    }
  }
};
</script>

<style lang="less" scoped>
#myecharts {
  width: 1600px;
  height: 500px;
}
</style>