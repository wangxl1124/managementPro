<template>
  <el-container>
    <el-aside width="240px">
      <div class="list_title">
        <el-avatar icon="el-icon-dish"></el-avatar>
        <p>就知道吃管理中心</p>
      </div>

      <!-- :default-active="defaultActive" -->
      <el-menu
        :default-active="this.$route.path"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        unique-opened
      >
        <div v-for="item in newtreelist" :key="item.index">
          <!-- 二级下拉菜单 判断是否有子级 -->
          <el-submenu v-if="item.childlist" :index="item.index">
            <template slot="title">
              <i :class="item.icls"></i>
              <span>{{item.title}}</span>
            </template>
            <!-- 二级标题 -->
            <el-menu-item
              v-for="children in item.childlist"
              :key="children.index"
              :index="children.index"
            >
              <template slot="title">{{children.title}}</template>
            </el-menu-item>
          </el-submenu>
          <!-- 一级下拉菜单 -->
          <el-menu-item v-else :index="item.index">
            <i :class="item.icls"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <!-- 面包屑 -->
        <div>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="item in this.$route.meta.name" :key="item">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="icon_div">
          <span>
            欢迎您，
            <span v-html="userAcc"></span>
          </span>

          <router-link to="/index/mycenter">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <el-avatar :src="imageUrl"></el-avatar>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-circle-close" command="clickexit">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar> -->
          </router-link>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { API_TOKEN,API_MYCENTER } from "@/api/apis";

export default {
  data() {
    return {
      userAcc: "",
      id: "",
      imageUrl: "",
      //treelist:左侧动态菜单数据
      //index:跳转的路由
      //icls：图标
      //title：菜单名称
      //childlist：一级菜单下的二级菜单数据
      treelist: [
        {
          index: "/index/home",
          icls: "el-icon-s-home",
          title: "后台首页",
          role: ["super", "normal"]
        },
        {
          index: "/index/order",
          icls: "el-icon-document",
          title: "订单管理",
          role: ["super", "normal"]
        },
        {
          index: "3",
          icls: "el-icon-shopping-bag-1",
          title: "商品管理",
          role: ["super", "normal"],
          childlist: [
            { index: "/index/goodslist", title: "商品列表" },
            { index: "/index/addgoods", title: "商品添加" },
            { index: "/index/goodsclass", title: "商品分类" }
          ]
        },

        {
          index: "/index/shops",
          icls: "el-icon-s-shop",
          title: "店铺管理",
          role: ["super"]
        },
        {
          index: "5",
          icls: "el-icon-user-solid",
          title: "账号管理",
          role: ["super"],
          childlist: [
            { index: "/index/accountlist", title: "账号列表" },
            { index: "/index/addaccount", title: "添加账号" },
            { index: "/index/changepwd", title: "修改密码" }
          ]
        },
        {
          index: "6",
          icls: "el-icon-pie-chart",
          title: "销售统计",
          role: ["super"],
          childlist: [
            { index: "/index/comsta", title: "商品统计" },
            { index: "/index/ordersta", title: "订单统计" }
          ]
        }
      ],
      role:  ["super"]
    };
  },
  methods: {
    //退出登录删除本地数据
    handleCommand() {
      localStorage.removeItem("acc");
      localStorage.removeItem("pwd");
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      location.hash = "/";
    }
  },
  created() {
    //this.imageUrl = localStorage.imageUrl;
    //发送token请求
    API_TOKEN(localStorage.token).then(res => {
      if (res.data.code == 0) {
        //在登录有效期内
        this.userAcc = localStorage.acc;
      } else {
        //登录已过期
        this.userAcc = "<a href='#/'>亲，请登录</a>";
      }
    });
    this.role = localStorage.role;
    
    //修改图片后自动更新
    let id = localStorage.id
    API_MYCENTER(id).then(res => {      
      this.imageUrl = res.data.accountInfo.imgUrl;
      
    });
    /* let id = localStorage.id
    API_MYCENTER(id).then( (res)=>{
     
      console.log(res)
      
    }) */
  },
  computed: {
    //设置登录权限，访问到不同菜单
    newtreelist() {
      var newarr = this.treelist.filter(i => {
        return i.role.includes(this.role);
      });
      return newarr;
      //return this.treelist.filter( i => i.role.includes(this.role))
    }
  }
  /*  methods: {
    changeBreadlist(hash) {
      let arr = [];
      switch (hash) {
        case "/index/home":
          arr = ["首页"];
          break;
        case "/index/order":
          arr = ["订单管理"];
          break;
        case "/index/goodslist":
          arr = ["商品管理", "商品列表"];
          break;

        case "/index/addgoods":
          arr = ["商品管理", "商品添加"];
          break;
        case "/index/goodsclass":
          arr = ["商品管理", "商品分类"];
          break;
        case "/index/shops":
          arr = ["店铺管理"];
          break;
        case "/index/accountlist":
          arr = ["账号管理", "账号列表"];
          break;
        case "/index/addaccount":
          arr = ["账号管理", "添加账号"];
          break;
        case "/index/changepwd":
          arr = ["账号管理", "修改密码"];
          break;
        case "/index/comsta":
          arr = ["销售统计", "商品统计"];
          break;
         case "/index/ordersta":
          arr = ["销售统计", "订单统计"];
          break; 
      }

      this.breadlist = arr;
    }
  },

  watch: {
    $route: {
      //监听路由对象的变化
      handler: val => {
        window.mythis.changeBreadlist(val.path);
      },
      deep: true
    }
  },
  created() {
    let hash = this.$route.path;

    this.defaultActive = hash;
    this.changeBreadlist(hash);

    window.mythis = this;
  } */
};
</script>

<style lang="less" scscoped>
@base: #545c64;
@base2: #f0f2f5;

.el-container {
  height: 100%;
  
  .el-aside {
    background-color: @base;
    .list_title {
      display: flex;
      align-items: center;
      justify-content: center;
      .el-avatar {
        background-color: #ffd04b;
      }
      p {
        text-align: center;
        color: #fff;
        margin-left: 10px;
        font-weight: normal;
      }
    }

    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: @base2;
  }
  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .icon_div {
      height: 100%;
      display: flex;
      align-items: center;
      span {
        margin-right: 10px;
      }
    }
  }
}
a {
  text-decoration: none;
  color: #545c64;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}

</style> 