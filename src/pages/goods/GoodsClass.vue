<template>
  <div>
    <el-card class="box-card">
      <div class="list_title">
        <h3>商品分类</h3>
        <el-button type="primary" @click="dialogFormVisible = true">添加分类</el-button>
        <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
          <el-form>
            <el-form-item label="分类名称" :label-width="formLabelWidth">
              <el-input v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" :label-width="formLabelWidth">
              <el-switch v-model="startvalue" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="clickAdd(), dialogFormVisible = true">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="cateName" label="分类名称"></el-table-column>
        <el-table-column label="是否启用" prop="state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="dialogFormVisible1 = true,handleEdit(scope.row)">编辑</el-button>
            <!-- 编辑模态框 -->
            <el-dialog title="修改分类" :visible.sync="dialogFormVisible1">
              <el-form>
                <el-form-item label="分类名称" :label-width="formLabelWidth">
                  <el-input v-model="editName" class="cinput"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" :label-width="formLabelWidth">
                  <el-switch v-model="startvalue" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="clickEdit(), dialogFormVisible1 = true">确 定</el-button>
              </div>
            </el-dialog>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  API_GOOD_CLASS,
  API_ADD_GOODS,
  API_DEL_GOODS,
  API_EDITCATE
} from "@/api/apis";
export default {
  data() {
    return {
      page: 1, //当前页
      pagesize: 5, //每页条数
      dialogFormVisible: false,
      formLabelWidth: "120px",
      currentPage: 1,
      tableData: [], //定义存数据的空数组
      value: true,
      startvalue: true,
      total: 0, //总页数
      name: "",
      cateName: "",
      editName: "", //分类名称
      //编辑
      dialogFormVisible1: false,
      id: ""
    };
  },
  methods: {
    //分页 每页显示的条数
    handleSizeChange(val) {
      this.pagesize = val;
      this.getGoodClass();
      //console.log(`每页 ${val} 条`);
    },
    //分页 显示当前页
    handleCurrentChange(val) {
      this.page = val;
      this.getGoodClass();
      //console.log(`当前页: ${val}`);
    },
    open() {
      this.$prompt("分类名称", "添加分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      });
    },
    //编辑商品
    handleEdit(row) {
      //console.log(row.cateName)
      // this.editName=row.cateName
      this.editName = row.cateName;
      this.startvalue = row.state;
      this.id = row.id;
    },
    //修改商品
    clickEdit() {
      API_EDITCATE(this.id, this.editName, this.startvalue.toString()).then(
        res => {
          if (res.data.code == 0) {
            //修改成功
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.dialogFormVisible1 = false
            this.getGoodClass();
          } else {
            //修改失败
            this.$message.error('修改失败！');
          }
        }
      );
    },
    //删除商品
    handleDelete(row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        API_DEL_GOODS(row.id).then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getGoodClass();
          } else {
            //删除失败
            this.$message.error("删除失败！");
          }
        });
      });
      //console.log(row.id);
    },
    //添加商品
    clickAdd() {
      if (this.name.length == 0) return;

      API_ADD_GOODS(this.name, this.startvalue.toString()).then(res => {
        if (res.data.code == 0) {
          //商品添加成功
          this.$message({
            message: "商品添加成功",
            type: "success"
          });
          this.getGoodClass();
          this.dialogFormVisible = false;
          this.name = "";
        } else {
          //添加失败
          this.$message.error("商品添加失败！");
        }
      });
    },
    //封装
    getGoodClass() {
      API_GOOD_CLASS(this.page, this.pagesize).then(res => {
        this.total = res.data.total;
        let arr = res.data.data;
        //console.log(res.data.data)
        //console.log(arr)
        this.tableData = arr.map(item => {
          if (item.state == 1) {
            item.state = true;
          } else {
            item.state = false;
          }
          return item;
        });
        //console.log(this.tableData[0])
      });
    }
  },
  created() {
    this.getGoodClass();
  }
};
</script>

<style lang="less" scoped>
.box-card {
  .list_title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ebeef5;
    h3 {
      margin: 0;
      line-height: 40px;
      color: #606266;
    }
  }
}
.cinput{
  width:350px;
}
</style>