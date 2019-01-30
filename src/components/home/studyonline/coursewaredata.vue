<template>
    <el-card>
         <el-row>
            <el-col :span="8">
                <!-- 题库下拉框 -->
                <span>请选择栏目: </span>
                <el-select v-model="columnIdVal" 
                           @change="loadCoursewareDataList"
                           placeholder="请选择栏目">
                    <el-option
                    v-for="item in ColumnAllList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="16">
               
                 <el-button 
                 :disabled="isDisabled"
                 @click="showAddCoursewaredata()"
                 type="primary">新增</el-button>
                 <el-button 
                    @click="batchDelete(tableChecked)"
                    type="danger">批量删除</el-button>
            </el-col>
        </el-row>
        <!--  资料表格  -->
        <el-table
             v-loading="isLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            ref="multipleTable"
            :data="coursewaredataTable"
            tooltip-effect="dark"
            style="width: 100%; margin-top:25px; "
            border
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="50">
            </el-table-column>

             <el-table-column
            prop="title"
            label="名称"
            width="250">
            </el-table-column>
            
             <el-table-column
            prop="url"
            label="文档地址"
            width="360">
            </el-table-column>
              <el-table-column
            prop="remake"
            label="备注信息"
            width="100">
            </el-table-column>
             <el-table-column
            label="创建时间"
            prop="createTime"
            width="170">
            </el-table-column>
             <el-table-column
            prop="updateTime"
            label="更新时间"
            width="">
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              width="130">
            <template slot-scope="scope">
              <el-button  plain 
                          size="small" 
                          type="text" 
                          @click="showEditCoursewareDataDia(scope.row)"
                         >编辑</el-button>
              <el-button  plain 
                          size="mini" 
                          type="text" 
                          @click="hanleDeleCoursewareData(scope.row)"
                          >删除</el-button>
            <el-button  plain 
                        size="mini" 
                        type="text" 
                        @click="hanleLookCoursewareData(scope.row)"
                        >查看</el-button>
            </template>

            </el-table-column>
           
        </el-table>
         <!-- 分页 -->
         <el-pagination
         class="pagenationCl"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[4, 6, 8, 10, 12]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
       <!-- 新增data弹出框 -->
        <el-dialog title="课件资料添加"
                   @closed="addCoursewaredataCB()"
                   :visible.sync="addCoursewareDatashowDia">
          <el-form :model="addCoursewaredataForm">
        
             <el-form-item label="资料名称:" :label-width="formLabelWidth" >
              <el-input v-model="addCoursewaredataForm.title" autocomplete="off" placeholder="资料名称"></el-input>
            </el-form-item>
              <el-form-item label="类型:" :label-width="formLabelWidth">
              <el-select v-model="addCoursewaredataForm.type" placeholder="文档类型">
                      <el-option label="显示" :value="0">文档</el-option>
                     
              </el-select>
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth" >
              <el-input v-model="addCoursewaredataForm.remake" autocomplete="off" placeholder="备注信息"></el-input>
            </el-form-item>
            <el-form-item label="文档:" :label-width="formLabelWidth">
              <el-upload
                :on-remove="handleRemove"
                :limit="10"
                action=""
                accept="*/*"
                :http-request="uploadCoursewareData"
                ref="addUpload"
                :file-list="coursewareDataFileList"
                list-type="text">
                <el-button size="small" type="success">点击上传</el-button>
              </el-upload>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addCoursewareDatashowDia = false">取 消</el-button>
            <el-button type="primary" @click="handleAddCoursewareData()">确 定</el-button>
          </div>
        </el-dialog>
         <!-- 编辑data弹出框 -->
        <el-dialog title="课件资料添加"
                   @closed="editCoursewaredataCB()"
                   :visible.sync="editCoursewareDatashowDia">
          <el-form :model="addCoursewaredataForm">
        
             <el-form-item label="资料名称:" :label-width="formLabelWidth" >
              <el-input v-model="addCoursewaredataForm.title" autocomplete="off" placeholder="资料名称"></el-input>
            </el-form-item>
              <el-form-item label="类型:" :label-width="formLabelWidth">
              <el-select v-model="addCoursewaredataForm.type" placeholder="文档类型">
                      <el-option label="显示" :value="0">文档</el-option>
                     
              </el-select>
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth" >
              <el-input v-model="addCoursewaredataForm.remake" autocomplete="off" placeholder="备注信息"></el-input>
            </el-form-item>
            <el-form-item label="文档:" :label-width="formLabelWidth">
              <el-upload
                :on-remove="handleRemove"
                :limit="10"
                action=""
                accept="*/*"
                :http-request="uploadCoursewareData"
                ref="addUpload"
                :file-list="coursewareDataFileList"
                list-type="text">
                <el-button size="small" type="success">点击上传</el-button>
              </el-upload>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editCoursewareDatashowDia = false">取 消</el-button>
            <el-button type="primary" @click="handleEditCoursewareData()">确 定</el-button>
          </div>
        </el-dialog>
         <!-- 查看data弹出框 -->
        <el-dialog title="课件资料添加"
                   @closed="previewCoursewaredataCB()"
                   :visible.sync="previewCoursewareDatashowDia">
          <el-form :model="addCoursewaredataForm" :disabled="true">
        
             <el-form-item label="资料名称:" :label-width="formLabelWidth" >
              <el-input v-model="addCoursewaredataForm.title" autocomplete="off" placeholder="资料名称"></el-input>
            </el-form-item>
              <el-form-item label="类型:" :label-width="formLabelWidth">
              <el-select v-model="addCoursewaredataForm.type" placeholder="文档类型">
                      <el-option label="显示" :value="0">文档</el-option>
                     
              </el-select>
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth" >
              <el-input v-model="addCoursewaredataForm.remake" autocomplete="off" placeholder="备注信息"></el-input>
            </el-form-item>
            <el-form-item label="文档url:" :label-width="formLabelWidth">
              <el-input v-model="addCoursewaredataForm.url" autocomplete="off" placeholder=""></el-input>                
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="previewCoursewareDatashowDia = false" type="primary">关闭</el-button>
          </div>
        </el-dialog>
        
       
    </el-card>
