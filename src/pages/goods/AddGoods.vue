<template>
  <div>
    <div>
      <el-card class="box-card">
        <h3>商品添加</h3>

        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.name" placeholder="商品名称" style="width:350px;"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="form.region" placeholder="请选择商品分类">
              <el-option v-for="item in catename" :key="item" :label="item" :value="item"></el-option>
              
            </el-select>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input-number v-model="num" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="商品图片">
            <el-upload
              action="http://127.0.0.1:5000/goods/goods_img_upload"
              list-type="picture-card"
              :on-success="handleAvatarSuccess"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>

          <el-form-item label="商品描述">
            <el-input type="textarea" v-model="form.desc" style="width:350px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="clickAdd">添加商品</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { API_QUERY_GOODS, API_ADDGOODS } from "@/api/apis";
export default {
  data() {
    return {
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      num: 1,
      form: {
        name: "",
        region: "",
        resource: "",
        desc: ""
      },
      catename: []
    };
  },
  methods: {
    handleAvatarSuccess(res) {
      this.imageUrl = res.imgUrl;
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    //点击添加商品
    clickAdd() {
      if (
        this.form.name.length == 0 ||
        this.form.region.length == 0 ||
        this.form.desc.length == 0
      ) {
        this.$message.error("请把信息填写完整！");
        return;
      } else {
        API_ADDGOODS(
          this.form.name,
          this.form.region,
          this.num,
          this.imageUrl,
          this.form.desc
        ).then(res => {
          if (res.data.code == 0) {
            //商品添加成功
            this.$message({
              message: "商品添加成功！",
              type: "success"
            });
            window.location.reload()
          } else {
            //添加失败
            this.$message.error('商品添加失败！');
          }
        });
      }
    }
  },
  created() {
    API_QUERY_GOODS().then(res => {
      //console.log(res.data.categories)
      var name = res.data.categories.map(i => {
        return i.cateName;
      });
      this.catename = name;
    });
  }
};
</script>

<style lang="less" scoped>
.box-card {
  h3 {
    margin: 0;
    line-height: 40px;
    color: #606266;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 20px;
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
}
</style>