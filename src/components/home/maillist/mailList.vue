<template>
    <el-card>
        <!-- 查询修改 -->
        <el-row>
            <el-col :span="5">
                <el-input v-model="searchVal" 
                          placeholder="请输入查询条件"  
                          :clearable="true"
                          @keyup.enter.native="handleMailListSearch">
                </el-input>
            </el-col>
            <el-col :span="2"><el-button @click="handleMailListSearch" native-type="submit" icon="el-icon-search"></el-button></el-col>
            <el-col :span="16">
                 <el-button 
                 @click="showAddMailList()"
                 type="primary">新增</el-button>
                 <el-button 
                    @click="MailListLoad()"
                    type="info">模版下载</el-button>
                    <el-button 
                    @click="MailListImport()"
                    type="success">Excel导入</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table
             v-loading="isLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            ref="multipleTable"
            id="contentTable"
            :data="list"
            tooltip-effect="dark"
             style="width: 100%; margin-top:30px;"
            border
            @selection-change="handleSelectionChange">
            
            <el-table-column
            type="selection"
            width="40">
            </el-table-column>
            
             <el-table-column
            prop="realName"
            label="真实姓名"
            width="180">
            </el-table-column>
             <el-table-column
            prop="mobile"
            label="手机号"
            width="180">
            </el-table-column>
            <el-table-column
            prop="postitionName"
            label="职务名称"
            width="150">
            </el-table-column>
            <el-table-column
            prop="departmentName"
            label="部门名称"
            width="150">
            </el-table-column>
             <el-table-column
            prop="unitName"
            label="单位名称"
            width="">
            </el-table-column>
            <!-- 状态值 -->
            <el-table-column
              align="center"
              label="状态"
              width="100">
              <template slot-scope="scope">
                  <el-tag v-if="scope.row.type ==0" type="warning" size="mini">已停用</el-tag>
                  <el-tag v-else-if="scope.row.type == 1" type="success" size="mini">启用中</el-tag>
              </template>
          </el-table-column>
            <el-table-column
              align="center"
              label="操作" 
              width="220" >
            <template slot-scope="scope">
              <!-- switch按钮 -->
              <el-button  plain 
                          size="small" 
                          type="text" 
                          @click="showEditMailList(scope.row)"
                          >修改</el-button>
              <el-button  plain 
                          size="small" 
                          @click="hanleLookMailList(scope.row)"
                          type="text" 
                          >查看</el-button>
                        <el-switch 
                          style="margin-left:10px;"
                          v-if="scope.row.type ==0" 
                          v-model="scope.row.userType"
                          :value="0"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          active-text="禁用"
                          @change="setTypeMailList($event,scope.row)" >
              </el-switch>
                 <el-switch  
                            style="margin-left:10px;"
                            v-else-if="scope.row.type == 1"
                            v-model="scope.row.userType"
                            :value="0"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="启用"
                            @change="setTypeMailList($event,scope.row)"
                >
              </el-switch>
            </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
         <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[6, 8, 10, 12]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        <!-- 新增的弹出框 -->
        <el-dialog title="新增人员" 
                   :visible.sync="addMaillistShow" 
                   width="50%"
                   :fullscreen="false">
           <el-form :model="webUserManageInfoForm">
             <el-form-item label="请选择单位:" :label-width="formLabelWidth">
               <el-select v-model="webUserManageInfoForm.unitCode" 
                           placeholder="请选择单位">
                    <el-option
                    v-for="(item,index) in userUnitModelList"
                    :key="index"
                    :label="item.unitName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item label="请选择部门:" :label-width="formLabelWidth">
               <el-select v-model="webUserManageInfoForm.departmentCode" 
                           placeholder="请选择部门">
                    <el-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.departmentCode">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="排序:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.orders" autocomplete="off" placeholder="排序"></el-input> 
            </el-form-item>
             <el-form-item label="用户名:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.name" autocomplete="off" placeholder="用户名"></el-input> 
            </el-form-item>
             <el-form-item label="真实姓名:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.realName" autocomplete="off" placeholder="真实姓名"></el-input> 
            </el-form-item>
             <el-form-item label="请选择职位:" :label-width="formLabelWidth">
               <el-select v-model="webUserManageInfoForm.postitionCode" 
                           placeholder="请选择职位">
                    <el-option
                    v-for="item in userPositionModelList"
                    :key="item.id"
                    :label="item.positionName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="手机号:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.mobile" autocomplete="off" placeholder="手机号"></el-input> 
            </el-form-item>
              <el-form-item label="用户邮箱:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.userEmail" autocomplete="off" placeholder="用户邮箱"></el-input> 
            </el-form-item>
             <el-form-item label="办公电话:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.officeMobile" autocomplete="off" placeholder="办公电话"></el-input> 
            </el-form-item>
            <el-form-item label="系统电话（内号）:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.systemMobile" autocomplete="off" placeholder="系统电话（内号）"></el-input> 
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addMaillistShow = false">取 消</el-button>
            <el-button type="primary" @click="handleAddMailList()">确 定</el-button>
          </div>
        </el-dialog>
       <!-- 修改指定人员 -->
        <el-dialog title="修改指定人员" 
                   @closed="editMaillistshowc()"
                   :visible.sync="editMaillistshow" 
                   width="50%"
                   :fullscreen="false">
                <el-form :model="webUserManageInfoForm">
             <el-form-item label="请选择单位:" :label-width="formLabelWidth">
               <el-select v-model="webUserManageInfoForm.unitCode" 
                           placeholder="请选择单位">
                    <el-option
                    v-for="(item,index) in userUnitModelList"
                    :key="index"
                    :label="item.unitName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item label="请选择部门:" :label-width="formLabelWidth">
               <el-select v-model="webUserManageInfoForm.departmentCode" 
                           placeholder="请选择部门">
                    <el-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.departmentCode">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="排序:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.orders" autocomplete="off" placeholder="排序"></el-input> 
            </el-form-item>
             <el-form-item label="用户名:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.name" autocomplete="off" placeholder="用户名"></el-input> 
            </el-form-item>
             <el-form-item label="真实姓名:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.realName" autocomplete="off" placeholder="真实姓名"></el-input> 
            </el-form-item>
             <el-form-item label="请选择职位:" :label-width="formLabelWidth">
               <el-select v-model="webUserManageInfoForm.postitionCode" 
                           placeholder="请选择职位">
                    <el-option
                    v-for="item in userPositionModelList"
                    :key="item.id"
                    :label="item.positionName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="手机号:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.mobile" autocomplete="off" placeholder="手机号"></el-input> 
            </el-form-item>
              <el-form-item label="用户邮箱:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.userEmail" autocomplete="off" placeholder="用户邮箱"></el-input> 
            </el-form-item>
             <el-form-item label="办公电话:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.officeMobile" autocomplete="off" placeholder="办公电话"></el-input> 
            </el-form-item>
            <el-form-item label="系统电话（内号）:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.systemMobile" autocomplete="off" placeholder="系统电话（内号）"></el-input> 
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editMaillistshow = false">取 消</el-button>
            <el-button type="primary" @click="handleEditMaillist()">确 定</el-button>
          </div>
        </el-dialog>
       
         <el-dialog title="人员导入"  
                   :visible="importMaillistShow">
        <el-form >
           <el-upload
                :http-request="importMaillistFile"
                @close="importMaillistshowc()"
                :show-file-list="false"
                class="upload-demo"
                drag
                center
                action=""
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将Excel文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form >
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="importMaillistShow = false">关闭</el-button>
          </div>
        </el-dialog>
        <!-- 查看功能弹出框 -->
        <el-dialog title="查看"
                   @close="closeLookCB()"
                   :visible="PreviewMaillistShow">
            <el-form :model="webUserManageInfoForm" :disabled="true">
             <el-form-item label="请选择单位:" :label-width="formLabelWidth">
               <el-select v-model="webUserManageInfoForm.unitCode" 
                           placeholder="请选择单位">
                    <el-option
                    v-for="(item,index) in userUnitModelList"
                    :key="index"
                    :label="item.unitName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item label="请选择部门:" :label-width="formLabelWidth">
               <el-select v-model="webUserManageInfoForm.departmentCode" 
                           placeholder="请选择部门">
                    <el-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.departmentCode">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="排序:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.orders" autocomplete="off" placeholder="排序"></el-input> 
            </el-form-item>
             <el-form-item label="用户名:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.name" autocomplete="off" placeholder="用户名"></el-input> 
            </el-form-item>
             <el-form-item label="真实姓名:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.realName" autocomplete="off" placeholder="真实姓名"></el-input> 
            </el-form-item>
             <el-form-item label="请选择职位:" :label-width="formLabelWidth">
               <el-select v-model="webUserManageInfoForm.postitionCode" 
                           placeholder="请选择职位">
                    <el-option
                    v-for="item in userPositionModelList"
                    :key="item.id"
                    :label="item.positionName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="手机号:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.mobile" autocomplete="off" placeholder="手机号"></el-input> 
            </el-form-item>
              <el-form-item label="用户邮箱:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.userEmail" autocomplete="off" placeholder="用户邮箱"></el-input> 
            </el-form-item>
             <el-form-item label="办公电话:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.officeMobile" autocomplete="off" placeholder="办公电话"></el-input> 
            </el-form-item>
            <el-form-item label="系统电话（内号）:" :label-width="formLabelWidth">
                <el-input v-model="webUserManageInfoForm.systemMobile" autocomplete="off" placeholder="系统电话（内号）"></el-input> 
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="PreviewMaillistShow = false">关闭</el-button>
          </div>
        </el-dialog> 
        
    </el-card>
