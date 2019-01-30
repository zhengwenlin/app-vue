<template>
    <div class="login-wrap">

    <el-form :label-position="labelPosition" 
             class="login-form"
             label-width="80px" 
             :model="formData">
                  <h3>用户登录</h3>
        <el-form-item label="用户名">
            <el-input v-model="formData.mobile"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="formData.password"></el-input>
        </el-form-item>
        <el-button 
        @click="handleLogin"
        class="login-btn"
        type="primary">登录</el-button>
    </el-form>
    
    </div>
</template>

<script>
// import axios from 'axios'
export default {
   data(){
       return {
         
           labelPosition: 'left',
            formData: {
            mobile: '',
            password: ''
            }
        }
   },
   
   methods:{
      async handleLogin(){
          const res = await this.$http.post('/api/v1/user/get/login',{
              "imei": 1111111,
                "mobile": 13111111111,
                "password": 123456
                
           }) 
          
           const { data } = res;
           console.log(data)
           if(data.code === 200){
               //保存 用户信息 id
               sessionStorage.setItem('createId',data.result.id)
               this.$message.success(data.msg)
               this.$router.push('/')
               return
           }
           this.$message.warning(data.msg)
           this.$router.push('/login')
       }
   }
}
</script>

<style>

   
   .login-wrap {
  background-color: #45c2b5;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-form {
  background-color:#fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}

.login-wrap .login-form .login-btn {
  width: 400px;
}
</style>
