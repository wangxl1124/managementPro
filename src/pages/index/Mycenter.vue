<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>管理员信息</span>
      </div>
      <ul>
        <li>管理员ID：{{id}}</li>
        <li>账号：{{acc}}</li>
        <li>用户组：{{usergroup}}</li>
        <li>创建时间：{{ctime}}</li>
      </ul>
      <el-form ref="form">
        <el-form-item>
          <el-form-item label="管理员头像：">
            <el-upload
              class="avatar-uploader"
              :action="myphoto"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :data="{id}"
            >
              <i  class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { API_MYCENTER,SERVER_MY_PHOTO } from "@/api/apis";
export default {
  data() {
    return {
      id: '',
      acc: "",
      usergroup: "",
      ctime: "",
      liMsg: [],
      dialogImageUrl: "",
      dialogVisible: false,
      myphoto:SERVER_MY_PHOTO
    };
  },
  methods: {
     handleAvatarSuccess() {
       window.location.reload()
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    
  },
  created() {
    let id = localStorage.id;
    
    API_MYCENTER(id).then(res => {
      localStorage.imageUrl = res.data.accountInfo.imgUrl
      //this.imageUrl=res.data.accountInfo.imgUrl
      this.liMsg.push(res.data.accountInfo);
      //console.log(this.liMsg)
      this.id = this.liMsg[0].id;
      this.acc = this.liMsg[0].account;
      this.usergroup = this.liMsg[0].userGroup;
      //this.ctime = this.liMsg[0].ctime;
      this.ctime=new Date(this.liMsg[0].ctime)
          .toJSON()
          .substr(0, 19)
          .replace("T", " ");
      
    });


  }
};
</script>

<style lang="less" scoped>
ul {
  list-style: none;
  padding: 0;
  li {
    line-height: 50px;
    border-bottom: 1px solid #ebeef5;
  }
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>