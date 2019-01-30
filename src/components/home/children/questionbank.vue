<template>
      <el-card>
         <el-button 
                 @click="showAddQuestionbankDia()"
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
            :data="questionbankForm"
            tooltip-effect="dark"
             style="width: 100%; margin-top:30px;"
            border
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="40">
            </el-table-column>
              <el-table-column
            prop="id"
            label="主键"
            width="70">
            </el-table-column>
             <el-table-column
            prop="name"
            label="名称"
            width="350">
            </el-table-column>
             <el-table-column
            prop="orders"
            label="排序"
            width="120">
            </el-table-column>
            <el-table-column
            prop="version"
            label="版本"
            width="100">
            </el-table-column>
            <el-table-column
                align="center"
                label="显示"
                width="100">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isShow == -1" type="warning" size="mini">不显示</el-tag>
                    <el-tag v-else-if="scope.row.isShow == 1" type="success" size="mini">显示</el-tag>
                </template>
            </el-table-column>
             <el-table-column
            prop="createTime"
            label="创建时间"
            width="">
            </el-table-column> 
            <el-table-column
            prop="updateTime"
            label="更新时间"
            width="">
            </el-table-column>
            <el-table-column
              label="操作" width="130" >
            <template slot-scope="scope">
              <el-button  plain 
                          size="small" 
                          type="text" 
                          @click="showEditQuestionbankDia(scope.row)"
                          >修改</el-button>
              <el-button  plain 
                          size="small" 
                          type="text" 
                          @click="hanleDeleQuestionbank(scope.row)"
                          >删除</el-button>
              <el-button  plain 
                          size="small" 
                          @click="hanlePreviewQuestionbank(scope.row)"
                          type="text" 
                          >查看</el-button>
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
        <!-- 新增题库弹出框 -->
        <el-dialog title="新增题库" 
                   @closed="addquestionCB()"
                   :visible.sync="addQuestionbankShow" 
                   width="50%"
                   :fullscreen="false">
          <el-form :model="questionBankWebAddForm">
           
             <el-form-item label="名称:" :label-width="formLabelWidth">
                <el-input v-model="questionBankWebAddForm.name" autocomplete="off" placeholder="题库名称"></el-input> 
            </el-form-item>
             <el-form-item label="备注:" :label-width="formLabelWidth">
                <el-input v-model="questionBankWebAddForm.remake" autocomplete="off" placeholder="题库备注信息"></el-input> 
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addQuestionbankShow = false">取 消</el-button>
            <el-button type="primary" @click="handleAddQuestionbank()">确 定</el-button>
          </div>
        </el-dialog>
         <!-- 修改题库弹出框 -->
        <el-dialog title="更新题库" 
                   @closed="editquestionCB()"
                   :visible.sync="editQuestionbankShow" 
                   width="50%"
                   :fullscreen="false">
          <el-form :model="questionBankWebAddForm">
           
             <el-form-item label="名称:" :label-width="formLabelWidth">
                <el-input v-model="questionBankWebAddForm.name" autocomplete="off" placeholder="题库名称"></el-input> 
            </el-form-item>
             <el-form-item label="备注:" :label-width="formLabelWidth">
                <el-input v-model="questionBankWebAddForm.remake" autocomplete="off" placeholder="题库备注信息"></el-input> 
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editQuestionbankShow = false">取 消</el-button>
            <el-button type="primary" @click="handleEditQuestionbank()">确 定</el-button>
          </div>
        </el-dialog>
         <!-- 预览题库弹出框 -->
        <el-dialog title="查看题库" 
                   @closed="previewquestionCB()"
                   :visible.sync="previewQuestionbankShow" 
                   width="50%"
                   :fullscreen="false">
          <el-form :model="questionBankWebAddForm" :disabled="true">
           
             <el-form-item label="名称:" :label-width="formLabelWidth">
                <el-input v-model="questionBankWebAddForm.name" autocomplete="off" placeholder=""></el-input> 
            </el-form-item>
             <el-form-item label="备注:" :label-width="formLabelWidth">
                <el-input v-model="questionBankWebAddForm.remake" autocomplete="off" placeholder=""></el-input> 
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary"  @click="previewQuestionbankShow = false">关闭</el-button>
          </div>
        </el-dialog>
        
    </el-card>
