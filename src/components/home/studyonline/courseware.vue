<template>
    <el-card>
         <el-row>
            <el-col :span="8">
                <!-- 题库下拉框 -->
                <span>请选择课件: </span>
                <el-select v-model="value" 
                           @change="loadCoursewareList"
                           placeholder="请选择课件">
                    <el-option
                    v-for="item in traincourseList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="16">
               
                 <el-button 
                 @click="showAddCourseware()"
                 type="primary">新增</el-button>
                 <el-button 
                    @click="batchDelete(tableChecked)"
                    type="danger">批量删除</el-button>
            </el-col>
        </el-row>
        <!--  试题表格  -->
        <el-table
             v-loading="isLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            ref="multipleTable"
            :data="coursewareList"
            tooltip-effect="dark"
            style="width: 100%; margin-top:25px; "
            border
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="50">
            </el-table-column>

             <el-table-column
            prop="name"
            label="名称"
            width="200">
            </el-table-column>
             <el-table-column
            
            label="类型"
            width="80">
            <template slot-scope="scope"> 
                <span v-if="scope.row.type == 1">文档</span>
                <span v-else-if="scope.row.type == 2">视频</span>
            </template>
            </el-table-column>
             <el-table-column
            label="状态"
            width="60">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 1" type="success" size="mini">显示</el-tag>
                    <el-tag v-else-if="scope.row.status == 2" type="warning" size="mini">隐藏</el-tag>
                </template>
            </el-table-column>
             <el-table-column
            prop="url"
            label="地址"
            width="360">
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
                          @click="showEditCoursewareDia(scope.row)"
                         >编辑</el-button>
              <el-button  plain 
                          size="mini" 
                          type="text" 
                          @click="hanleDeleCourseware(scope.row)"
                          >删除</el-button>
            <el-button  plain 
                        size="mini" 
                        type="text" 
                        @click="hanleLookCourseware(scope.row)"
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
       <!-- 新增课件弹出框 -->
        <el-dialog title="新增课件"
                   @closed="addCoursewareCB()"
                   :visible.sync="addCoursewareshow">
          <el-form :model="courseWareTrainingWebAddForm">
        
             <el-form-item label="课件名称:" :label-width="formLabelWidth" >
              <el-input v-model="courseWareTrainingWebAddForm.name" autocomplete="off" placeholder="课件名称"></el-input>
            </el-form-item>
            <el-form-item label="状态:" :label-width="formLabelWidth">
              <el-select v-model="courseWareTrainingWebAddForm.status" placeholder="显示/隐藏">
                      <el-option label="显示" :value="1"></el-option>
                      <el-option label="隐藏" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth" >
              <el-input v-model="courseWareTrainingWebAddForm.remake" autocomplete="off" placeholder="备注信息"></el-input>
            </el-form-item>
            <el-form-item label="地址:" :label-width="formLabelWidth" >
              <el-input v-model="courseWareTrainingWebAddForm.url" autocomplete="off" placeholder="课件地址"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addCoursewareshow = false">取 消</el-button>
            <el-button type="primary" @click="handleAddCourseware()">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="新增课件"
                   @closed="editCoursewareCB()"
                   :visible.sync="editCoursewareshow">
          <el-form :model="courseWareTrainingWebAddForm">
        
             <el-form-item label="课件名称:" :label-width="formLabelWidth" >
              <el-input v-model="courseWareTrainingWebAddForm.name" autocomplete="off" placeholder="课件名称"></el-input>
            </el-form-item>
            <el-form-item label="状态:" :label-width="formLabelWidth">
              <el-select v-model="courseWareTrainingWebAddForm.status" placeholder="显示/隐藏">
                      <el-option label="显示" :value="1"></el-option>
                      <el-option label="隐藏" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth" >
              <el-input v-model="courseWareTrainingWebAddForm.remake" autocomplete="off" placeholder="备注信息"></el-input>
            </el-form-item>
            <el-form-item label="地址:" :label-width="formLabelWidth" >
              <el-input v-model="courseWareTrainingWebAddForm.url" autocomplete="off" placeholder="课件地址"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editCoursewareshow = false">取 消</el-button>
            <el-button type="primary" @click="handleEditCourseware()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 查看弹出框 -->
        <el-dialog title="新增课件"
                   @closed="previewCoursewareCB()"
                   :visible.sync="previewCoursewareshow">
          <el-form :model="courseWareTrainingWebAddForm" :disabled="true">
        
             <el-form-item label="课件名称:" :label-width="formLabelWidth" >
              <el-input v-model="courseWareTrainingWebAddForm.name" autocomplete="off" placeholder="课件名称"></el-input>
            </el-form-item>
            <el-form-item label="状态:" :label-width="formLabelWidth">
              <el-select v-model="courseWareTrainingWebAddForm.status" placeholder="显示/隐藏">
                      <el-option label="显示" :value="1"></el-option>
                      <el-option label="隐藏" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth" >
              <el-input v-model="courseWareTrainingWebAddForm.remake" autocomplete="off" placeholder="备注信息"></el-input>
            </el-form-item>
            <el-form-item label="地址:" :label-width="formLabelWidth" >
              <el-input v-model="courseWareTrainingWebAddForm.url" autocomplete="off" placeholder="课件地址"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="previewCoursewareshow = false">关闭</el-button>
          </div>
        </el-dialog>
       
    </el-card>
</template>

