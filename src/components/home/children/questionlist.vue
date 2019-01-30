<template>
    <el-card>
         <el-row>
            <el-col :span="8">
                <!-- 题库下拉框 -->
                <span>请选择题库: </span>
                <el-select v-model="value" 
                           @change="loadQuestionList"
                           placeholder="请选择题库">
                    <el-option :value="''" :selected="true">所有试题</el-option>
                    <el-option
                    v-for="item in questionNameList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="16">
               
                 <el-button 
                 @click="showAddQuestion()"
                 type="primary">新增</el-button>
                 <el-button 
                    @click="batchDelete(tableChecked)"
                    type="danger">批量删除</el-button>
                <el-button 
                    @click="batchImport()"
                    type="success">Excel导入</el-button>
                <el-button 
                    @click="downloadTemplate()"
                    type="info">模板下载</el-button>
            </el-col>
        </el-row>
        <!--  试题表格  -->
        <el-table
             v-loading="isLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            ref="multipleTable"
            :data="questionsList"
            tooltip-effect="dark"
            style="width: 100%; margin-top:25px; "
            border
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="50">
            </el-table-column>

             <el-table-column
            prop="msg"
            label="题目"
            width="300">
            </el-table-column>
             <el-table-column
            
            label="选项"
            width="250">
            <template slot-scope="scope"> <span v-for= "(item,index) in JSON.parse(scope.row.options)" :key="index" style="margin-right:8px">{{ item + ' '}}</span></template>
            </el-table-column>
             <el-table-column
            prop="answer"
            label="答案"
            width="60">
            </el-table-column>
             <el-table-column
            prop="questionAnalysis"
            label="解析"
            width="150">
            </el-table-column>
            
             <el-table-column
            label="创建时间"
            width="170">
            <template slot-scope="scope">{{ scope.row.createTime }}</template>
            </el-table-column>
             <el-table-column
            prop="updateTime"
            label="更新时间"
            width="170">
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              width="130">
            <template slot-scope="scope">
              <el-button  plain 
                          size="small" 
                          type="text" 
                          @click="showEditQuestion(scope.row)"
                         >编辑</el-button>
              <el-button  plain 
                          size="mini" 
                          type="text" 
                          @click="hanleDeleteQuestion(scope.row)"
                          >删除</el-button>
            <el-button  plain 
                        size="mini" 
                        type="text" 
                        @click="hanleLookQuestion(scope.row)"
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
          :page-sizes="[6, 8, 10, 12]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        <!-- 新增试题弹出框 -->
        <el-dialog title="新增试题"
                   @close="addquestionCB()"
                   :visible.sync="addQuestionShow">
          <el-form :model="AddQuestionForm">
        
             <el-form-item label="题目:" :label-width="formLabelWidth" >
              <el-input v-model="AddQuestionForm.msg" autocomplete="off" placeholder="题目"></el-input>
            </el-form-item>
            
             <el-form-item
                :label-width="formLabelWidth"
                v-for="(item, index) in AddQuestionForm.options"
                :label="'选项' + ++index + ':'"
                :key="index">
                <el-row>
                <el-input v-model="item.value" placeholder="选项详情" style="width:90%"></el-input>
                <el-button @click.prevent="removeDomain(item)" class="el-icon-close" style="color:red;"></el-button>
                </el-row>
            </el-form-item>
             <el-button @click="addDomain" class="el-icon-plus questionAddBtn" style="margin-left:80px;">选项</el-button>
             <el-form-item label="试题解析:" :label-width="formLabelWidth">
                <el-input
                    type="textarea"
                    autosize
                    placeholder="试题解析"
                    v-model="AddQuestionForm.questionAnalysis">
                </el-input>
            </el-form-item>
            <el-form-item label="答案:" :label-width="formLabelWidth">
              <el-input v-model="AddQuestionForm.answer" autocomplete="off" placeholder="答案"></el-input>
            </el-form-item>
            <el-form-item label="试题类型:" :label-width="formLabelWidth">
              <el-select v-model="AddQuestionForm.questionKind" placeholder="试题类型">
                      <el-option label="判断" :value="1"></el-option>
                      <el-option label="单选" :value="2"></el-option>
                      <el-option label="多选" :value="3"></el-option>
              </el-select>
            </el-form-item>
            
             <el-form-item label="试题来源:" :label-width="formLabelWidth">
              
              <el-select v-model="AddQuestionForm.source" placeholder="试题来源">
                      <el-option label="导入" :value="1"></el-option>
                      <el-option label="录入" :value="2"></el-option>
                      <el-option label="用户提供" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addQuestionShow = false">取 消</el-button>
            <el-button type="primary" @click="handleAddQuestion()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 修改弹出框 -->
        <el-dialog title="修改试题"  
                   @close="editquestionCB()"
                   :visible.sync="editQuestionShow">
          <el-form :model="AddQuestionForm">
             <el-form-item label="题目:" :label-width="formLabelWidth">
              <el-input v-model="AddQuestionForm.msg" autocomplete="off"></el-input>
            </el-form-item>
             <!-- <el-form-item label="选项:" :label-width="formLabelWidth">
              <el-input v-model="AddQuestionForm.options" autocomplete="off"></el-input>
            </el-form-item> -->
            <el-form-item
                :label-width="formLabelWidth"
                v-for="(item, index) in AddQuestionForm.options"
                :label="'选项' + ++index + ':'"
                :key="index">
                <el-row>
                <el-input v-model="item.value" placeholder="选项详情" style="width:90%"></el-input>
                <el-button @click.prevent="removeDomain(item)" class="el-icon-close" style="color:red;"></el-button>
                </el-row>
            </el-form-item>
             <el-button @click="addDomain" class="el-icon-plus questionAddBtn" style="margin-left:80px;">选项</el-button>
             <el-form-item label="试题解析:" :label-width="formLabelWidth">
                <el-input type="textarea"
                        autosize
                        placeholder="试题解析"
                        v-model="AddQuestionForm.questionAnalysis">
                </el-input>
            </el-form-item>
            <el-form-item label="答案:" :label-width="formLabelWidth">
              <el-input v-model="AddQuestionForm.answer" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="试题类型:" :label-width="formLabelWidth">
             <el-select v-model="AddQuestionForm.questionKind" placeholder="试题类型">
                      <el-option label="判断" :value="1"></el-option>
                      <el-option label="单选" :value="2"></el-option>
                      <el-option label="多选" :value="3"></el-option>
              </el-select>
            </el-form-item>
            
             <el-form-item label="试题来源:" :label-width="formLabelWidth">
             <el-select v-model="AddQuestionForm.source" placeholder="试题来源">
                      <el-option label="导入" :value="1"></el-option>
                      <el-option label="录入" :value="2"></el-option>
                      <el-option label="用户提供" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editQuestionShow = false">取 消</el-button>
            <el-button type="primary" @click="handleEditQuestion()">确定修改</el-button>
          </div>
        </el-dialog>
        <!-- 查看显示框 -->
        <el-dialog title="查看试题"  
                   :visible.sync="lookQuestionShow">
          <el-form :model="AddQuestionForm" :disabled="true">
             <el-form-item label="题目:" :label-width="formLabelWidth">
              <el-input v-model="AddQuestionForm.msg" autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item label="选项:" :label-width="formLabelWidth">
              <el-input v-model="AddQuestionForm.options" autocomplete="off">
               
              </el-input>
            </el-form-item>
            <el-form-item label="答案:" :label-width="formLabelWidth">
              <el-input v-model="AddQuestionForm.answer" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="试题类型:" :label-width="formLabelWidth">
             <el-select v-model="AddQuestionForm.questionKind" placeholder="试题类型">
                      <el-option label="判断" :value="1"></el-option>
                      <el-option label="单选" :value="2"></el-option>
                      <el-option label="多选" :value="3"></el-option>
              </el-select>
            </el-form-item>
            
             <el-form-item label="试题来源:" :label-width="formLabelWidth">
             <el-select v-model="AddQuestionForm.source" placeholder="试题来源">
                      <el-option label="导入" :value="1"></el-option>
                      <el-option label="录入" :value="2"></el-option>
                      <el-option label="用户提供" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="lookQuestionShow = false">关闭</el-button>
          </div>
        </el-dialog>
       <!-- <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/> -->
       <!-- 批量导入弹框 -->
       <el-dialog title="试题导入"  
                   :visible="importQuestionShow">
        <el-form >
           <el-upload
                :http-request="uploadExcelfile"
                @close="ExcelCB()"
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
            <el-button type="primary" @click="importQuestionShow = false">关闭</el-button>
          </div>
        </el-dialog>
    </el-card>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
