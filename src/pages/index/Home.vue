<template>
  <div>
    <div class="card_div">
      <el-card class="box-card">
        <div class="text card_con">
          <span class="el-icon-document"></span>
          <div>
            <p>总订单</p>
            <p>{{totalOrder}}</p>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="text card_con">
          <span class="el-icon-coin"></span>
          <div>
            <p>总销售额</p>
            <p>{{totalAmount}}</p>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="text card_con">
          <span class="el-icon-s-order"></span>
          <div>
            <p>今日订单数</p>
            <p>{{todayOrder}}</p>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="text card_con">
          <span class="el-icon-bank-card"></span>
          <div>
            <p>今日销售额</p>
            <p>{{totayAmount}}</p>
          </div>
        </div>
      </el-card>
    </div>
    <div>
      <el-card>
        <div id="myechar_box"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { API_GET_ORDER } from "@/api/apis";
export default {
  data() {
    return {
      totalOrder: 0,
      totalAmount: 0,
      todayOrder: 0,
      totayAmount: 0
    };
  },
  mounted() {
    var myechar = echarts.init(document.getElementById("myechar_box"));

    myechar.showLoading();

    setTimeout(() => {
      API_GET_ORDER().then(res => {
        let {
          xData,
          amountData,
          orderData,
          todayOrder,
          totalAmount,
          totalOrder,
          totayAmount
        } = res.data;
        this.totalOrder = totalOrder;
        this.totalAmount = totalAmount;
        this.todayOrder = todayOrder;
        this.totayAmount = totayAmount;

        let option = {
          title: {
            text: "数据统计"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["金额数据", "订单数据"]
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: xData
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "金额数据",
              type: "line",
              stack: "总量",
              data: amountData
            },
            {
              name: "订单数据",
              type: "line",
              stack: "总量",
              data: orderData
            }
          ]
        };
        myechar.setOption(option);
        myechar.hideLoading()
      });
    }, 1000);
  }
};
</script>

<style lang="less" scoped>
.card_div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .box-card {
    width: 360px;
    padding: 0 30px;
    box-sizing: border-box;
    .card_con {
      display: flex;
      justify-content: space-between;
      span {
        font-size: 80px;
      }
      div {
        text-align: center;
        font-size: 22px;
        p {
          margin: 0;
        }
        p:first-child {
          color: #ccc;
          margin-top: 10px;
          margin-bottom: 5px;
        }
        p:nth-child(2) {
          font-weight: bold;
        }
      }
    }
  }
}
#myechar_box {
  width: 1600px;
  height: 500px;
}
.el-icon-document {
  color: #1296db;
}
.el-icon-coin {
  color: #d4237a;
}
.el-icon-s-order {
  color: #1296db;
}
.el-icon-bank-card {
  color: #1afa29;
}
</style>