</template>

<script>
export default {
    data(){
        return{
            // 加载
            isLoading:true,
            formLabelWidth:'80px',
            // 批量删除ids
            ids:[],
            // 批量删除行信息
            tableChecked:[],
             // 分页相关的属性
            pagenum: 1,
            pagesize: 4,
            total: 20,
            // 新增弹出框显示
            addQuestionbankShow:false,
            // 修改弹出框显示
            editQuestionbankShow:false,
            //预览
            previewQuestionbankShow:false,
            // table数据
            questionbankForm:[],
            // 新增数据
            questionBankWebAddForm:{
                "name":"",
                "professionId": 1,
                "remake": "",
                "userId": 1
            }
        }
    },
    mounted(){
        this.getQuestionbanklist()
    },
    methods:{
        // 1 获取题库列表
        async getQuestionbanklist(){
            const res = await this.$http.post(`/api/v1/questionBankWeb/getQuestionBankListPage`,{
            "pageNum": this.pagenum,
            "pageSize": this.pagesize
            })
            console.log(res)
            const { data:{code,result} } = res
            if(code == '200'){
                 this.isLoading = false
                 this.questionbankForm = result.questionBankList
                 this.total = result.total
                // 表单清空
                this.questionBankWebAddForm = {}
                
            }
        },
       // 新增逻辑功能
       // 1. 显示新增弹出框
       showAddQuestionbankDia(){
           this.addQuestionbankShow = true
       },
       // 2. 新增发送请求
      async handleAddQuestionbank(){
          // 参数处理 userId professionId
            this.questionBankWebAddForm.professionId = 1
            this.questionBankWebAddForm.userId = sessionStorage.getItem('createId')
          // 发送请求
          const res = await this.$http.post(`/api/v1/questionBankWeb/questionBankAddCommit`,this.questionBankWebAddForm)
          const { data:{ code, msg } } = res
          if(code == 200){
              this.$message.success(msg)
              this.addQuestionbankShow = false
              this.getQuestionbanklist()
          }
       },
       // 删除逻辑
       // 单删 -- 
       hanleDeleQuestionbank(rows){
            this.$confirm('确定删除该题库?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
            // 删除逻辑
                const res = await this.$http.delete(`/api/v1/questionBankWeb/questionBankDeleteById?id=${rows.id}`)
                const { data: { code, msg } } = res
                if(code === 200) {
                    this.getQuestionbanklist()
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
            const res = await this.$http.delete(`/api/v1/questionBankWeb/questionBankDeleteBatchById?${str}`)
            const { data: { code, msg } } = res
            if(code === 200) {
                this.getQuestionbanklist()
                this.$message.success(msg)
                return 
            }
            this.$message.warning(msg)
            
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
       // 修改逻辑功能
       // 修改弹框显示
       showEditQuestionbankDia(rows){
           this.editQuestionbankShow = true
           // 显示信息
           this.questionBankWebAddForm = rows
       },
       // 修改发请求
      async handleEditQuestionbank(){
            // 参数处理 userId professionId
            this.questionBankWebAddForm.professionId = 1
            this.questionBankWebAddForm.userId = sessionStorage.getItem('createId')
            // 发送请求
            const res = await this.$http.put(`/api/v1/questionBankWeb/questionBankUpdateCommit`,this.questionBankWebAddForm)
            const { data:{ code, msg } } = res
            if(code == 200){
            this.$message.success(msg)
            this.editQuestionbankShow = false
            this.getQuestionbanklist()
            }
       },
       // 查看功能
       hanlePreviewQuestionbank(rows){
           // 显示弹框和信息
           this.previewQuestionbankShow = true
           this.questionBankWebAddForm = rows

       },
       // 分页
        handleSizeChange (val) {
          this.pagesize = val
          this.getQuestionbanklist()
        },
        handleCurrentChange (val) {
          this.pagenum = val
          this.getQuestionbanklist()
        },
        // 新增弹出框关闭cb
        addquestionCB(){
          this.questionBankWebAddForm = {}
        },
        // 修改弹出框关闭cb
        editquestionCB(){
          this.questionBankWebAddForm = {}

        },
        previewquestionCB(){
         this.questionBankWebAddForm = {}
        }
        
    }
}
</script>

<style>

</style>