</template>
<script>
export default {
    data(){
        return {
           //批量上传预览数据
            tableData: [],
            tableHeader: [],
            value1:true,
            value2:false,
            checked: true,
            // 下载
            result:'',
          // 表格加载动画
            isLoading:true,
          // 分页相关的属性
            pagenum: 1,
            pagesize: 6,
            formLabelWidth:"130px",
            total: 20,
            list: [],
            positionvalue: [],
            unitvalue:[],
            departvalue:[],
            searchVal:'',
            type:1,
            id:300,
            // 新增弹出框显示
            addMaillistShow:false,
            // 修改弹出框显示
            editMaillistshow:false,
            // 批量导入弹框显示
            importMaillistShow:false,
           // 查看弹框显示
            PreviewMaillistShow:false,
            // 新增数据
            webUserManageInfoForm:{
              "departmentCode":"",
               "id":300,
               "mobile": "",
               "name": "",
               "officeMobile":"",
               "orders": 0,
               "postitionCode":"",
               "realName":"",
               "systemMobile":"",
               "unitCode":"",
               "userEmail":"",
               "type":1
            },
            //部门信息
            departmentList:[],
            //职位信息信息
            userPositionModelList:[],
            //	单位信息
            userUnitModelList:[],
            fileListURL:[],
        }
        
    },
    mounted(){
      // 加载列表完成
     this.loadMailList()
     this.getMaillistdepart()
    },
   
    methods:{
     
      // 2 新增部门，单位，职位
      async getMaillistdepart(){
          const res = await this.$http.post(`/api/v1/webUserManageApi/get/otherInfo`)
          const { data } = res
          console.log(res)
          if(data.code == '200'){
              this.isLoading = false
              this.userUnitModelList = data.result.userUnitModelList // 单位
              console.log(this.userUnitModelList)
              this.departmentList = data.result.departmentList  //部门
              this.userPositionModelList = data.result.userPositionModelList // 职位
          }
      },
      // 页面加载列表
     async loadMailList(){
        const res = await this.$http.post('/api/v1/webUserManageApi/get/allUserInfo',{
          "findParam": this.searchVal,
          "pageNum": this.pagenum,
          "pageSize": this.pagesize
        })
        const { status, data } = res;
        if(status == 200){
          // 加载动画消失
          this.isLoading = false
          this.list = data.result.list
          // 一共多少条
          this.total = data.result.total
        }
      },
      //搜索功能
      handleMailListSearch(){
       this.loadMailList()
     
      }, 
      // 新增人员
      // 1. 显示新增公告对话框
      showAddMailList(){
        this.addMaillistShow = true
      },
      // 3. 处理新增请求
     async handleAddMailList(){
            // 参数处理 userId professionId
            // this.webUserManageInfoForm.id = 1
        this.webUserManageInfoForm.id = sessionStorage.getItem('createId')
        // 发送请求
        //处理参数。内容
        const res = await this.$http.post('/api/v1/webUserManageApi/add/userInfo',this.webUserManageInfoForm)
        const { data } = res;
        if(data.code == 200){
         // console.log(res)
          this.addMaillistShow = false
          this.$message.success(data.msg)
          this.pagenum = 1
          this.loadMailList()
          // // 清空表单
          this.webUserManageInfoForm = {}
        }
      },

     // 切换switch按钮 改变状态值 loadMailList

   async setTypeMailList(states,row){
    console.log(states)
    var type = states? 1:0
    const res = await this.$http.put(`/api/v1/webUserManageApi/change/usetType`,{
          "id": row.id,
          "type": type,
      })
    const { data:{ code, msg } } = res
    if(code === 200){
        this.loadMailList()
        this.$message.success(msg)
        
    }
},
    // 批量导入
       async importMaillistFile(param){
           const file = param.file
          if(!/\.(xlsx|xls|csv)$/.test(file.name)){
              this.$message.error('文件类型错误')
              return
          }
          let fd = new FormData()
          fd.append('multipartFile',file)//传文件
          const res = await this.$http.post(`/api/v1/webUserManageApi/get/allUserInfoFile`,fd)
          const { data:{code,msg} } = res
          if(code == 200){
            this.$message.success(msg)
            this.loadMailList()
            this.importMaillistShow = false
            return
          
          }
          // 错误提示
          this.$message.error(msg)
        },
        
        // 修改逻辑功能
       // 修改弹框显示
       showEditMailList(rows){
           this.editMaillistshow = true
           // 显示信息
           console.log(rows)
           this.webUserManageInfoForm = rows
           //设置排序
           this.webUserManageInfoForm.orders = 0
       },
       async handleEditMaillist(){
            // 参数处理 userId unitCode
            this.webUserManageInfoForm.orders = 12
            //处理type
            this.webUserManageInfoForm.type = this.webUserManageInfoForm.type == true? 1:0
            // 发送请求
            const res = await this.$http.put(`/api/v1/webUserManageApi/change/userInfo`,this.webUserManageInfoForm)
            const { data:{ code, msg } } = res
            if(code == 200){
            this.$message.success(msg)
            this.loadMailList()
            this.editMaillistshow = false
            // 清空表单
            this.webUserManageInfoForm = {}

            }
       },
     
     //下载
      async MailListLoad(){
           const res = await this.$http.get(`/api/v1/webUserManageApi/down/userTemp`)
           const { data } = res
            if(data.code == '200'){
               window.location.href=data.result
            }
      },
       // 查看功能
        hanleLookMailList(rows){
          console.log(rows)
          this.PreviewMaillistShow = true
          this.webUserManageInfoForm = rows
        },
        // 查看弹出框关闭cb
        closeLookCB(){
          this.lookMaillistShow = false
          // 清空表单
          this.webUserManageInfoForm = {}
        },
       // 分页
        handleSizeChange (val) {
          // console.log(`每页 ${val} 条`)
          this.pagesize = val
          this.loadMailList()
        },
        handleCurrentChange (val) {
          // console.log(`当前页: ${val}`)
          this.pagenum = val
          this.loadMailList()
        },
        editMaillistshowc(){
          this.webUserManageInfoForm = {}
        },
         importMaillistshowc(){
          this.webUserManageInfoForm = {}
        },
        // 批量导入功能
        MailListImport() {
            this.importMaillistShow = true
        }, 
         handleSelectionChange(){
      },
    }
}
</script>

<style scoped>
.ql-container{
  min-height: 150px;
}
/* 超出固定行数显示省略号 */
.context-wrap {
  width: 100%;
  white-space: normal;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  overflow: hidden;
           
}
.on {
    width: 100%;
    white-space: normal;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 0;
    text-overflow: ellipsis;
    overflow: hidden;
}


body .el-table th.gutter{
    display: table-cell!important;
}
.el-table{
  margin-bottom: 25px;
  min-height: 400px
}


</style>