export default {
    components: { UploadExcelComponent },
    data(){
        return {
            //批量上传预览数据
            tableData: [],
            tableHeader: [],

            // 分页相关的属性
            pagenum: 1,
            pagesize: 6,
            total: 0,
            // 加载动画
            isLoading:true,
            formLabelWidth:'80px',
            //  题库下拉框列表数据
            questionNameList:[],
            // 选中的下拉框value值
            value:'',
            // 根据题库id获取试题列表
            questionsList:[],
            // 新增弹出框显示
            addQuestionShow:false,
            // 批量导入弹框显示
            importQuestionShow:false,
            // 新增数据
            AddQuestionForm:{
                "answer":"",
                "createId":"",
                "id":"",
                "level":1,
                "msg":"",
                "options":[
                    {value:''}
                ],
                "questionAnalysis":"",
                "questionBankId":"",
                "questionKind":"",
                "remake":"remake",
                "source":""
            },
            // 修改弹出框显示
            editQuestionShow:false,
            // 查看对话框显示
            lookQuestionShow:false,
            // 保存的row信息
            rowMessage:'',
            // 选中行的信息
            tableChecked:'',
            // 批量删除ids
            ids:[]
          
        }
    },
    created(){
         
    },
     mounted(){
        this.getQuestionsById()
        this.loadQuestionList()
    },
    methods:{
       
        // 1 根据用户id获取题库
        async getQuestionsById(){
            const id = sessionStorage.getItem('createId')
            console.log(id)
            const res = await this.$http.post(`/api/v1/questionWeb/getQuestionBank?userId=${id}`)
            console.log(res)
            const { data } = res
            if(data.code == '200'){
                this.isLoading = false
                this.questionNameList = data.result
                // this.value = data.result[0].id
                
            }
        },
        //根据题库id获取试题
       async loadQuestionList(){
            // 获取id
            const res = await this.$http.post(`/api/v1/questionWeb/getQuestionList`,{
                "questionBankId":this.value || null,
                "pageNum":this.pagenum,
                "pageSize":this.pagesize
            })
            const { data:{code, result} } = res
            console.log(code,result)
            if(code == 200){
                this.questionsList = result.questionList
                this.total = result.total
            }
        },
        // 显示新增对话框
        showAddQuestion(){
            this.addQuestionShow = true
            // 清空表单
            this.AddQuestionForm = {
                "remake":"remake",
                "level":1,
                "options":[
                {value:''}
                ],
          }
        },
        // 处理新增请求
        async handleAddQuestion(){
            // 0 关闭对话框
            this.addQuestionShow = false
            // 1 收集数据 createId-用户id  questionBankId-题库id
            this.AddQuestionForm.createId = sessionStorage.getItem('createId')
            this.AddQuestionForm.questionBankId = this.value
            //1.1 处理options
            const resultOptions = []
            this.AddQuestionForm.options.forEach((v,i)=>{
                resultOptions.push(v.value)
            })
             this.AddQuestionForm.options = resultOptions
            //1.2 处理 答案大小写
            this.AddQuestionForm.answer = this.AddQuestionForm.answer.toUpperCase()

            // 2 发送请求
            const res = await this.$http.post(`/api/v1/questionWeb/questionAddCommit`,this.AddQuestionForm)
            console.log(res)
            const { data } = res
            if(data.code == 200){
                this.$message.success(data.msg)
                this.loadQuestionList()
                //清空表单
                this.AddQuestionForm = {
                    "remake":"remake",
                    "level":1,
                     "options":[
                        {value:''}
                     ],
                }
                return
            }
           this.AddQuestionForm = {
                "remake":"remake",
                "level":1,
                "options":[
                    {value:''}
                ],
            }
            this.$message.warning(data.msg)


        },
        // 新增选项方法
         removeDomain(item){
              var index = this.AddQuestionForm.options.indexOf(item)
              if(index == 0) return
              if (index !== -1) {
              this.AddQuestionForm.options.splice(index, 1)
              }
         },
         addDomain(){
             this.AddQuestionForm.options.push({value: ''})
         },
        // 单个删除试题
         hanleDeleteQuestion(row){
             this.$confirm('确定删除该文件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async () => {
                // 删除逻辑
                const res = await this.$http.delete(`/api/v1/questionWeb/deleteById?id=${row.id}`)
                console.log(res)
                const { data } = res
                if(data.code == 200){
                    this.$message.success(data.msg)
                    this.loadQuestionList()
                }
                
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });


            
        },
        // 修改试题弹出框显示
        showEditQuestion(row){
            console.log(row)
            this.editQuestionShow = true
            // 保存后台返回的原始数据 row信息
            this.rowMessage = row
            // 信息修改 处理options
           
            // row.options = JSON.parse(this.rowMessage.options)
            this.rowMessage.options = JSON.parse(this.rowMessage.options)
            console.log(row.options)
            const editOptios = []
            this.rowMessage.options.forEach((v,i)=>{
                editOptios.push({'value':v})
            })
            this.rowMessage.options = editOptios
            console.log(row.options)
            // 弹出修改框时，显示对应信息
            this.AddQuestionForm = this.rowMessage
            console.log(this.rowMessage)
            console.log('------------------------------------------------------')
        },
          // 修改试题 发送请求
        async handleEditQuestion(){
            this.editQuestionShow = false
            const resultOptions = []
            this.AddQuestionForm.options.forEach((v,i)=>{
                resultOptions.push(v.value)
            })
             this.AddQuestionForm.options = resultOptions
             this.AddQuestionForm.remake = "remake"
             this.AddQuestionForm.createId = sessionStorage.getItem('createId')
             this.AddQuestionForm.level = 1
             //1.2 处理 答案大小写
            this.AddQuestionForm.answer = this.AddQuestionForm.answer.toUpperCase()
            
            // 发送请求 
            const res = await this.$http.put(`/api/v1/questionWeb/questionUpdateCommit`,this.AddQuestionForm)
            console.log(res)
            const { data } = res
            if(data.code == 200){
                // 提示 加载 清空表单
                this.$message.success(data.msg)
                this.loadQuestionList()
                this.AddQuestionForm = {
                    "remake":"remake",
                    "level":1,
                    "options":[
                       {value:''}
                     ]
                }
            }
            
        },
        // 批量删除功能
        batchDelete(rows){
             this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
            const res = await this.$http.delete(`/api/v1/questionWeb/deleteBatchById?${str}`)
            console.log(res)
            const { data } = res
            if(data.code == 200){
                this.$message.success(data.msg)
                this.loadQuestionList()
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
        // 新增弹出框关闭清空表单
        addquestionCB(){
           this.AddQuestionForm = {
                "remake":"remake",
                "level":1,
                "options":[
                {value:''}
                ],
          }
        },
        // 修改弹出框关闭清空表单
        editquestionCB(){
           // 当我点击去取消或者关闭时，里边的一些处理row的操作都将被还原
         this.loadQuestionList()
        },
        // 分页
        handleSizeChange (val) {
          console.log(`每页 ${val} 条`)
          this.pagesize = val
          this.loadQuestionList()
        },
        handleCurrentChange (val) {
          console.log(`当前页: ${val}`)
          this.pagenum = val
          this.loadQuestionList()
        },
        // 查看功能
        hanleLookQuestion(rows){
            this.lookQuestionShow = true
            this.AddQuestionForm = rows
        },
        // 批量导入功能
        batchImport() {
            this.importQuestionShow = true
        },
        // excel上传
       async uploadExcelfile(param){
          const file = param.file
          if(!/\.(xlsx|xls|csv)$/.test(file.name)){
              this.$message.error('文件类型不正确')
              return
          }
          let fd = new FormData()
          fd.append('file',file)//传文件
          const res = await this.$http.post(`/api/v1/questionWeb/questionBatchImport`,fd)
          console.log(res)
          console.log('cccccccccccc')
          const { data:{code,msg,result} } = res
          if(code == 200){
            this.$message.success(result)
            this.loadQuestionList()
            this.importQuestionShow = false
            return
          
          }
          // 错误提示
          this.$message.error(msg)
          
        },
        ExcelCB(){
            this.importQuestionShow = false
        },
        // 模板下载
       async downloadTemplate(){
           const res = await this.$http.post(`/api/v1/questionWeb/questionExcelTemplate`)
           console.log(res)
           const { data: { code, msg, result } } = res
           if(code === 200) { 
               window.location.href = result
           }
        }
         

    }
}
</script>

<style>

body .el-table th.gutter{
    display: table-cell!important;
}
.questionAddBtn{
    margin-left: 100px;
    margin-bottom: 15px;
}
.pagenationCl{
    margin-top: 25px;
}
.el-table{
  margin-bottom: 25px;
  min-height: 100px
}
</style>
