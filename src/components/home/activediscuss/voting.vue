<template>
    <el-card>
         <el-row>
            <el-col :span="8">
               
            </el-col>
            <el-col :span="16">
               
                 <el-button 
                 @click="$router.push({name:'addvoting'})"
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
            :data="votingList"
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
            width="200">
            </el-table-column>
             <el-table-column
            prop="content"
            label="内容"
            width="200">
            </el-table-column>
             <el-table-column
            prop="type"
            label="状态"
            width="80">
            </el-table-column>
             <el-table-column
            
            label="是否公开"
            width="80">
            <template slot-scope="scope"> 
                <span v-if="scope.row.isLook == 1">是</span>
                <span v-else-if="scope.row.isLook == 2">否</span>
            </template>
            </el-table-column>
             <el-table-column
            label="类别"
            width="60">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.sort == 1" type="warning" size="mini">问卷</el-tag>
                    <el-tag v-else-if="scope.row.sort == 2" type="danger" size="mini">投票</el-tag>
                    <el-tag v-else-if="scope.row.sort == 2" type="info" size="mini">活动</el-tag>
                    <el-tag v-else-if="scope.row.sort == 2" type="success" size="mini">采集</el-tag>
                </template>
            </el-table-column>
            <el-table-column
            prop="pictureUrl"
            label="主题图片"
            width="120">
            <template slot-scope="scope"><img v-bind:src=scope.row.pictureUrl style="display:block; width:100px;height:60px" alt="图片无法正常显示"></template>
            </el-table-column>
            <el-table-column
            label="创建时间"
            prop="createTime"
            width="160">
            </el-table-column>
             <el-table-column
            label="开始时间"
            prop="startTime"
            width="160">
            </el-table-column>
             <el-table-column
            prop="overtTime"
            label="结束时间"
            width="160">
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              width="130">
            <template slot-scope="scope">
              <el-button  plain 
                          size="small" 
                          type="text" 
                          @click="showEditquestionnaire(scope.row)"
                         >编辑</el-button>
              <el-button  plain 
                          size="mini" 
                          type="text" 
                          @click="hanleDeleVoting(scope.row)"
                          >删除</el-button>
            <el-button  plain 
                        size="mini" 
                        type="text" 
                        @click="hanlePreviewVoting(scope.row)"
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
         <!--查看的弹出框 -->
        <el-dialog title="查看问卷" 
                   :visible.sync="previewVotingShow" 
                   width="50%"
                   :fullscreen="false">
          <el-form :model="form" :disabled="true">
               <el-form-item label="类别:" :label-width="formLabelWidth">
                <el-select v-model="form.sort" placeholder="问卷/投票/活动/采集" :clearable="true">
                    <el-option label="问卷" :value="1"></el-option>
                    <el-option label="投票" :value="2"></el-option>
                    <el-option label="活动" :value="3"></el-option>
                    <el-option label="采集" :value="4"></el-option>
             </el-select>
            </el-form-item>
             <el-form-item label="题目:" :label-width="formLabelWidth">
              <el-input v-model="form.title" autocomplete="off"></el-input>
            </el-form-item>
           <el-form-item label="内容:" :label-width="formLabelWidth">
              <el-input v-model="form.content" 
                        type="textarea"
                        autosize
                        placeholder="请输入问卷内容"
                        autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item label="部门:" :label-width="formLabelWidth">
                <el-checkbox-group v-model="checkedIds">
                    <el-checkbox
                         style="margin: 0 10px;"
                         v-for="(item,index) in departmentList" :label="item.id" :key="index"  >{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
             <el-table
                ref="singleTable"
                height="250px"
                :data="questionsListPreview"
                highlight-current-row
                @current-change="handleCurrentChange"
                style="width: 100%">
                <el-table-column
                type="index"
                width="50">
                </el-table-column>
                 <el-table-column
                property="questionTitle"
                label="题目"
                width="180">
                </el-table-column>
                <el-table-column
                property="questionOptions"
                label="选项"
                width="350">
                     <!-- <template slot-scope="scope">
                        <span v-for="(item,index) in JSON.parse(scope.row.questionOptions)" :key="index">{{item}}</span>
                    </template> -->
                </el-table-column>
               
                <el-table-column
                property="questionKind"
                label="类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.questionKind == 1" type="warning" size="mini">判断</el-tag>
                        <el-tag v-else-if="scope.row.questionKind == 2" type="danger" size="mini">单选</el-tag>
                        <el-tag v-else-if="scope.row.questionKind == 3" type="info" size="mini">多选</el-tag>
                        <el-tag v-else-if="scope.row.questionKind == 4" type="text" size="mini">文本</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <el-form-item label="是否公开:" :label-width="formLabelWidth">
                <el-select v-model="form.isLook" placeholder="是/否" :clearable="true">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="2"></el-option>
             </el-select>
            </el-form-item>
               
              <el-form-item label="开始时间:" :label-width="formLabelWidth">
                   <el-date-picker
                        v-model="form.startTime"
                        value-format="yyyy-MM-dd HH-mm-ss"
                        type="datetime"
                        placeholder="选择开始时间">
                   </el-date-picker>
            </el-form-item>
              <el-form-item label="结束时间:" :label-width="formLabelWidth">
                   <el-date-picker
                        v-model="form.overTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH-mm-ss"
                        placeholder="选择结束时间">
                   </el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="previewVotingShow = false" type="primary">关闭</el-button>
          </div>
        </el-dialog>
        
       
    </el-card>
</template>

<script>
export default {
    data(){
        return{
             // commmon配置参数
            // 新增问卷弹窗口显示
            addQuesnaireShow:false,
            innerVisible:false,
            previewVotingShow:false,
            // 表格加载动画
            isLoading: true,
            formLabelWidth:'100px',
             // 批量删除ids
            ids:[],
            // 批量删除行信息
            tableChecked:[],
           
            // 分页相关的属性
            pagenum: 1,
            pagesize: 4,
            total: 20,
            // table 数据
            votingList:[],
             // 选中部门列表
            checkedIds:[],
            // 部门列表
            departmentList:[],
            // 查看数据
            form:{},
            //问题列表
            questionsListPreview:[]
        }
    },
    created(){
        this.loadVotingList()
        this.getDepartmentList()
    },
    methods:{
             // 渲染部门列表
        // /web/v1/webQuestionnaire/get/department
        async getDepartmentList(){
            const res = await this.$http.post(`/web/v1/webQuestionnaire/get/department`)
            const { data:{ code, result } } = res
            if(code === 200) {
                this.departmentList = result
            }
            
        },
        async loadVotingList(){
           const res = await this.$http.post(`/web/v1/webQuestionnaire/get/allQuestionnaire`,{
               "pageNum":this.pagenum,
               "pageSize":this.pagesize,
               "sort":2,
               "userId":sessionStorage.getItem('createId') 
           })
           console.log(res)
           const { data: { code, result:{ list,total } } } = res
           if(code === 200){
               this.isLoading = false
               this.votingList = list
               this.total = total
           }
        },
        // 编辑逻辑
        showEditquestionnaire(rows){
            console.log(rows.id)
            this.$router.push({
                path: '/editquestionnaire',   
               
            })
            // 传值id
            this.$store.commit('discussId',rows.id)
        },
        // 删除逻辑
        // 单个删除
        hanleDeleVoting(rows){
            this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async () => {

              // 批量删除逻辑
            this.ids.push(rows.id)
            const res = await this.$http.post(`/web/v1/webQuestionnaire/hide/questionnaireById`,this.ids)
            console.log(res)
            const { data: { code, msg } } = res
            if(code == 200){
                this.$message.success(msg)
                this.loadVotingList()
                this.ids = []
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
            console.log(rows)
            console.log('cccccc')
            this.ids = []
            rows.forEach(element =>{
            this.ids.push(element.id)
            })
            // 批量删除逻辑
            const res = await this.$http.post(`/web/v1/webQuestionnaire/hide/questionnaireById`,this.ids)
            console.log(res)
            const { data: { code, msg } } = res
            if(code == 200){
                this.$message.success(msg)
                this.loadVotingList()
                this.ids = []
            }
            
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })         
            })    
           
        },
         handleSelectionChange(val){
             console.log(val)
            this.tableChecked = val
            
        },
         // 查看功能
       async hanlePreviewVoting(rows){
            this.previewVotingShow = true
           
            console.log(rows)
            const res = await this.$http.post(`/web/v1/webQuestionnaire/get/questionnaireById?id=${rows.id}`)
            const { data: { code,result } } = res 
            console.log(res)
            if(code === 200){
                // 表单
                this.form = result
                // 部门
                this.checkedIds = JSON.parse(result.departmentList)
                // 问题列表
                this.questionsListPreview = result.webQuestionnaireQuestionBoList
            }
        },
        // 分页
        handleSizeChange (val) {
          this.pagesize = val
          this.loadVotingList()
        },
        handleCurrentChange (val) {
          this.pagenum = val
          this.loadVotingList()
        }
    }
}
</script>

<style>

</style>
