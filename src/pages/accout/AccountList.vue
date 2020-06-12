<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账号列表</span>
      </div>
      <el-table
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="account" label="账号"></el-table-column>
        <el-table-column prop="userGroup" label="用户组"></el-table-column>
        <el-table-column prop="ctime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="open( scope.row),dialogFormVisible = true">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <div class="change_div">
        <el-button @click="batchDel()" type="danger">批量删除</el-button>
        <el-button @click="deselectAll()" type="primary">取消选择</el-button>
      </div>
    </el-card>

    <!-- 模态框 -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item label="用户组" :label-width="formLabelWidth">
          <el-select v-model="usergroup">
            <el-option label="超级管理员" value="超级管理员"></el-option>
            <el-option label="普通管理员" value="普通管理员"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickConfirm(),dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  API_ACCOUNTLIST,
  API_DELACCOUNT,
  API_BATCHDEL,
  API_EDITACC
} from "@/api/apis.js";
export default {
  data() {
    return {
      dialogFormVisible: false,
      page: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      //选中的数组
      multipleSelection: [],
      //存要删除id的数组
      newSelect: [],
      //删除id
      delId: "",
      usergroup: "",
      //编辑账号的id
      editId: 0,
      form: {
        name: ""
      },
      formLabelWidth: "300px"
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //编辑账号信息
    open(row) {
      this.form.name = row.account;
      this.usergroup = row.userGroup;
      this.editId = row.id;
      // console.log(row)
      // console.log(row.userGroup)
    },
    //确认编辑账号
    clickConfirm() {
      API_EDITACC(this.editId, this.form.name, this.usergroup).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "恭喜你，修改成功！",
            type: "success"
          });
          this.getData();
        } else {
          this.$message.error("修改失败！");
        }
      });
    },
    //删除账号信息
    handleDelete(row) {
      this.$confirm("此操作将永久删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_DELACCOUNT(row.id).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
              this.getData();
            } else {
              this.$message.error("删除失败！");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
      //console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
      //console.log(`当前页: ${val}`);
    },
    //取消全选
    deselectAll() {
      this.$refs.multipleTable.clearSelection();
    },
    //获取选中的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除
    batchDel() {
      if (this.multipleSelection.length != 0) {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.newSelect.push(this.multipleSelection[i].id);
          //console.log(this.newSelect)
        }
        this.delId = JSON.stringify(this.newSelect);
        //console.log(this.delId);
        this.$confirm("此操作将永久删除该批量账号, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
           API_BATCHDEL(this.delId).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: "批量删除成功！",
                type: "success"
              });
              this.getData();
            } else {
              this.$message.error("批量删除失败！");
            }
          });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });

      } else {
        this.$message({
          message: "未选择删除信息！",
          type: "warning"
        });
        return;
      }
    },

    //封装获取账号信息函数
    getData() {
      API_ACCOUNTLIST(this.page, this.pageSize).then(res => {
         res.data.data.forEach(i => {
           i.ctime=new Date(i.ctime)
            .toJSON()
            .substr(0, 19)
            .replace("T", " ");
         });
        this.tableData = res.data.data;
        this.total = parseInt(res.data.total);
       
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-table {
  margin-bottom: 20px;
}
.change_div {
  margin-top: 20px;
}
</style>