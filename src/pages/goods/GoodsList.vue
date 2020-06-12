<template>
  <div>
    <div>
      <el-card class="box-card">
        <h3>商品列表</h3>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="商品 ID">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="所属分类">
                  <span>{{ props.row.category }}</span>
                </el-form-item>
                <el-form-item label="商品图片">
                  <img
                    :src="'http://127.0.0.1:5000/upload/imgs/goods_img/'+props.row.imgUrl"
                    width="140"
                    height="140"
                  />
                </el-form-item>
                <el-form-item label="商品评价">
                  <span>{{ props.row.rating }}</span>
                </el-form-item>
                <el-form-item label="商品描述">
                  <span>{{ props.row.goodsDesc }}</span>
                </el-form-item>
                <el-form-item label="商品名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="商品价格">
                  <span>{{ props.row.price }}</span>
                </el-form-item>
                <el-form-item label="创建时间">
                  <span>{{ props.row.ctime }}</span>
                </el-form-item>
                <el-form-item label="商品销量">
                  <span>{{ props.row.sellCount }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" prop="name"></el-table-column>
          <el-table-column label="所属分类" prop="category"></el-table-column>
          <el-table-column label="商品价格" prop="price"></el-table-column>
          <el-table-column label="商品图片" prop="tableData">
            <template slot-scope="scope">
              <img
                :src="'http://127.0.0.1:5000/upload/imgs/goods_img/'+scope.row.imgUrl"
                width="140"
                height="140"
              />
            </template>
          </el-table-column>
          <el-table-column label="商品描述" prop="goodsDesc"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row),dialogFormVisible = true">编辑</el-button>
              <el-dialog title="修改商品" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                  <el-form-item label="商品名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" class="cinput"></el-input>
                  </el-form-item>
                  <el-form-item label="商品分类" :label-width="formLabelWidth">
                    <el-select v-model="form.region">
                      <el-option v-for="item in catename" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="商品价格" :label-width="formLabelWidth">
                    <el-input v-model="form.price" class="cinput"></el-input>
                  </el-form-item>
                  <el-form-item label="商品图片" :label-width="formLabelWidth">
                    <el-upload
                      action="http://127.0.0.1:5000/goods/goods_img_upload"
                      list-type="picture-card"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove"
                      :on-success="handleAvatarSuccess"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                      <img width="100%" :src="dialogImageUrl" alt />
                    </el-dialog>
                  </el-form-item>
                  <el-form-item label="商品描述" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.goodsDesc" style="width:350px;"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="clickedit(),dialogFormVisible = true">确 定</el-button>
                </div>
              </el-dialog>
              <el-button size="mini" type="danger" @click="handleDelete( scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pagesizes"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
       
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  API_GOODS_LIST,
  API_DEL_GOODSMSG,
  API_QUERY_GOODS,
  API_EDIT_GOODS
} from "@/api/apis";
export default {
  data() {
    return {
      //page: 1,
      pagesize: 5,
      pagesizes: [5, 10, 15, 20],
      total: 0,
      currentPage: 1,
      tableData: [],
      imgUrl: "",
      //编辑
      dialogFormVisible: false,
      catename: [],
      id: "",
      form: {
        name: "",
        region: "",
        price: "",
        imgUrl: "",
        goodsDesc: ""
      },
      formLabelWidth: "120px",

      //修改商品图片
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      console.log(val,"条");
      
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(val);
      
      this.getList();
    },
    //获取商品列表
    getList() {
      API_GOODS_LIST(this.currentPage, this.pagesize).then(res => {
        // console.log(res)
         console.log(res.data);
       
        //console.log(res.data.data)
        res.data.data.forEach(i => {
          i.ctime = new Date(i.ctime)
            .toJSON()
            .substr(0, 19)
            .replace("T", " ");
        });
        this.tableData = res.data.data
        this.total = res.data.total;
      });
    },
    //编辑商品
    handleEdit(row) {
      //console.log(row);
      this.form.name = row.name;
      this.form.region = row.category;
      this.form.price = row.price;
      this.form.goodsDesc = row.goodsDesc;
      this.imgUrl = row.imgUrl;
      this.id = row.id;
      //获取商品分类
      API_QUERY_GOODS().then(res => {
        //console.log(res.data.categories)
        var name = res.data.categories.map(i => {
          return i.cateName;
        });
        this.catename = name;
      });
    },
    //确认修改商品
    clickedit() {
      if (
        this.form.name.length == 0 ||
        this.form.region.length == 0 ||
        this.form.price.length == 0 ||
        this.form.goodsDesc.length == 0
      ) {
        this.$message({
          message: "请把信息填写完整",
          type: "warning"
        });

        return;
      } else {
        API_EDIT_GOODS(
          this.form.name,
          this.form.region,
          this.form.price,
          this.imgUrl,
          this.form.goodsDesc,
          this.id
        ).then(res => {
          if (res.data.code == 0) {
            //修改成功
            this.$message({
              message: "商品修改成功！",
              type: "success"
            });
            this.dialogFormVisible = false;
            this.getList();
          } else {
            //修改失败
            this.$message.error("修改失败，请重试！");
          }
        });
      }
    },
    //删除商品
    handleDelete(row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        API_DEL_GOODSMSG(row.id).then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList();
          } else {
            this.$message.error("删除失败！");
          }
        });
      });
    },
    //修改商品图片上传
    handleAvatarSuccess(res) {
      this.imgUrl = res.imgUrl;
      //this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
  created() {
   
    this.getList();
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
  }
  .el-pagination {
    margin-top: 20px;
  }
}
.img {
  width: 60px;
  height: 60px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.cinput {
  width: 350px;
}

</style>