<template>
    <el-card>
         <!-- 查询修改 -->
        <el-row>
            <el-col :span="5">
                <el-input v-model="searchVal" 
                          placeholder="请输入参数名"  
                          :clearable="true"
                          @keyup.enter.native="handleSearch">
                  
                </el-input>
                
            </el-col>
            <el-col :span="2"><el-button @click="handleSearch" native-type="submit" icon="el-icon-search"></el-button></el-col>
            <el-col :span="16">
              
                 <el-button 
                    @click="showAddColumn()"
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
            :data="columnTableList"
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
            width="300">
            </el-table-column>
           
             <el-table-column
            prop="describes"
            label="描述"
            width="250">
            </el-table-column>
             <el-table-column
            prop="orders"
            label="排序"
            width="90">
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
                          @click="showEditColumnDia(scope.row)"
                         >编辑</el-button>
              <el-button  plain 
                          size="mini" 
                          type="text" 
                          @click="hanleDeleColumn(scope.row)"
                          >删除</el-button>
            <el-button  plain 
                        size="mini" 
                        type="text" 
                        @click="hanleLookColumn(scope.row)"
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
       <!--  新增弹框 -->
        <el-dialog title="新增栏目"
                   @closed="addColumnCB()"
                   :visible.sync="addColumnshowDia">
          <el-form :model="addColumnForm">
        
             <el-form-item label="栏目名称:" :label-width="formLabelWidth" >
              <el-input v-model="addColumnForm.name" autocomplete="off" placeholder="课件名称"></el-input>
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth" >
              <el-input v-model="addColumnForm.remake" autocomplete="off" placeholder="备注信息"></el-input>
            </el-form-item>
            <el-form-item label="描述信息:" :label-width="formLabelWidth" >
              <el-input v-model="addColumnForm.describes" autocomplete="off" placeholder="描述信息"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addColumnshowDia = false">取 消</el-button>
            <el-button type="primary" @click="handleAddColumn()">确 定</el-button>
          </div>
        </el-dialog>
         <!--  编辑弹框 -->
        <el-dialog title="编辑栏目"
                   @closed="editColumnCB()"
                   :visible.sync="editColumnshowDia">
          <el-form :model="addColumnForm">
        
             <el-form-item label="栏目名称:" :label-width="formLabelWidth" >
              <el-input v-model="addColumnForm.name" autocomplete="off" placeholder="课件名称"></el-input>
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth" >
              <el-input v-model="addColumnForm.remake" autocomplete="off" placeholder="备注信息"></el-input>
            </el-form-item>
            <el-form-item label="描述信息:" :label-width="formLabelWidth" >
              <el-input v-model="addColumnForm.describes" autocomplete="off" placeholder="描述信息"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editColumnshowDia = false">取 消</el-button>
            <el-button type="primary" @click="handleEditColumn()">确 定</el-button>
          </div>
        </el-dialog>
         <!--  查看弹框 -->
        <el-dialog title="查看栏目"
                   @closed="editColumnCB()"
                   :visible.sync="previewColumnshowDia">
          <el-form :model="addColumnForm" :disabled="true">
        
             <el-form-item label="栏目名称:" :label-width="formLabelWidth" >
              <el-input v-model="addColumnForm.name" autocomplete="off" placeholder="课件名称"></el-input>
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth" >
              <el-input v-model="addColumnForm.remake" autocomplete="off" placeholder="备注信息"></el-input>
            </el-form-item>
            <el-form-item label="描述信息:" :label-width="formLabelWidth" >
              <el-input v-model="addColumnForm.describes" autocomplete="off" placeholder="描述信息"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="previewColumnshowDia = false" type="primary">关闭</el-button>
          </div>
        </el-dialog>
        
       
    </el-card>
</template>

<script>
export default {
    mounted(){
       
    },
    data(){
        return{
            // commmon配置参数
            // 表格加载动画
            isLoading: true,
            // 新增显示
            addColumnshowDia:false,
            // 编辑显示
            editColumnshowDia:false,
            // 查看
            previewColumnshowDia:false,
            formLabelWidth:'100px',
             // 批量删除ids
            ids:[],
            // 批量删除行信息
            tableChecked:[],
            searchVal:'',
            // 分页相关的属性
            pagenum: 1,
            pagesize: 4,
            total: 20,
            value:'',
            // table数据
            columnTableList:[],
            // 新增栏目数据
            addColumnForm:{}
        }
    },
    mounted(){
      this.loadColumnList()
    },
    methods:{
      // 加载列表
       async loadColumnList(){
         const res = await this.$http.post(`/api/v1/courseWareColumnWebApi/getCourseWareColumnList`,{
            "name": this.searchVal || null,
            "pageNum": this.pagenum,
            "pageSize": this.pagesize
         })
         const { data: { code, result } } = res
         console.log(res)
         if(code === 200){
           this.isLoading = false
           this.columnTableList = result.courseWareColumnList
           this.total = result.total
           console.log(this.columnTableList)
         }
       },
       // 搜索功能
       handleSearch(){
          this.loadColumnList()
       },
       // 新增栏目 弹出框 发请求
       showAddColumn(){
         this.addColumnshowDia = true
       },
      async handleAddColumn(){
        // 用户id
        this.addColumnForm.userId = sessionStorage.getItem('createId')
        const res = await this.$http.post(`/api/v1/courseWareColumnWebApi/courseWareColumnAddCommit`,this.addColumnForm)
        const { data: { code, msg, result } } = res
        if(code === 200){
          this.addColumnshowDia = false
          this.$message.success(msg)
          this.loadColumnList()
          // 清空表单
          this.addColumnForm = {}
        }
      },
      // 编辑功能
      showEditColumnDia(rows){
        this.editColumnshowDia = true
        // 显示信息
        this.addColumnForm = rows
      },
     async handleEditColumn(){
       // 用户id
        this.addColumnForm.userId = sessionStorage.getItem('createId')
        const res = await this.$http.put(`/api/v1/courseWareColumnWebApi/courseWareColumnUpdateCommit`,this.addColumnForm)
        console.log(res)
        const { data: { code, msg, result } } = res
        if(code === 200){
          this.editColumnshowDia = false
          this.$message.success(msg)
          this.loadColumnList()
          // 清空表单
          this.addColumnForm = {}
        }else{
          this.$message.error(msg)
        }
      },
      // 删除
      // 1. 单个删除
        hanleDeleColumn(row){
          this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
          // 删除逻辑
            const res = await this.$http.delete(`/api/v1/courseWareColumnWebApi/courseWareColumnDeleteById?id=${row.id}`)
            console.log(res)
            const { data } = res
            if(data.code == 200){
                this.$message.success(data.msg)
                this.loadColumnList()
            }
            
          }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })
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
            const res = await this.$http.delete(`/api/v1/courseWareColumnWebApi/courseWareColumnDeleteBatchById?${str}`)
            const { data } = res
            if(data.code == 200){
                this.$message.success(data.msg)
                this.loadColumnList()
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
        // 查看功能
        hanleLookColumn(rows){
          this.previewColumnshowDia = true
          // 显示信息
          this.addColumnForm = rows
        },
         // 分页
        handleSizeChange (val) {
          this.pagesize = val
          this.loadColumnList()
        },
        handleCurrentChange (val) {
          this.pagenum = val
          this.loadColumnList()
        },
       
        // 新增关闭
        addColumnCB(){
          this.addColumnForm = {}
        },
        editColumnCB(){
          this.addColumnForm = {}
        }
    }
    
    
}
</script>

<style>

</style>
