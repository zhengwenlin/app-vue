<template>
<el-card>
    <!-- 提示框 -->
  <el-alert class="alert" title="创建试卷" type="success" center :closable="false" show-icon></el-alert>
  <!-- 步骤条 -->
  <el-steps class="steps" :space="400" align-center :active="active*1" finish-status="success">
    <el-step title="试卷信息"></el-step>
    <el-step title="添加试题"></el-step>
    <el-step title="部门人员"></el-step>
    <el-step title="创建试卷"></el-step>
  </el-steps>
  <!-- tabs选项卡 -->
  <!-- element-ui已经封装好了，当切换时,v-model的值自动切换为el-tabs-pane的name对应的值. -->
  <el-form class="form" label-position="right" :model="form" label-width="100px">
    <el-tabs @tab-click="handleTabClick" class="tabs" v-model="active" tab-position="left" type="border-card">

      <el-tab-pane name="1" label="试卷信息">
        <el-form-item label="试卷名称:">
          <el-input v-model="form.name" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="考试时间:">
          <el-input v-model="form.examinationTime" placeholder="必填/单位:min"></el-input>
        </el-form-item>
        <el-form-item label="是否发布:">
          <!-- <el-input v-model="form.isShow" placeholder="必填"></el-input> -->
          <el-select v-model="form.isShow" placeholder="是否发布">
                      <el-option label="不发布" :value="0" :selected="true"></el-option>
                      <el-option label="发布" :value="1"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="开始时间:" :label-width="formLabelWidth">
                   <el-date-picker
                        value-format="yyyy-MM-dd HH-mm-ss"
                        v-model="form.startTime"
                        type="datetime"
                        placeholder="选择开始时间">
                   </el-date-picker>
            </el-form-item>
              <el-form-item label="结束时间:" :label-width="formLabelWidth">
                   <el-date-picker
                        value-format="yyyy-MM-dd HH-mm-ss"
                        v-model="form.overTime"
                        type="datetime"
                        placeholder="选择结束时间">
                   </el-date-picker>
            </el-form-item> 
              <el-form-item label="试卷说明:">
          <el-input v-model="form.msg" placeholder="必填" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="备注信息:">
          <el-input v-model="form.remake" placeholder="必填" type="textarea" :rows="3"></el-input>
        </el-form-item>
        
      </el-tab-pane>

      <el-tab-pane name="2" label="添加试题">
        <el-row>
            <el-col :span="7">
                <!-- 题库下拉框 -->
                <span>请选择专业: </span>
                <!-- 级联选择器 -->
                <el-cascader
                    clearable
                    :options="options"
                    :props="defaultProfession"
                    v-model="selectedOptions"
                    expand-trigger="hover"
                    @change="handleChange">
                </el-cascader>
                
            </el-col>
            <el-col :span="16">
                  <span>请选择题库: </span>
                <el-select v-model="questionBankValue" 
                          :disabled="isDisabled"
                           @change="loadQuestionList"
                           placeholder="请选择题库">
                    <el-option :value="''" :selected="true">所有试题</el-option>
                    <el-option
                    v-for="item in questionBankList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
                 <el-button 
                 style="margin-left:15px;"
                 @click="showAddQuestion()"
                 type="success">批量添加</el-button>
               
            </el-col>
        </el-row>
        <!-- 试题表格 -->
           <el-table
             v-loading="isLoading"
             :row-style="{height:'0px'}"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            ref="multipleTable"
            :data="questionListTable"
            tooltip-effect="dark"
            style="width: 100%; margin-top:25px; "
            border
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="50">
            </el-table-column>
             <el-table-column
            prop="questionKind"
            align="center"
            label="类型"
            width="80">
              <template slot-scope="scope">
                    <el-tag v-if="scope.row.questionKind == 1" type="success" size="mini">判断</el-tag>
                    <el-tag v-else-if="scope.row.questionKind == 2" type="warning" size="mini">单选</el-tag>
                    <el-tag v-else-if="scope.row.questionKind == 3" type="danger" size="mini">多选</el-tag>
              </template>
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
              align="center"
              fixed="right"
              width="80">
            <template slot-scope="scope">
              <el-button   
                          size="mini" 
                          type="success" 
                          @click="addQuestionToStore(scope.row)"
                         >添加</el-button>
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
      </el-tab-pane>
      <el-tab-pane name="3" label="部门人员">
         <el-tree
            ref="tree"
            :data="departmentUsersList"
            show-checkbox
            default-expand-all
            node-key="id"
            :default-checked-keys="checkedList"
            :props="defaultProps">
          </el-tree>
      </el-tab-pane>
      <el-tab-pane name="4" label="创建试卷">
          <el-button 
             @click="createTestPaper"
             type="success">创建试卷</el-button>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      isLoading:true,
      // 题库下拉默认禁用
      isDisabled:true,
      formLabelWidth:'100px',
      selectedOptions:[],
        // 分页相关的属性
      pagenum: 1,
      pagesize: 6,
      total: 0,
      // tab 选中
      active: '1',
      // 整个试卷的数据--
      form:{},
      // 添加试题表格数据
      examQuestionList:[],
       // 级联下拉框的数据源
      options: [],
      // 级联下拉框的数据源配置
      defaultProfession: {
        value: 'id',
        label: 'name',
        children: 'childProfessionList'
      },
      // 二级专业id
      professId:'',
      // 题库数据
      questionBankList:[],
      // 题库id
      questionBankValue:'',
      // 试题table数据
      questionListTable:[],
      // 判断题数组
      judgeQuestionsArr:[],
      // 单选题数组
      sigleQuestionsArr:[],
      // 多选题数组
      multipleQuestionsArr:[],
      // 人员
    // 权限部门和人员列表
      departmentUsersList:[],
      defaultProps: {
        children: 'userList',
        label: 'name'
      },
      // 人员默认选中
      checkedList:[]

    }
  },
  created(){
    this.isShowNO()
  },
  mounted(){
    this.loadOptions()
    this.getDepartmentUsersListAll()
  },
  methods: {
    // 默认不发布设置
    isShowNO(){
      this.form.isShow = 0
    },
    // 获取专业级联
    async loadOptions () {
      const res = await this.$http.get(`/api/v1/webQuestionExaminationInfoApi/get/professionList`)
      console.log(res.data.result)
      this.options = res.data.result 
    },
    // 点击tab的函数
    async handleTabClick () {
     
    },
    // ========================
    handleChange (value) {
      if (value.length !== 2) {
        this.isDisabled = true
        this.$message.warning('请选择对应二级专业')
        return
      }
      this.isDisabled = false
      // 保存专业id
      this.professId = value[1]
      this.getBankListById()
    
    },
    //------------
    handleSelectionChange(){

    },
    // 根据专业id获取题库
   async getBankListById(){
     this.professId = this.professId || null
     const res = await this.$http.get(`/api/v1/webQuestionExaminationInfoApi/get/questionBankList?id=${this.professId}`)
     const { data: { code, result } } = res
     if( code === 200 ){
       this.questionBankList = result
     }
    },
    // 根据题库id获取试题
   async loadQuestionList(){
     if(!this.questionBankValue){
       this.$message.warning('请选择对应的题库')
       return
     }
      const res = await this.$http.post(`/api/v1/webQuestionExaminationInfoApi/get/questionList`,{
         "pageNum": this.pagenum,
         "pageSize": this.pagesize,
         "questionBankId": this.questionBankValue
      })
      //questionListTable
       const { data: { code, result: { list, total } } } = res
      
        if( code === 200 ){
          this.isLoading = false
          this.questionListTable = list 
          this.total = total
        }
    },
  // 添加试题到仓库
  // 单个添加
  addQuestionToStore(rows){
      // 单选 ---> questionKind = 2
      // 多选 ---> questionKind = 3
      // 判断 ---> questionKind = 1
      if(rows.questionKind == 1){
          if(this.judgeQuestionsArr.indexOf(rows.id) !== -1) {
            this.$message.warning('请勿重复添加')
            return
          }
          this.judgeQuestionsArr.push(rows.id)
          this.$message.success('添加成功')
      }else if(rows.questionKind == 2){
          if(this.sigleQuestionsArr.indexOf(rows.id) !== -1) {
            this.$message.warning('请勿重复添加')
            return
          }
          this.sigleQuestionsArr.push(rows.id)
          this.$message.success('添加成功')
      }else if(rows.questionKind == 3){
          if(this.multipleQuestionsArr.indexOf(rows.id) !== -1) {
            this.$message.warning('请勿重复添加')
            return
          }
          this.multipleQuestionsArr.push(rows.id)
          this.$message.success('添加成功')
      }
  },
  // 人员选择
  // async getUsersList(){
  //   const res = await this.$http.get(`/api/v1/webQuestionExaminationInfoApi/get/userParent?id=${sessionStorage.getItem('createId')}`)
  // },
    async getDepartmentUsersListAll(){
      const res = await this.$http.post(`/api/v1/departmentWebApi/getDepartmentUsersListAll`)
      const { data: { code, result } } = res
      if(code === 200){
        this.departmentUsersList = result
      }
    },
  // 创建试卷 -- 发送请求
  async createTestPaper(){
    // 处理参数 judgmentList  multipleList singleList type userId userList 
    this.form.judgmentList = this.judgeQuestionsArr
    this.form.multipleList = this.multipleQuestionsArr
    this.form.singleList = this.sigleQuestionsArr
    this.form.userId = sessionStorage.getItem('createId')
    this.form.userList = this.$refs.tree.getCheckedKeys(true)
    this.form.questionKindCount = JSON.stringify({single:this.sigleQuestionsArr.length,
                                   judgment:this.judgeQuestionsArr.length,
                                   multiple:this.multipleQuestionsArr.length})
   
    const res = await this.$http.post(`/api/v1/webQuestionExaminationInfoApi/add/queExaInfo`,this.form)
    const { data: { code, result } } = res
    if(code === 200){
      // 清空数组
      this.judgeQuestionsArr = []
      this.multipleQuestionsArr = []
      this.multipleQuestionsArr = []
      this.$message.success(result)
      // 跳转
      this.$router.push('/exammanage')

    }
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
  }
}
</script>

<style scoped>
.el-card{
    height: 95%;
}
.alert{
  
  margin-bottom: 10px;
}
.form{
  height: 460px;
  overflow: auto;
}
.editor{
  min-height: 400px;
}
.steps{
    margin: 10px 0;
    height: 100%;
}

</style>

