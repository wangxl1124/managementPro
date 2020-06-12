import axios from 'axios'
//服务器IP地址
export const SERVER_IP = 'http://localhost:5000'

//服务器上传店铺图片地址
export const SERVER_UPLOAD = SERVER_IP + '/shop/upload'
//服务器图片地址
export const SERVER_SHOP_IMG = SERVER_IP + '/upload/shop/'

//服务器个人中心头像上传
export const SERVER_MY_PHOTO = SERVER_IP + '/users/avatar_upload'

axios.defaults.baseURL = SERVER_IP

//1.API_LOGIN：登录
//account：用户名
//password：密码
export const API_LOGIN = (account,password) => axios.post('/users/checkLogin',{account,password})

//2.API_ADDACCOUNT: 账号管理 - 添加账号
//account:用户名
//password：密码
//userGroup：用户组(超级管理员/普通管理员)
export const API_ADDACCOUNT = (account,password,userGroup) => axios.post('/users/add',{account,password,userGroup})

//3.API_ACCOUNTLIST:账号列表 用户账号信息渲染页面
//currentPage:当前页码
//pageSize：每页条数
export const API_ACCOUNTLIST = (currentPage,pageSize) => axios.get('users/list',{params:{currentPage,pageSize}})

//4.API_DELACCOUNT：删除账号
//id：要删除的id
export const API_DELACCOUNT = (id) => axios.get('/users/del',{params:{id}})

//5.API_BATCHDEL：批量删除
//ids：要删除的id
export const API_BATCHDEL = (ids) => axios.get('/users/batchdel',{params:{ids}})

//6.API_EDITACC：编辑账号
//id：要编辑用户的id
//account：账号
//userGroup：用户组
export const API_EDITACC = (id,account,userGroup) => axios.post('/users/edit',{id,account,userGroup})

//7.API_OLDPWD：原密码
//id：登录的id
//oldPwd：登录的密码
export const API_OLDPWD = (id,oldPwd) => axios.get('/users/checkoldpwd',{params:{id,oldPwd}})

//8.API_NEWPWD:修改新密码
//id ：登录的id
//newPwd:新密码
export const API_NEWPWD = (newPwd,id) => axios.post('/users/editpwd',{newPwd,id})

//9.API_MYCENTER：个人中心
//id：登录的id信息
export const API_MYCENTER = (id) => axios.get('/users/accountinfo',{params:{id}})

//10.API_UPLOAD：头像上传接口
export const API_UPLOAD = (id) => axios.post('/users/avatar_upload',{id})

//11.API_TOKEN: token验证登录是否过期
//token ：时效性
export const API_TOKEN = (token) => axios.get('/users/checktoken',{params:{token}})

//12.API_ADD_GOODS:添加商品
//cateName :名称分类
//state ：是否启用
export const API_ADD_GOODS = (cateName,state) => axios.post('/goods/addcate',{cateName,state})

//13.API_GOOD_CLASS:获取商品管理得商品分类
//currentPage：当前页
//pageSize：每页条数
export const API_GOOD_CLASS = (currentPage,pageSize) => axios.get('/goods/catelist',{params:{currentPage,pageSize}})

//14.API_DEL_GOODS：商品分类-删除商品
//id：删除商品的id
export const API_DEL_GOODS = (id) => axios.get('/goods/delcate',{params:{id}})

//15.API_EDIT_GOODS: 修改商品分类
//id：要修改商品的id
//cateName：要修改的商品分类名称
//state:是否启用
export const API_EDIT_GOODSCATE = (id,cateName,state) => axios.post('/goods/editcate',{id,cateName,state})

//16.API_QUERY_GOODS:查询所有分类名称
export const API_QUERY_GOODS = () => axios.get('/goods/categories')

//API_EDITCATE:编辑商品分类
//id：编辑的id
//cateName：分类名称
//state：分类状态
export const API_EDITCATE = (id,cateName,state) => axios.post('/goods/editcate',{id,cateName,state})

//18.API_ADDGOODS：添加商品
//name:商品名称
//category:商品分类
//price:商品价格
//imgUrl:商品图片地址
//goodsDesc:商品描述
export const API_ADDGOODS = (name,category,price,imgUrl,goodsDesc) => axios.post('/goods/add',{name,category,price,imgUrl,goodsDesc})

//19.API_GOODS_LIST:获取商品列表
//currentPage:当前页码
//pageSize：每页条数
export const API_GOODS_LIST = (currentPage,pageSize) => axios.get('/goods/list',{params:{currentPage,pageSize}})

//20.API_DEL_GOODSMSG ：商品列表-删除商品
export const API_DEL_GOODSMSG = (id) => axios.get('/goods/del',{params:{id}})

//21.API_EDIT_GOODS:修改商品信息
//name: 商品名称
//category:商品分类
//price:商品价格
//imgUrl:商品图片地址
//goodsDesc:商品描述
//id:商品ID
export const API_EDIT_GOODS = (name,category,price,imgUrl,goodsDesc,id) => axios.post('/goods/edit',{name,category,price,imgUrl,goodsDesc,id})

//22.API_ORDER_LIST:获取订单列表
//currentPage:当前页码
//pageSize:每页条数
//orderNo:订单号
//consignee:收货人
//phone:手机号
//orderState:订单状态
//date:时间范围
export const API_ORDER_LIST = (currentPage,pageSize,orderNo,consignee,phone,orderState,date) => axios.get('/order/list',{params:{currentPage,pageSize,orderNo,consignee,phone,orderState,date}})

//23.订单查询
//currentPage:当前页码
//pageSize:每页条数
//orderNo:订单号
//consignee:收货人
//phone:手机号
//orderState:订单状态
//date:时间范围
export const API_ORDER_SEARCH = (currentPage,pageSize,orderNo,consignee,phone,orderState,date) => axios.get('/order/search',{params:{currentPage,pageSize,orderNo,consignee,phone,orderState,date}})

//24.获取订单详情
export const API_ORDER_DETAIL = (id) => axios.get('/order/detail',{params:{id}})

//25.修改订单
export const API_EDIT_ORDER = (id,orderNo,orderTime,phone,consignee,deliverAddress,deliveryTime,remarks,orderAmount,orderState) => axios.post('/order/edit',{id,orderNo,orderTime,phone,consignee,deliverAddress,deliveryTime,remarks,orderAmount,orderState})

//26.获取店铺详情
export const API_SHOP_INFO = () => axios.get('/shop/info')

//28.店铺内容修改
//id: 店铺id
//name: 店铺名称
//bulletin: 店铺公告
//avatar: 店铺头像
//deliveryPrice: 起送价格
//deliveryTime: 送达时间
//description: 店铺描述
//score: 店铺好评率
//sellCount: 店铺销量
//supports: 活动支持
//pics: 图片
//date: 营业时间
export const API_SHOP_EDIT = (params) => axios.post('/shop/edit',params)


//29.首页报表接口
export const API_GET_ORDER = () => axios.get('/order/totaldata')

//30.订单报表接口
export const API_ORDER_TOTAL = (date) => axios.get('/order/ordertotal',{params:{date}})



