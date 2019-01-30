<template>
    <el-card>
         <el-button 
                 @click="showAddTraincourse()"
                 type="primary">新增</el-button>
                 <el-button 
                   @click="batchDelete(tableChecked)"
                    type="danger">批量删除</el-button>
        <!-- 表格 -->
          <el-table
             v-loading="isLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            ref="multipleTable"
            id="contentTable"
            :data="traincourseList"
            tooltip-effect="dark"
             style="width: 100%; margin-top:30px;"
            border
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="40">
            </el-table-column>
             <el-table-column
            prop="name"
            label="名称"
            width="350">
            </el-table-column>
             <el-table-column
            prop="url"
            label="图片展示"
            width="120">
            <template slot-scope="scope"><img v-bind:src=scope.row.url 
                                              style="display:block; width:100px;height:60px" 
                                              alt="图片无法正常显示"></template>
            </el-table-column>
             <el-table-column
            prop="status"
            align="center"
            label="状态"
            width="80">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 1" type="success" size="mini">显示</el-tag>
                    <el-tag v-else-if="scope.row.status == 2" type="warning" size="mini">隐藏</el-tag>
                </template>
            </el-table-column>
             <el-table-column
            prop="createTime"
            label="创建时间"
            width="">
            </el-table-column> <el-table-column
            prop="updateTime"
            label="更新时间"
            width="">
            </el-table-column>
            <el-table-column
              label="操作" width="180" >
            <template slot-scope="scope">
              <el-button  plain 
                          size="small" 
                          type="text" 
                          @click="showEditTraincourse(scope.row)"
                          >修改</el-button>
              <el-button  plain 
                          size="small" 
                          type="text" 
                          @click="hanleDeleteTraincourse(scope.row)"
                          >删除</el-button>
              <el-button  plain 
                          size="small" 
                          @click="hanlePreviewTrain(scope.row)"
                          type="text" 
                          >查看</el-button>
            <el-button  plain 
                        size="small" 
                        @click="showTraincouRights(scope.row)"
                        type="text" 
                        style="color:#67C23A"
                        >权限</el-button>
            </template>

            </el-table-column>
           
        </el-table>
        <!-- 分页 -->
         <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[4, 6, 8, 10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
          <!-- 新增培训班弹出框 -->
        <el-dialog title="新增培训班" 
                   @close="addCloseCB()"
                   :visible.sync="addTraincourseShow" 
                   width="50%"
                   :fullscreen="false">
          <el-form :model="addTraincourse">
           
             <el-form-item label="名称:" :label-width="formLabelWidth">
                <el-input v-model="addTraincourse.name" autocomplete="off" placeholder="培训班名称"></el-input> 
            </el-form-item>
            
             <el-form-item label="状态:" :label-width="formLabelWidth">
                <el-select v-model="addTraincourse.status" placeholder="显示/隐藏" :clearable="true">
                    <el-option label="显示" :value="1"></el-option>
                    <el-option label="隐藏" :value="2"></el-option>
             </el-select>
            </el-form-item>
             <el-form-item label="头图:" :label-width="formLabelWidth">
              <el-upload
                class="upload-bannerURL"
                
                :limit="1"
                action=""
                :http-request="uploadTrainFile"
                ref="addUpload"
                :file-list="addFileListURL"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
             <!-- <el-form-item label="地址:" :label-width="formLabelWidth">
              <el-input v-model="addTraincourse.url" autocomplete="off"></el-input>
            </el-form-item> -->
            
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addTraincourseShow = false">取 消</el-button>
            <el-button type="primary" @click="handleAddTraincourse()">确 定</el-button>
          </div>
        </el-dialog>
       
          <!-- 修改培训班弹出框 -->
        <el-dialog title="修改培训班" 
                   @close="editCloseCB()"
                   :visible.sync="editTraincourseShow" 
                   width="50%"
                   :fullscreen="false">
          <el-form :model="addTraincourse">
           
             <el-form-item label="名称:" :label-width="formLabelWidth">
                <el-input v-model="addTraincourse.name" autocomplete="off" placeholder="培训班名称"></el-input> 
            </el-form-item>
            
             <el-form-item label="状态:" :label-width="formLabelWidth">
                <el-select v-model="addTraincourse.status" placeholder="显示/隐藏" :clearable="true">
                    <el-option label="显示" :value="1"></el-option>
                    <el-option label="隐藏" :value="2"></el-option>
             </el-select>
            </el-form-item>
             <el-form-item label="头图:" :label-width="formLabelWidth">
              <el-upload
                class="upload-bannerURL"
                
                :limit="1"
                action=""
                :http-request="uploadTrainFile"
                ref="addUpload"
                :file-list="addFileListURL"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addTraincourseShow = false">取 消</el-button>
            <el-button type="primary" @click="handleEditTraincourse()">确 定</el-button>
          </div>
        </el-dialog>
           <!-- 查看培训班弹出框 -->
        <el-dialog title="查看培训班" 
                   @close="previewCloseCB()"
                    @open="handleOpen()"
                   :visible.sync="previewTraincourseShow" 
                   width="50%"
                   :fullscreen="false">
          <el-form :model="addTraincourse" :disabled="true">
           
             <el-form-item label="名称:" :label-width="formLabelWidth">
                <el-input v-model="addTraincourse.name" autocomplete="off" placeholder="培训班名称"></el-input> 
            </el-form-item>
            
             <el-form-item label="状态:" :label-width="formLabelWidth">
                <el-select v-model="addTraincourse.status" placeholder="显示/隐藏" :clearable="true">
                    <el-option label="显示" :value="1"></el-option>
                    <el-option label="隐藏" :value="2"></el-option>
             </el-select>
            </el-form-item>
             <el-form-item label="头图:" :label-width="formLabelWidth">
              <img src="" alt="" ref="previewUrl" style="width:140px; height:80px;">
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="previewTraincourseShow = false">关闭</el-button>
            
          </div>
        </el-dialog>
          <!-- 权限tree -->
        <el-dialog title="公告权限" 
                   @close="closeRightsCB()"
                   @opened="treeOpenCB()"
                   :visible="traincourRightsShowDia"
                   width="40%"
                   :fullscreen="false">
          <el-tree
            ref="tree"
            :data="departmentUsersList"
            show-checkbox
            default-expand-all
            node-key="id"
            :default-checked-keys="checkedList"
            :props="defaultProps">
          </el-tree>
          <div slot="footer" class="dialog-footer">
            <el-button @click="traincourRightsShowDia = false">取 消</el-button>
            <el-button type="primary" @click="handleSetTraincouRight()">确 定</el-button>
          </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    mounted(){
        this.loadTrainlist()
        // 部门列表
        this.getDepartmentUsersListAll()
    },
    data(){
    return{
            // commmon配置参数
            // 新增弹出框显示
            addTraincourseShow:false,
            // 修改弹出框显示
            editTraincourseShow:false,
            // 查看弹出框显示
            previewTraincourseShow:false,
            // 权限显示
            traincourRightsShowDia:false,
            // 表格加载动画
            isLoading: true,
            // 批量删除ids
            ids:[],
            // 批量删除行信息
            tableChecked:[],
            formLabelWidth:'80px',
            // 分页相关的属性
            pagenum: 1,
            pagesize: 4,
            total: 20,
            //表格数据
            traincourseList:[],
            // 培训班新增功能数据
            addTraincourse:{
               name:'',
               status:'',
               url:'',
               userId:''
            },
            // 新增图片上传
            addFileListURL:[],
            // 权限
            // 部门列表
            departmentUsersList:[],
            defaultProps: {
            children: 'userList',
            label: 'name'
            },
            // 选中
            checkedList:[],
            // 当前row信息
            currentRow:'',
            // 培训班id
            courseTrainingId:''


        }
    },
    // 方法
    methods:{
        // 1 列表加载
        async loadTrainlist(){
            const res = await this.$http.post(`/api/v1/courseTrainingWeb/getCourseTrainingList`,{
                "pageNum": this.pagenum,
                "pageSize": this.pagesize
                })
          const { data:{code, result} } = res
          console.log(res)
          console.log(code, result)
          if(code == 200){
              this.isLoading = false
              this.traincourseList = result.courseTrainingList
              this.total = result.total
          }
            
        },
        // 新增功能逻辑 --
        // 1. 新增弹出框显示
        showAddTraincourse(){
            this.addTraincourseShow = true
            
        },
        // 2. 新增发送请求
        async handleAddTraincourse(){
            // userId
            this.addTraincourse.userId = sessionStorage.getItem('createId')
            const res = await this.$http.post(`/api/v1/courseTrainingWeb/courseTrainingAddCommit`,this.addTraincourse)
            console.log(res)
            const { data: { code, msg } } = res
            if(code === 200) {
                this.addTraincourseShow = false
                this.loadTrainlist()
                this.$message.success(msg)
                return 
            }
            this.$message.warning(msg)
        },
        
        // 删除功能逻辑 -- 
        // 1. 单个删除逻辑
         hanleDeleteTraincourse(rows){
            this.$confirm('确定删除该培训班?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 删除逻辑
           console.log(rows)
            const res = await this.$http.delete(`/api/v1/courseTrainingWeb/courseTrainingDeleteById?id=${rows.id}`)
             const { data: { code, msg } } = res
            if(code === 200) {
                this.loadTrainlist()
                this.$message.success(msg)
                return 
            }
            this.$message.warning(msg)
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        })
           
        },
        // 2. 批量删除
        async  batchDelete(rows){
            // this.$confirm('确定批量删除?', '提示', {
            // confirmButtonText: '确定',
            // cancelButtonText: '取消',
            // type: 'warning'
            // }).then(async () => {

            rows.forEach(element =>{
            this.ids.push(element.id)
            })
            console.log(this.ids)
            // ids=203&ids=204
            var str = 'ids='
            for(var i = 0; i < this.ids.length; i++){
                str += this.ids[i] + '&ids='
            }
            str = str.slice(0,-5)
            console.log(str)

              // 批量删除逻辑
            const res = await this.$http.delete(`/api/v1/courseTrainingWeb/courseTrainingDeleteBatchById?${str}`)
            const { data } = res
            if(data.code == 200){
                this.$message.success(data.msg)
                this.loadTrainlist()
            }
            
            // }).catch(() => {
            // this.$message({
            //     type: 'info',
            //     message: '已取消删除'
            // });          
            // });
              
           
        },
        handleSelectionChange(val){
            this.tableChecked = val
            
        },
        // 图片上传功能
        async uploadTrainFile(param){
            const file = param.file
            console.log(file)
            const fd = new FormData()
            fd.append('uploadType',2)
            fd.append('uploadFile',file)//传文件

            const res = await this.$http.post(`/api/v1/background/upload`,fd)
            console.log(res)
            const { data:{ code, msg, result } } = res
            if(code == 200){
            this.$message.success(msg)
            console.log(res)
            //上传成功的时候，帮地址保存下来，用于提交
            this.addTraincourse.url = result.url
            return
          }
          // 错误提示，清空上传图片列表
          this.$message.error(msg)
        },
        // 修改功能逻辑
        // 1. 修改弹出框显示
        showEditTraincourse(rows){
            this.editTraincourseShow = true
            // 信息显示
            this.addTraincourse = rows
            // 图片显示
            this.addFileListURL = [{url:this.addTraincourse.url}]
        },
        //2. 修改发送请求
       async handleEditTraincourse(){
           // 用户id
           this.addTraincourse.userId = sessionStorage.getItem('createId')
           const res = await this.$http.put(`/api/v1/courseTrainingWeb/courseTrainingUpdateCommit`,this.addTraincourse)
           console.log(res)
           const { data:{ code, msg } } = res
           if(code === 200) {
               this.editTraincourseShow = false
               this.$message.success(msg)
               this.loadTrainlist()
           }
        },
        // 查看功能逻辑
        hanlePreviewTrain(rows){
            // 显示弹出框
            this.previewTraincourseShow = true
            this.addTraincourse = rows
        },
         // 打开弹出框的cb -- 图片查看预览
        handleOpen(){
          setTimeout(()=>{
            console.log(this.$refs.previewUrl)
            this.$refs.previewUrl.src = this.addTraincourse.url
           },0)
          
        },
        // 培训班权限
        // 1. 显示展开和选中的情况
        showTraincouRights(rows){
            this.traincourRightsShowDia = true
            console.log(rows)
            console.log('cmmcmcmcmmmcmcmcmc')
            // 保存当前信息
            this.currentRow = rows
            this.courseTrainingId = rows.id
            // 选中情况
            this.checkedList = rows.userIdList
        },
        // 提交修改
       async handleSetTraincouRight(){
               // 获取被选这个权限的id
            const checkedKeys = this.$refs.tree.getCheckedKeys(true)
            console.log(this.checkedList)
           
            console.log(checkedKeys)
            const res = await this.$http.post(`/api/v1/courseTrainingWeb/configCourseTraining`,{
                "courseTrainingId": this.courseTrainingId,
                "userIdList":checkedKeys
            })
            const { data:{code, result} } = res
            if(code === 200){
                this.$message.success(result)
                this.traincourRightsShowDia = false
                
                this.loadTrainlist()

            }else {
                this.$message.error(result)
            }
        },
          // 部门列表信息
       async getDepartmentUsersListAll(){
          const res = await this.$http.post(`/api/v1/departmentWebApi/getDepartmentUsersListAll`)
          const { data: { code, result } } = res
          if(code === 200){
            this.departmentUsersList = result
          }
        },
        closeRightsCB(){
          
        },
       treeOpenCB(){
          var list = this.currentRow.userIdList
          console.log(list)
          //  设置默认选中情况
             this.$refs.tree.setCheckedKeys(list)
           
        },
        // 分页
        handleSizeChange (val) {
          this.pagesize = val
          this.loadTrainlist()
        },
        handleCurrentChange (val) {
          this.pagenum = val
          this.loadTrainlist()
        },
        // 新增窗口关闭CB
        addCloseCB(){
            this.addTraincourseShow = false
            // 表单清空
            this.addTraincourse = {}
             this.addFileListURL = []
        },
        // 查看窗口关闭
        previewCloseCB(){
            this.addTraincourse = {}
            this.addFileListURL = []
        },
        // 修改窗口关闭
        editCloseCB(){
            this.addTraincourse = {}
            this.addFileListURL = []
        }
    }
}
</script>

<style>
body .el-table th.gutter{
    display: table-cell!important;
}
.el-table{
    margin-bottom: 25px;
    min-height: 400px;
}
</style>
