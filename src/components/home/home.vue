<template>
        <el-container>
    <el-header class="home-header" >
      
        <el-row>
        <el-col :span="4">
          <div class="home-left">国调APP</div>
        </el-col>
        <el-col :span="18" >
           <a href="" @click.prevent="handleLogin" class="logout-btn">退出登录</a>
         <span></span>
        </el-col>
        <el-col :span="2">
        </el-col>
         </el-row>
    </el-header>
    <el-container>
        <el-aside width="220px">
             <el-menu 
             :unique-opened="true"
             active-text-color="skyblue"
             :router="true"
             default-active="1-4-1" 
             class="el-menu-vertical-demo" 
             background-color="#545c64"
             text-color="#fff">
              <el-menu-item index="/">
                <i class="el-icon-menu"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="1">
                <template slot="title">
                <i class="el-icon-setting"></i>
                <span slot="title">系统管理</span>
                </template>
                <el-menu-item index="/profession">专业管理</el-menu-item>
            </el-submenu>
             <el-submenu index="2">
                <template slot="title">
                <i class="el-icon-news"></i>
                <span slot="title">通知公告</span>
                </template>
                <el-menu-item index="/announcement">公告管理</el-menu-item>
            </el-submenu>
             <el-submenu index="3">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">习题练习</span>
                </template>
                <el-menu-item index="/questionbank">题库管理</el-menu-item>
                <el-menu-item index="/questionlist">习题管理</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
               <i class="el-icon-service"></i>
                <span slot="title">在线培训</span>
                </template>
                <el-menu-item index="/traincourse">培训班管理</el-menu-item>
                <el-menu-item index="/courseware">课件管理</el-menu-item>
                <el-menu-item index="/column">栏目资料</el-menu-item>
                <el-menu-item index="/coursewaredata">课件资料</el-menu-item>
            </el-submenu>  
            <el-submenu index="5">
                <template slot="title">
               <i class="el-icon-check"></i>
                <span slot="title">在线考试</span>
                </template>
                <el-menu-item index="/createexam">创建试卷</el-menu-item>
                <el-menu-item index="/exammanage">试卷管理</el-menu-item>
            </el-submenu>
            <el-submenu index="6">
                <template slot="title">
               <i class="el-icon-sort"></i>
                <span slot="title">排班管理</span>
                </template>
                <el-menu-item index="/arrangeWork">排班</el-menu-item>
            </el-submenu>
             <el-submenu index="7">
                <template slot="title">
               <i class="el-icon-star-off"></i>
                <span slot="title">互动讨论</span>
                </template>
                <el-menu-item index="/questionnaire">问卷管理</el-menu-item>
                <el-menu-item index="/voting">投票管理</el-menu-item>
                <el-menu-item index="/activitys">活动管理</el-menu-item>
                <el-menu-item index="/collection">采集管理</el-menu-item>
            </el-submenu>  
            <el-submenu index="8">
                <template slot="title">
               <i class="el-icon-document"></i>
                <span slot="title">人员管理</span>
                </template>
                <el-menu-item index="/mailList">通讯录</el-menu-item>
            </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
    </el-container>
</template>

<script>
export default {
    data(){
        return {
           
        }
    },
    methods:{
        
        // 退出登录
        handleLogin(){
            sessionStorage.removeItem('createId')
            this.$router.push('/login')
            this.$message.success('退出登录成功')
        }
    }
}
</script>

<style>
.el-header{
    padding: 0!important;
    
}
.home-header,body,html{
    padding: 0;
    margin: 0;
}
.home-left{
    display: block;
    float: left;
    margin: 0;
    padding: 0;
    background-color: #45c2b5;
    height: 60px;
    font-size: 16px;
    width:220px;
    color: #fff;
    text-align: center;
    line-height: 60px;
    font-weight: 600;
    border-right: 1px solid #fff;
}
.icon-home{
    display: block;
    height: 100%;
    width: 50px;
    font-size: 20px;
    line-height: 50px;
    margin-left: 15px;
}
.el-icon-setting{
    
    font-size: 20px;
    line-height: 50px;
    margin-right:20px;

}

/* 侧边菜单 */
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 220px;
    min-height: 400px;

  }
  .logout-btn{
      text-decoration: none;
      color: #45c2b5;
      display: block;
      height: 60px;
      line-height: 60px;
      float: right;
  }

  .el-container,.el-aside{
      height: 100%;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse){
      width:100%;
      height: 100%;
  }
  element.style{
      height: auto;
  }
  
  
</style>
