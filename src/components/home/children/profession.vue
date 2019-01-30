<template>
   <el-card>
        <el-row>
            <el-col :span="8">
                <!-- 选择专业下拉框 -->
                <span>请选择专业: </span>
                <el-select v-model="professvalue" 
                           @change="loadLevelprofessList"
                           placeholder="一级专业/二级专业">
                    <el-option label="所有专业" :value="''" :checked="true"></el-option>
                    <el-option label="一级专业" :value="1"></el-option>
                    <el-option label="二级专业" :value="2"></el-option> 
             </el-select>
            </el-col>
            <el-col :span="16">
               
                 <el-button 
                 @click="showAddProfession()"
                 type="primary">新增</el-button>
                 <el-button 
                    @click="batchDelete(tableChecked)"
                    type="danger">批量删除</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
          <el-table
             v-loading="isLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            ref="multipleTable"
            id="contentTable"
            :data="professionListForm"
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
            prop="orders"
            label="排序"
            width="120">
            </el-table-column>
             <el-table-column
            label="专业等级"
            align="center"
            width="">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level == 1" type="success" size="mini">一级专业</el-tag>
                    <el-tag v-else-if="scope.row.level == 2" type="warning" size="mini">二级专业</el-tag>
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
              label="操作" width="130" >
            <template slot-scope="scope">
              <el-button  plain 
                          size="small" 
                          type="text" 
                          @click="showEditProfessDia(scope.row)"
                          >修改</el-button>
              <el-button  plain 
                          size="small" 
                          type="text" 
                          @click="hanleDeleteProfess(scope.row)"
                          >删除</el-button>
              <el-button  plain 
                          size="small" 
                          @click="hanleLookProfess(scope.row)"
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
               <!-- 新增专业弹出框 -->
        <el-dialog title="新增专业" 
                   @close="addProfessCB()"
                   :visible.sync="addProfessionShow" 
                   width="50%"
                   :fullscreen="false">
          <el-form :model="addProfessionForm">
           
             <el-form-item label="专业名称:" :label-width="formLabelWidth">
                <el-input v-model="addProfessionForm.name" autocomplete="off" placeholder="专业名称"></el-input> 
            </el-form-item>
            
             <el-form-item label="专业等级:" :label-width="formLabelWidth">
                <el-select v-model="addProfessionForm.level" placeholder="一级专业/二级专业" :clearable="true">
                    <el-option label="一级专业" :value="1"></el-option>
                    <el-option label="二级专业" :value="2"></el-option>
             </el-select>
            </el-form-item>
             <el-form-item label="删除状态:" :label-width="formLabelWidth">
                <el-select v-model="addProfessionForm.delLogic" placeholder="是否删除" :clearable="true">
                    <el-option label="未删" :value="0"></el-option>
                    <el-option label="已删" :value="1"></el-option>
             </el-select>
            </el-form-item>
            <el-form-item label="描述:" :label-width="formLabelWidth">
                <el-input v-model="addProfessionForm.describes" autocomplete="off" placeholder="专业描述" type=""></el-input> 
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth">
                <el-input v-model="addProfessionForm.remake" autocomplete="off" placeholder="备注信息" type=""></el-input> 
            </el-form-item>
            
            
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addProfessionShow = false">取 消</el-button>
            <el-button type="primary" @click="handleAddProfess()">确 定</el-button>
          </div>
        </el-dialog>
          <!-- 修改专业弹出框 -->
        <el-dialog title="修改专业" 
                   @closed="editProfessCB()"
                   :visible.sync="editProfessionShow" 
                   width="50%"
                   :fullscreen="false">
          <el-form :model="addProfessionForm">
           
             <el-form-item label="专业名称:" :label-width="formLabelWidth">
                <el-input v-model="addProfessionForm.name" autocomplete="off" placeholder="专业名称"></el-input> 
            </el-form-item>
            
             <el-form-item label="专业等级:" :label-width="formLabelWidth">
                <el-select v-model="addProfessionForm.level" placeholder="一级专业/二级专业" :clearable="true">
                    <el-option label="一级专业" :value="1"></el-option>
                    <el-option label="二级专业" :value="2"></el-option>
             </el-select>
            </el-form-item>
             <el-form-item label="删除状态:" :label-width="formLabelWidth">
                <el-select v-model="addProfessionForm.delLogic" placeholder="是否删除" :clearable="true">
                    <el-option label="未删" :value="0"></el-option>
                    <el-option label="已删" :value="1"></el-option>
             </el-select>
            </el-form-item>
            <el-form-item label="描述:" :label-width="formLabelWidth">
                <el-input v-model="addProfessionForm.describes" autocomplete="off" placeholder="专业描述" type=""></el-input> 
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth">
                <el-input v-model="addProfessionForm.remake" autocomplete="off" placeholder="备注信息" type=""></el-input> 
            </el-form-item>
            
            
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editProfessionShow = false">取 消</el-button>
            <el-button type="primary" @click="handleEditProfess()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 查看专业弹出框 -->
        <el-dialog title="查看专业" 
                   @closed="previewProfessCB()"
                   :visible.sync="previewProfessionShow" 
                   width="50%"
                   :fullscreen="false">
          <el-form :model="addProfessionForm" :disabled="true">
           
             <el-form-item label="专业名称:" :label-width="formLabelWidth">
                <el-input v-model="addProfessionForm.name" autocomplete="off" placeholder="专业名称"></el-input> 
            </el-form-item>
            
             <el-form-item label="专业等级:" :label-width="formLabelWidth">
                <el-select v-model="addProfessionForm.level" placeholder="一级专业/二级专业" :clearable="true">
                    <el-option label="一级专业" :value="1"></el-option>
                    <el-option label="二级专业" :value="2"></el-option>
             </el-select>
            </el-form-item>
             <el-form-item label="删除状态:" :label-width="formLabelWidth">
                <el-select v-model="addProfessionForm.delLogic" placeholder="是否删除" :clearable="true">
                    <el-option label="未删" :value="0"></el-option>
                    <el-option label="已删" :value="1"></el-option>
             </el-select>
            </el-form-item>
            <el-form-item label="描述:" :label-width="formLabelWidth">
                <el-input v-model="addProfessionForm.describes" autocomplete="off" placeholder="专业描述" type=""></el-input> 
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth">
                <el-input v-model="addProfessionForm.remake" autocomplete="off" placeholder="备注信息" type=""></el-input> 
            </el-form-item>
            
            
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="previewProfessionShow = false">关闭</el-button>
          </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data(){
        return{
             // 分页相关的属性
            pagenum: 1,
            pagesize: 4,
            total: 20,
            isLoading:true,
            formLabelWidth:'80px',
             // 批量删除ids
            ids:[],
            // 批量删除行信息
            tableChecked:[],
            // 新增弹出框显示
            addProfessionShow:false,
            // 修改弹出框显示
            editProfessionShow:false,
            // 预览
            previewProfessionShow:false,
            // 专业level
            professvalue:'',
            // table数据
            professionListForm:[],
            // 新增数据
            addProfessionForm:{
                "delLogic": '',
                "describes": "",
                "level": '',
                "name": "",
                "parentId": '',
                "remake": "备注",
                "userId": ''
            }
        }
    },
    mounted(){
        this.loadProfesslist()
    },
    methods:{
        // 查询所有专业列表
        async loadProfesslist(){
            const res = await this.$http.post(`/api/v1/professionWeb/getProfessionListPage`,{
                "level": this.professvalue || null,
                "pageNum": this.pagenum,
                "pageSize": this.pagesize
            })
            console.log(res)
            console.log('ccc')
            const { data:{ code, result } } = res
            if(code === 200){
                this.isLoading = false
                this.professionListForm = result.professionList
                this.total = result.total
            }
        },
        // 分等级查询专业列表
        loadLevelprofessList(){
          this.loadProfesslist()
        },
        //新增逻辑功能
        // 1. 弹出框显示(新增)
        showAddProfession(){
            this.addProfessionShow = true
        },
        // 2. 新增发送请求
       async handleAddProfess(){
           // 处理参数 userId parentId
           this.addProfessionForm.userId = sessionStorage.getItem('createId')
           this.addProfessionForm.parentId = this.addProfessionForm.level == 1? 0: 1
           // 发送请求
           const res = await this.$http.post(`/api/v1/professionWeb/professionAddCommit`,this.addProfessionForm)
           const { data:{ code, result, msg } } = res
            if(code === 200){
                this.$message.success(msg)
                this.addProfessionShow = false
                this.loadProfesslist()
                this.addProfessionForm = {}
            }
        },
        // 删除逻辑功能
        // 单删 --
        hanleDeleteProfess(rows){
            this.$confirm('确定删除该专业?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async () => {
            // 删除逻辑
            console.log(rows)
            const res = await this.$http.delete(`/api/v1/professionWeb/professionDeleteById?id=${rows.id}`)
            const { data: { code, msg } } = res
            if(code === 200) {
            this.loadProfesslist()
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
            const res = await this.$http.delete(`/api/v1/professionWeb/professionDeleteBatchById?${str}`)
            const { data } = res
            if(data.code == 200){
                this.$message.success(data.msg)
                this.loadProfesslist()
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
        // 编辑功能实现
        // 1. 显示弹框
        showEditProfessDia(rows){
            console.log(rows)
            console.log('msg')
            this.editProfessionShow = true
            this.addProfessionForm = rows
        },
       async handleEditProfess(){
             // 处理参数 userId parentId
           this.addProfessionForm.userId = sessionStorage.getItem('createId')
           this.addProfessionForm.parentId = this.addProfessionForm.level == 1? 0: 1
           // 发送请求
           const res = await this.$http.put(`/api/v1/professionWeb/professionUpdateCommit`,this.addProfessionForm)
           const { data:{ code, result, msg } } = res
            if(code === 200){
                this.$message.success(msg)

                this.editProfessionShow = false
                this.loadProfesslist()
                this.addProfessionForm = {}
            }
        },
        // 查看
        hanleLookProfess(rows){
            this.previewProfessionShow = true
            this.addProfessionForm = rows
        },
         // 分页
        handleSizeChange (val) {
          this.pagesize = val
          this.loadProfesslist()
        },
        handleCurrentChange (val) {
          this.pagenum = val
          this.loadProfesslist()
        },
       
        // 新增cb
        addProfessCB(){
         this.addProfessionForm = {}

        },
        editProfessCB(){
         this.addProfessionForm = {}

        },
        previewProfessCB(){
         this.addProfessionForm = {}

        }

    }
}
</script>

<style>

</style>
