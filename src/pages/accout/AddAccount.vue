<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加账号</span>
      </div>

      <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
        <el-form-item label="账号">
          <el-input v-model="acc"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="pwd"></el-input>
        </el-form-item>
        <el-form-item label="用户组">
          <el-select v-model="accvalue" placeholder="请选择用户组">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="div_btn">
        <el-button type="primary" @click="clickAdd">添加</el-button>
        <el-button @click="clickReset">重置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { API_ADDACCOUNT } from "@/api/apis.js";

export default {
  data() {
    return {
      accvalue: "",
      acc: "",
      pwd: "",
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        region: "",
        type: ""
      },
      options: [
        {
          value: "超级管理员",
          label: "超级管理员"
        },
        {
          value: "普通管理员",
          label: "普通管理员"
        }
      ]
    };
  },
  methods: {
    clickAdd() {
      if (this.acc.length == 0 || this.pwd.length == 0 || this.accvalue == 0) {
        this.$message({
          showClose: true,
          message: "内容不能为空",
          type: "error"
        });
        return;
      } else {
        API_ADDACCOUNT(this.acc, this.pwd, this.accvalue).then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: "恭喜你，添加成功",
              type: "success"
            });
            (this.acc = ""), (this.pwd = ""), (this.accvalue = "");
          }
        });
      }
    },
    clickReset() {
      (this.acc = ""), (this.pwd = ""), (this.accvalue = "");
    }
  }
};
</script>

<style lang="less" scoped>
.el-form {
  width: 300px;
}
.div_btn {
  margin-left: 80px;
}
</style>