<script>
export default {
    mounted(){
        this.loadTrainlist()
    },
    data(){
        return{
            // commmon配置参数
            // 表格加载动画
            isLoading: true,
            formLabelWidth:'100px',
             // 批量删除ids
            ids:[],
            // 批量删除行信息
            tableChecked:[],
            // 新增弹出框显示
            addCoursewareshow:false,
            // 编辑弹出框显示
            editCoursewareshow:false,
            // 查看弹出框显示
            previewCoursewareshow:false,
            // 分页相关的属性
            pagenum: 1,
            pagesize: 4,
            total: 20,
            // 课件列表
            traincourseList:[],
            value:'',
            // table数据
            coursewareList:[],
            // 新增课件数据
            courseWareTrainingWebAddForm:{
                "courseTrainingId": '',
                "id": '',
                "name": "",
                "remake": "",
                "status": '',
                "url": "",
                "userId": ''
            }

        }
    },
    methods:{
        // 加载全部培训班列表
        async loadTrainlist(){
            this.isLoading = false
            // 用户id
            const id = sessionStorage.getItem('createId')
            console.log(id)
            const res = await this.$http.post(`/api/v1/courseTrainingWeb/getCourseTrainingListAll?userId=${ id }`)
            console.log(res)
            const { data:{ code, result } } = res
            console.log(code)
            if(code == 200){
                this.traincourseList = result
            }
        },
        // 加载课件列表
        async loadCoursewareList(){
            console.log(this.value)
            const res = await this.$http.post(`/api/v1/CourseWareTrainingWeb/getCourseWareTrainingList`,{
                "courseTrainingId":this.value || null,
                "pageNum":this.pagenum,
                "pageSize":this.pagesize
            })
            console.log(res)
            const { data:{ code, result } } = res
            if(code === 200) {
                this.isLoading = false
                this.coursewareList = result.courseWareTrainingList
                this.total = result.total
            }
        },
        // 新增课件逻辑功能
        // 新增弹出框显示
        showAddCourseware(){
            this.addCoursewareshow = true
        },
        // 新增发送请求
        async handleAddCourseware(){
            // 参数处理
            this.courseWareTrainingWebAddForm.courseTrainingId = this.value // 培训班id
            this.courseWareTrainingWebAddForm.userId = sessionStorage.getItem('createId') // 用户id
            // 发送请求
            const res = await this.$http.post(`/api/v1/CourseWareTrainingWeb/courseWareTrainingAddCommit`,this.courseWareTrainingWebAddForm)
            console.log(res)
            const { data: { code, msg } } = res
            if(code == 200) {
                this.addCoursewareshow = false
                this.$message.success(msg)
                this.loadCoursewareList()
                // 清空表单
                this.courseWareTrainingWebAddForm = {}
            }
        },
        //课件删除逻辑实现
        // 1. 单个删除 
        hanleDeleCourseware(row){
             this.$confirm('确定删除该课件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async () => {
                // 删除逻辑
                const res = await this.$http.delete(`/api/v1/CourseWareTrainingWeb/courseWareTrainingDeleteById?id=${row.id}`)
                console.log(res)
                const { data } = res
                if(data.code == 200){
                    this.$message.success(data.msg)
                    this.loadCoursewareList()
                }
                
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });         
            })

        },
        // 批量删除
         batchDelete(rows){
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
            const res = await this.$http.delete(`/api/v1/CourseWareTrainingWeb/courseWareTrainingDeleteBatch?${str}`)
            const { data } = res
            if(data.code == 200){
                this.$message.success(data.msg)
                this.loadCoursewareList()
            }
            
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })        
            })
              
           
        },
        handleSelectionChange(val){
            this.tableChecked = val
            
        },
        // 编辑逻辑功能
        // 1. 编辑弹出框显示
        showEditCoursewareDia(rows){
            // 弹框  信息
            this.editCoursewareshow = true
            this.courseWareTrainingWebAddForm = rows
        },
        // 发送编辑请求
       async handleEditCourseware(){
            // 参数处理
            this.courseWareTrainingWebAddForm.courseTrainingId = this.value // 培训班id
            this.courseWareTrainingWebAddForm.userId = sessionStorage.getItem('createId') // 用户id
            // 发送请求
            const res = await this.$http.put(`/api/v1/CourseWareTrainingWeb/courseWareTrainingUpdateCommit`,this.courseWareTrainingWebAddForm)
            const { data } = res
            if(data.code == 200){
                this.editCoursewareshow = false
                this.$message.success(data.msg)
                this.loadCoursewareList()
                // 清空表单
                this.courseWareTrainingWebAddForm = {}
            }
        },
        // 查看功能逻辑
        hanleLookCourseware(rows){
             this.previewCoursewareshow = true
             this.courseWareTrainingWebAddForm = rows
        },
        // 修改弹出框cb
        editCoursewareCB(){
            this.courseWareTrainingWebAddForm = {}
        },
        // 新增弹出框关闭cb
        addCoursewareCB(){
            this.courseWareTrainingWebAddForm = {}

        },
        // 查看弹出框关闭
        previewCoursewareCB(){
            this.courseWareTrainingWebAddForm = {}

        },
        // 分页
        handleSizeChange (val) {
          this.pagesize = val
          this.loadCoursewareList()
        },
        handleCurrentChange (val) {
          this.pagenum = val
          this.loadCoursewareList()
        }
    }
    
}
</script>

<style>

</style>
