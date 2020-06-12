<template>
  <div class="order_div">
    <div class="query_div">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="form.orderNo"></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input v-model="form.consignee"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select placeholder="订单状态" v-model="form.orderState">
            <el-option label="已受理" value="已受理"></el-option>
            <el-option label="派送中" value="派送中"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择时间">
          <el-date-picker
            v-model="value"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日 hh 时 mm 分 ss 秒"
            value-format="yyyy-MM-dd hh:mm:ss"
          ></el-date-picker>
          <el-button type="primary" class="search_btn" @click="clicksearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="orderNo" label="订单号"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="consignee" label="收货人"></el-table-column>
        <el-table-column prop="deliverAddress" label="配送地址"></el-table-column>
        <el-table-column prop="deliveryTime" label="送达时间"></el-table-column>
        <el-table-column prop="remarks" label="用户备注"></el-table-column>
        <el-table-column prop="orderAmount" label="订单金额"></el-table-column>
        <el-table-column prop="orderState" label="订单状态"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>

            <el-button type="text" size="small" @click="handleClick1(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 模态框 -->

    <el-dialog title="查看订单详情" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="收货人" :label-width="formLabelWidth">
          <el-input v-model="form.consignee" autocomplete="off" class="cinput" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="送货地址" :label-width="formLabelWidth">
          <el-input
            v-model="form.deliverAddress"
            autocomplete="off"
            class="cinput"
            :disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="送达时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.deliveryTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="disabled"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="订单id" :label-width="formLabelWidth">
          <el-input v-model="form.id" autocomplete="off" class="cinput" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="订单金额" :label-width="formLabelWidth">
          <el-input
            v-model="form.orderAmount"
            autocomplete="off"
            class="cinput"
            :disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单号" :label-width="formLabelWidth">
          <el-input v-model="form.orderNo" autocomplete="off" class="cinput" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" :label-width="formLabelWidth">
          <el-select placeholder="订单状态" v-model="form.orderState" :disabled="disabled">
            <el-option label="已受理" value="已受理"></el-option>
            <el-option label="派送中" value="派送中"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.orderTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="disabled"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off" class="cinput" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remarks" autocomplete="off" class="cinput" :disabled="disabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="clickcon(),dialogFormVisible = true"
          :disabled="disabled2"
        >确 定</el-button>
      </div>
    </el-dialog>

    <div class="pages_div">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pagesizes"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { API_ORDER_LIST, API_ORDER_DETAIL, API_EDIT_ORDER } from "@/api/apis";
export default {
  data() {
    return {
      total: 0,
      currentPage: 1,
      pagesizes: [10, 20, 30, 40],
      pagesize: 10,
      page: 1,
      num_input: "",
      value1: "",
      tableData: [],
      disabled: true,
      disabled2: true,
      value: "",
      //查看
      id: "",
      dialogFormVisible: false,
      form: {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: ""
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    //查看
    handleClick(row) {
      //console.log(row);
      this.id = row.id;
      this.dialogFormVisible = true;
      this.disabled = true;
      API_ORDER_DETAIL(this.id).then(res => {
        this.form = res.data.data;
        //console.log(this.form);
      });
    },
    //编辑
    handleClick1(row) {
      //console.log(row)
      this.dialogFormVisible = true;
      this.disabled = false;
      this.disabled2 = false;
      this.id = row.id;
      this.dialogFormVisible = true;

      API_ORDER_DETAIL(this.id).then(res => {
        res.data.data.orderTime = new Date(res.data.data.orderTime)
          .toJSON()
          .substr(0, 19)
          .replace("T", " ");
        res.data.data.deliveryTime = new Date(res.data.data.deliveryTime)
          .toJSON()
          .substr(0, 19)
          .replace("T", " ");
        this.form = res.data.data;
      });
    },

    //确认修改订单信息
    clickcon() {
      if (
        this.form.orderTime.length == 0 ||
        this.form.phone.length == 0 ||
        this.form.consignee.length == 0 ||
        this.form.deliverAddress.length == 0 ||
        this.form.deliveryTime.length == 0 ||
        this.form.remarks.length == 0 ||
        this.form.orderAmount.length == 0 ||
        this.form.orderState.length == 0
      ) {
        this.$message({
          message: "请把信息填写完整！",
          type: "warning"
        });
        return;
      }
      API_EDIT_ORDER(
        this.id,
        this.form.orderNo,
        this.form.orderTime,
        this.form.phone,
        this.form.consignee,
        this.form.deliverAddress,
        this.form.deliveryTime,
        this.form.remarks,
        this.form.orderAmount,
        this.form.orderState
      ).then(res => {
        if (res.data.code == 0) {
          //修改成功
          this.$message({
            message: "修改成功！",
            type: "success"
          });
          this.dialogFormVisible = false;
          this.getorder();
        } else {
          //修改失败
          this.$message.error("修改失败！");
        }
      });
    },

    //查询
    clicksearch() {

      if(this.value==null){
         this.value=""
       }
      
      API_ORDER_LIST(
        this.page,
        this.pagesize,
        this.form.orderNo,
        this.form.consignee,
        this.form.phone,
        this.form.orderState,
        JSON.stringify(this.value)
      ).then(res => {
        for (let e of res.data.data) {
          e.deliveryTime = new Date(e.deliveryTime)
            .toJSON()
            .substr(0, 19)
            .replace("T", " ");
          e.orderTime = new Date(e.orderTime)
            .toJSON()
            .substr(0, 19)
            .replace("T", " ");
        }
        this.tableData = res.data.data;
        this.total = res.data.total;
        
      
        // console.log(this.total)
      });
       
       
    },

    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.getorder();
      //console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getorder();
      //console.log(`当前页: ${val}`);
    },

    //获取订单
    getorder() {
      API_ORDER_LIST(
        this.page,
        this.pagesize,
        this.orderNo,
        this.consignee,
        this.phone,
        this.orderState,
        this.date
      ).then(res => {
        //console.log(res.data);
        this.total = res.data.total;
        for (let e of res.data.data) {
          e.deliveryTime = new Date(e.deliveryTime)
            .toJSON()
            .substr(0, 19)
            .replace("T", " ");
          e.orderTime = new Date(e.orderTime)
            .toJSON()
            .substr(0, 19)
            .replace("T", " ");
        }

        this.tableData = res.data.data;
      });
    }
  },
  created() {
    this.getorder();
  }
};
</script>

<style lang="less" scoped>
.order_div {
  background-color: #fff;
  margin: 20px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  .query_div {
    width: 100%;
    display: flex;
    justify-self: start;
    flex-wrap: wrap;
    margin-bottom: 40px;
    label {
      display: flex;
      span {
        margin: 0 10px;
      }
      .el-input {
        width: 260px;
      }
    }
    .block {
      margin-top: 10px;
      span {
        margin: 0 10px;
      }
    }
  }
  .pages_div {
    margin-top: 10px;
  }
}
.search_btn {
  margin-left: 10px;
}
</style>