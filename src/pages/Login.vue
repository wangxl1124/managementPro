<template>
  <div class="modal_div">
    
      <div class="login_div">
       <el-card>
        <h3>就知道吃餐饮管理系统</h3>
        <el-input placeholder="请输入用户名" v-model="user_input" clearable></el-input>
        <el-input placeholder="请输入密码" v-model="pwd_input" show-password></el-input>
        <el-button type="primary" @click="clickLogin">登录</el-button>
        </el-card>
      </div>
   
  </div>
</template>

<script>
import { API_LOGIN } from "@/api/apis.js";
export default {
  data() {
    return {
      user_input: "",
      pwd_input: "",
      back_color: "#2d3a4b",
      //防抖
      isreq: true
    };
  },
  methods: {
    clickLogin() {
      //防抖
      if (this.isreq == false) return;

      //发送一次登录请求，把标识设置未false
      this.isreq = false;

      API_LOGIN(this.user_input, this.pwd_input).then(res => {
        console.log(res)
        // window.pwd=JSON.parse(res.config.data).password
        // console.log(res.data.id)
        if (res.data.code == 0) {
          //this.$router.push('/index/home')
          this.$message({
            message: "恭喜你，登录成功！",
            type: "success"
          });
          setTimeout(() => {
            this.$router.push("/index/home");
          }, 300);
          //本地存储保存密码和id
          localStorage.pwd = JSON.parse(res.config.data).password;
          localStorage.id = res.data.id;
          localStorage.acc = JSON.parse(res.config.data).account;
          localStorage.token = res.data.token;
          localStorage.role = res.data.role;
          /* window.pwd=JSON.parse(res.config.data).password
          window.id=res.data.id */
          //console.log(window.pwd)
          //console.log("登录成功");
        } else {
          this.$message({
            message: "用户名或密码错误",
            type: "error"
          });
          //console.log('登录失败')
          return;
        }
      });

      //3秒后重新点击
      setTimeout(() => {
        this.isreq = true;
      }, 3000);
    }
  }
};
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  
}
.modal_div {
  width: 100%;
  height: 100%;
  background:url('../assets/images/ban.jpg') no-repeat;
  background-size:100% 100%;
  
}
.login_div {
  width: 400px;
  height: 280px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  
  h3 {
    color:#fff;
    text-align: center;
    margin-bottom: 20px;
  }
  .el-input {
    margin-bottom: 20px;
  }
  .el-button {
    width: 100%;
  }
}
.el-card{
background:transparent;

}
</style>