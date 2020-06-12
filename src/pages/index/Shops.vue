<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>店铺管理</span>
        <el-button style="float: right; " type="primary" @click="clicksave">保存</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="店铺名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="店铺公告">
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入内容"
            v-model="form.bulletin"
            style="width:360px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺头像">
          <el-upload
            class="avatar-uploader"
            :action="serverupload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.avatar" :src="servershopimg+form.avatar" class="avatar" />
            <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
          </el-upload>
        </el-form-item>
        <el-form-item label="店铺图片">
        
          <el-upload
            :action="serverupload"
            list-type="picture-card"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess2"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="配送费">
          <el-input v-model="form.deliveryPrice"></el-input>
        </el-form-item>
        <el-form-item label="配送时间">
          <el-input v-model="form.deliveryTime"></el-input>
        </el-form-item>
        <el-form-item label="配送描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="店铺评分">
          <el-input v-model="form.score"></el-input>
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model="form.sellCount"></el-input>
        </el-form-item>

        <el-form-item label="活动">
          <el-checkbox-group v-model="supports">
            <el-checkbox label="在线支付满28减5"></el-checkbox>
            <el-checkbox label="VC无限橙果汁全场8折"></el-checkbox>
            <el-checkbox label="单人精彩套餐"></el-checkbox>
            <el-checkbox label="特价饮品8折抢购"></el-checkbox>
            <el-checkbox label="单人特色套餐"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="营业时间">
          <el-time-picker
            is-range
            arrow-control
            v-model="form.date"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { API_SHOP_INFO, API_SHOP_EDIT,SERVER_UPLOAD,SERVER_SHOP_IMG } from "@/api/apis";
export default {
  data() {
    return {
      form: {},  //店铺信息
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      value2: "",
      supports: [],
      serverupload:SERVER_UPLOAD, //上传图片地址
      servershopimg:SERVER_SHOP_IMG,  //图片地址
      fileList:[],
      pics:[]
    };
  },
  methods: {
    //店铺头像
    handleAvatarSuccess(res) {
      //Sthis.imageUrl = URL.createObjectURL(file.raw);
      this.form.avatar = res.imgUrl;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    //店铺图片
    handleAvatarSuccess2(res) {
      this.pics.push(res.imgUrl)
    },
    handleRemove( fileList) {
      
      for(let i in this.form.pics){
        if(this.form.pics[i]===fileList.name){
          this.form.pics.splice(i,1)
        }
      }
      //console.log(fileList.name)
      //console.log(this.form.pics)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //获取店铺信息
    getshop() {
      API_SHOP_INFO().then(res => {
        //console.log(res)
        //this.imageUrl=res.data.data.avatar;
        this.form = res.data.data;
        //console.log(this.form.date);
        this.supports = this.form.supports;
        //console.log(this.supports)
        //console.log(this.form.pics);
        this.fileList=res.data.data.pics.map(img=>{
          return {
            name:img,
            url:this.servershopimg + img
          }
        })
      });
    },
    //店铺内容修改
    clicksave() {
      //展开运算符
      let newObj = {...this.form}
      //console.log(newObj)
      newObj.supports=JSON.stringify(this.supports)
      newObj.pics=JSON.stringify(this.pics.concat(this.form.pics))
      newObj.date=JSON.stringify(this.form.date)
     
      
      if (
        this.form.name.length == 0 ||
        this.form.bulletin.length == 0 ||
        this.form.deliveryTime.length == 0 ||
        this.form.description.length == 0 ||
        this.form.score.length == 0 ||
        this.form.date.length == 0
      ) {
        this.$message({
          message: "请把信息填写完整！",
          type: "warning"
        });
        return;
      }
      //console.log(this.form.pics)
      API_SHOP_EDIT(newObj).then(res => {
        //console.log(res)
        if (res.data.code == 0) {
          //修改成功
          this.$message({
            message: "资料修改成功！",
            type: "success"
          });
          this.getshop()
        } else {
          //修改失败
          this.$message.error('修改失败！');
        }
      });
     }
  },
  created() {
    
    this.getshop()
  }
};
</script>

<style lang="less" scoped>
.el-input {
  width: 360px;
}
.el-form-item {
  width: 480px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
  margin-bottom: 5px;
}
.pics {
  margin-top: 5px;
  margin-right: 5px;
  width:140px;
  height:140px;
}
</style>