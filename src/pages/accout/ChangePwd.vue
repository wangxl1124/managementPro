<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修改密码</span>
      </div>

      <el-form :label-position="labelPosition" label-width="85px">
        <el-form-item label="原密码">
          <el-input v-model="pwd" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="new_pwd" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="confirm_pwd" show-password></el-input>
        </el-form-item>
      </el-form>

      <div class="div_btn">
        <el-button type="primary" @click="clickalter">确定</el-button>
        <el-button>重置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { API_OLDPWD,API_NEWPWD } from "@/api/apis";
export default {
  data() {
    return {
      value: "",
      labelPosition: "right",
      pwd: "",
      new_pwd: "",
      confirm_pwd: ""
    };
  },
  methods: {
    //点击确认，获取原密码
    clickalter() {
      let id = sessionStorage.getItem("id");
      let oldPwd = sessionStorage.getItem("pwd");
      //console.log(this.pwd!=oldPwd)
      // console.log(this.pwd.length)
      //console.log(id,oldPwd)

      if (this.pwd.length == 0 || this.pwd != oldPwd) {
        this.$message({
          message: "原密码错误！",
          type: "warning"
        });
        return;
      } else {
        //console.log(id,oldPwd)
        API_OLDPWD(id, oldPwd).then(res => {
          if (res.data.code == 0) {
            console.log("ok");
          }
        });
      }
      if (this.new_pwd.length == 0 || this.confirm_pwd.length == 0) {
        this.$message.error("请输入新密码！");
        return;
      }

      if (this.new_pwd == this.confirm_pwd) {
        API_NEWPWD(this.new_pwd,id).then(res => {

          if (res.data.code == 0) {
            this.$message({
              message: "恭喜你，密码修改成功，请重新登录！",
              type: "success"
            });
            (this.pwd = ""), (this.new_pwd = "");
            this.confirm_pwd = "";

            setTimeout( ()=>{
              location.hash='/'
            },1000)
          }else{
            this.$message.error("密码修改失败~");
          }
        });
      } else {
        this.$message.error("两次密码不一致，请重新输入！");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-form {
  width: 300px;
}
.div_btn {
  margin-left: 85px;
}
</style>