</template>

<script>
export default {
    mounted(){
        this.loadColumnAll()
    },
    data(){
        return{
            // commmon配置参数
            // 表格加载动画
            isLoading: true,
            isDisabled:true,
            formLabelWidth:'100px',
            //新增显示
            addCoursewareDatashowDia:false,
            // 修改显示
            editCoursewareDatashowDia:false,
            // 预览显示
            previewCoursewareDatashowDia:false,
             // 批量删除ids
            ids:[],
            // 批量删除行信息
            tableChecked:[],
            // 分页相关的属性
            pagenum: 1,
            pagesize: 4,
            total: 20,
            // 所有栏目列表
            ColumnAllList:[],
            // 选中的栏目id
            columnIdVal:null,
            // 表格数据
            coursewaredataTable:[],
            // 新增数据
            addCoursewaredataForm:{},
            //文档上传预览
            coursewareDataFileList:[]
        }
    },
    watch:{
        columnIdVal(newval,oldval){
            this.isDisabled = !newval
            deep:true
        }
    },
    methods:{
        // 所有栏目列表
       async loadColumnAll(){
           const res = await this.$http.post(`/api/v1/courseWareColumnWebApi/getCourseWareColumnListAll`)
           const { data: { code, result } } = res
           if(code === 200){
               this.ColumnAllList = result
           }
        },
       async loadCoursewareDataList(){
           const res = await this.$http.post(`/api/v1/courseWareWeb/getCourseWareTrainingList`,{
               "courseWareColumnId": this.columnIdVal,
                "pageNum": this.pagenum,
                "pageSize": this.pagesize
           })
           const { data: { code, result:{ courseWareList, total } } } = res
           if(code === 200){
               this.isLoading = false
               this.coursewaredataTable = courseWareList
               this.total = total
           }

        },
        // 新增功能 弹框 发送请求
        showAddCoursewaredata(){
            this.addCoursewareDatashowDia = true
        },
       async handleAddCoursewareData(){
           // 用户id
           this.addCoursewaredataForm.userId = sessionStorage.getItem('createId')
           this.addCoursewaredataForm.courseWareColumnId = this.columnIdVal
           const res = await this.$http.post(`/api/v1/courseWareWeb/courseWareAddCommit`,this.addCoursewaredataForm)
           console.log(res)
           const { data: { code, msg } } = res
           if(code === 200){
               this.addCoursewareDatashowDia = false
               this.$message.success(msg)
               // 清空表单和上传预览
               this.coursewareDataFileList = []
               this.addCoursewaredataForm = {}
               this.loadCoursewareDataList()
           }
        },
        // 文档上传
       async uploadCoursewareData(param){
          const file = param.file
          let fd = new FormData()
          fd.append('uploadFile',file)//传文件
          fd.append('uploadType',5)//传文件
          const res = await this.$http.post(`/api/v1/background/upload`,fd)
          console.log(res )
          const { data:{ code,msg,result } } = res
          if(code == 200){
            this.addCoursewaredataForm.url = result.url
            this.$message.success(msg)
          // 预览
          this.coursewareDataFileList.push({url:result.url,name:result.fileName})
          
          }
          // 错误提示，清空上传图片列表
          this.$message.error(data.msg)
        },
        // 编辑功能
        showEditCoursewareDataDia(rows){
            console.log(rows)
            this.editCoursewareDatashowDia = true
            this.addCoursewaredataForm = rows
            // 上传文档预览
            this.coursewareDataFileList.push({url:rows.url,name:rows.title})
        },
        // 发送编辑请求
       async handleEditCoursewareData(){
             // 用户id
           this.addCoursewaredataForm.userId = sessionStorage.getItem('createId')
           this.addCoursewaredataForm.courseWareColumnId = this.columnIdVal
           const res = await this.$http.put(`/api/v1/courseWareWeb/courseWareUpdateCommit`,this.addCoursewaredataForm)
           const { data: { code, msg } } = res
           if(code === 200){
               this.$message.success(msg)
               this.editCoursewareDatashowDia = false
               // 清空表单
                this.coursewareDataFileList = []
                this.addCoursewaredataForm = {}  
           }
       },
       // 删除功能
       // 1. 单个删除逻辑
         hanleDeleCoursewareData(rows){
            this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 删除逻辑
           console.log(rows)
            const res = await this.$http.delete(`/api/v1/courseWareWeb/courseWareDeleteById?id=${rows.id}`)
             const { data: { code, msg } } = res
            if(code === 200) {
                this.loadCoursewareDataList()
                this.$message.success(msg)
                return 
            }
            this.$message.warning(msg)
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })      
        })
           
        },
        // 2. 批量删除
        async  batchDelete(rows){
            this.$confirm('确定批量删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async () => {

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
            const res = await this.$http.delete(`/api/v1/courseWareWeb/courseWareDeleteBatch?${str}`)
            const { data } = res
            if(data.code == 200){
                this.$message.success(data.msg)
                this.loadCoursewareDataList()
            }
            
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
              
           
        },
        handleSelectionChange(val){
            this.tableChecked = val
            
        },
        // 预览
        hanleLookCoursewareData(rows){
            // 显示弹框 和信息
            this.previewCoursewareDatashowDia = true
            this.addCoursewaredataForm = rows
        },
        // 分页
        handleSizeChange (val) {
          this.pagesize = val
          this.loadCoursewareDataList()
        },
        handleCurrentChange (val) {
          this.pagenum = val
          this.loadCoursewareDataList()
        },
        // 新增关闭
        addCoursewaredataCB(){
         this.coursewareDataFileList = []
         this.addCoursewaredataForm = {}
        },
        editCoursewaredataCB(){
          this.coursewareDataFileList = []
         this.addCoursewaredataForm = {}  
        },
        previewCoursewaredataCB(){
         this.coursewareDataFileList = []
         this.addCoursewaredataForm = {}  
        },
        handleRemove(file,filelist){
          this.coursewareDataFileList = filelist
        }
    }
    
}
</script>

<style>

</style>
