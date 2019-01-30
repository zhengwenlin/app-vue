<template>
    <el-card>
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
                    @click="tocreateExam()"
                    type="primary">创建试卷</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
         <el-table
             v-loading="isLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            ref="multipleTable"
            :data="examListTable"
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
            width="320">
            </el-table-column>
             <el-table-column
            prop="questionKindCount"
            label="试题分布"
            width="300">
                <template slot-scope="scope">
                   判断题: {{ JSON.parse(scope.row.questionKindCount).judgment }} 道 / 
                   选择题: {{ JSON.parse(scope.row.questionKindCount).single }} 道 /
                   多选题: {{ JSON.parse(scope.row.questionKindCount).multiple }} 道
                </template>
            </el-table-column>
             <el-table-column
            prop="msg"
            label="试卷说明"
            width="250">
            </el-table-column>
             <el-table-column
            label="发布状态"
            prop="isShow"
            align="center"
            width="90">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isShow == 1" type="success" size="mini">发布中</el-tag>
                    <el-tag v-else-if="scope.row.isShow == 0" type="danger" size="mini">未发布</el-tag>
                </template>
            </el-table-column>
            
             <el-table-column
            label="创建时间"
            prop="createTime"
            width="170">
            </el-table-column>
             <el-table-column
            prop="updateTime"
            label="更新时间"
            width="170">
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              fixed="right"
              width="180">
            <template slot-scope="scope">
              <el-button  plain 
                          size="mini" 
                          type="text" 
                          @click="hanleDeleExam(scope.row)"
                          >删除</el-button>
            <el-button  plain 
                        size="mini" 
                        type="text" 
                        @click="hanlepreviwExam(scope.row)"
                        >查看</el-button>
             
                           <el-switch 
                          style="margin-left:10px;"
                          v-model="scope.row.flagIsShow"
                          :value="0"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          @change="changeSwitch($event,scope.row)" >
              </el-switch>
              
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
        <!-- 查看试卷 -->
         <el-dialog title="查看试卷"
                   width="60%"
                   :visible.sync="previewExamshowDia">
          <el-form :model="previewForm" :disabled="true">
        
             <el-form-item label="试卷名称:" :label-width="formLabelWidth" >
              <el-input v-model="previewForm.name" autocomplete="off" placeholder="课件名称"></el-input>
            </el-form-item>
            
            <el-form-item label="内容说明:" :label-width="formLabelWidth" >
              <el-input v-model="previewForm.msg" autocomplete="off" placeholder="描述信息"></el-input>
            </el-form-item>
             <el-form-item label="是否发布:" :label-width="formLabelWidth" >
              <el-select v-model="previewForm.isShow" >
                      <el-option label="已发布" :value="1"></el-option>
                      <el-option label="未发布" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth" >
              <el-input v-model="previewForm.remake" autocomplete="off" placeholder="备注信息"></el-input>
            </el-form-item>
             <el-form-item label="开始时间:" :label-width="formLabelWidth" >
              <el-input v-model="previewForm.startTime" autocomplete="off" placeholder="备注信息"></el-input>
            </el-form-item>
             <el-form-item label="结束时间:" :label-width="formLabelWidth" >
              <el-input v-model="previewForm.overTime" autocomplete="off" placeholder="备注信息"></el-input>
            </el-form-item>
             <el-table
             height="250"
             v-loading="isLoading"
             :row-style="{height:'0px'}"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            ref="multipleTable"
            :data="queExaList"
            tooltip-effect="dark"
            style="width: 100%; margin-top:25px; "
            border>
             <el-table-column
            prop="questionExaminationKind"
            align="center"
            label="类型"
            width="80">
              <template slot-scope="scope">
                    <el-tag v-if="scope.row.questionExaminationKind == 1" type="success" size="mini">判断</el-tag>
                    <el-tag v-else-if="scope.row.questionExaminationKind == 2" type="warning" size="mini">单选</el-tag>
                    <el-tag v-else-if="scope.row.questionExaminationKind == 3" type="danger" size="mini">多选</el-tag>
              </template>
            </el-table-column>
             <el-table-column
            prop="questionExaminationMsg"
            label="题目"
            width="300">
            </el-table-column>
             <el-table-column
            prop="questionExaminationOptions"            
            label="选项"
            width="250">
            
            </el-table-column>
             <el-table-column
            prop="questionExaminationAnswer"
            label="答案"
            width="60">
            </el-table-column>
             <el-table-column
            prop="questionExaminationQuestionAnalysis"
            label="解析"
            width="150">
            </el-table-column> 
        </el-table>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="previewExamshowDia = false" type="primary">关闭</el-button>
          </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data(){
        return{
            // commmon配置参数
            // 表格加载动画
            isLoading: true,
            formLabelWidth:'100px',
            // 查看显示
            previewExamshowDia:false,
            searchVal:'',
              // 分页相关的属性
            pagenum: 1,
            pagesize: 4,
            total: 20,
            // table数据
            examListTable:[],
            //查看form数据
            previewForm:{},
            //试题表格数据
            queExaList:[],
            //通知人员
            noticeUser:[]
        }
    },
    mounted(){
        this.loadExamPaperList()
    },
    methods:{
         // 加载列表
       async loadExamPaperList(){
         const res = await this.$http.post(`/api/v1/webQuestionExaminationInfoApi/get/queExaInfoList`,{
            "findParam": this.searchVal,
            "pageNum": this.pagenum,
            "pageSize": this.pagesize
         })
         console.log(res)
         const { data: { code, result } } = res
         if(code === 200){
             this.isLoading = false
             this.examListTable = result.list
             this.total = result.total
             console.log(result)
         }
       
       },
        // 搜索功能
       handleSearch(){
          this.loadExamPaperList()
       },
       // 新增跳转
       tocreateExam(){
           this.$router.push('/createexam')
       },
       // 删除试卷
      hanleDeleExam(rows){
        this.$confirm('确定删除该课件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
           // 删除逻辑
           const res = await this.$http.delete(`/api/v1/webQuestionExaminationInfoApi/change/queExaInfoDel?id=${rows.id}&type=1`)
            const { data } = res
            console.log(res)
            if(data.code === 200){
                this.$message.success(data.msg)
                this.loadExamPaperList()

            }
            
          }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })
          })
    },
    // 发布试卷
   async changeSwitch(states,rows){
       console.log(states)
       console.log(rows)
        var isShow = states? 1: 0
        const res = await this.$http.put(`/api/v1/webQuestionExaminationInfoApi/change/queExaInfoShow?id=${rows.id}&isShow=${isShow}&userId=${sessionStorage.getItem('createId')}`)
        const { data:{ code, msg } } = res
        if(code === 200){
            this.$message.success(msg)
            this.loadExamPaperList()   
        }
    },
    // 查看试卷
   async hanlepreviwExam(rows){
     // 显示弹出框
     console.log(rows)
     this.previewExamshowDia = true
     //查询指定试卷详细信息
     const res = await this.$http.get(`/api/v1/webQuestionExaminationInfoApi/get/queExaInfoById?id=${rows.id}`)
     const { data: {code, result } } = res
     if(code === 200){
         this.previewForm = result
         this.queExaList = result.queExaList // 试题
         this.noticeUser = result.noticeUser // 人员
     }

    },
    handleSelectionChange(){

    },
    // 分页
    handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
        this.pagesize = val
        this.loadExamPaperList()
    },
    handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
        this.pagenum = val
        this.loadExamPaperList()
    },
    }
}
</script>

<style>

</style>
