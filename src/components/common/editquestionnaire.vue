<template>
    <el-card>
          <span :style="{'text-align':'center',fontStyle:'nomal'}">修改问卷/活动/投票</span>
          <el-form :model="AddQuesNaireForm">
               <el-form-item label="类别:" :label-width="formLabelWidth" >
                <el-select v-model="AddQuesNaireForm.sort" placeholder="问卷/投票/活动/采集" :clearable="true" :disabled="true">
                    <el-option label="问卷" :value="1"></el-option>
                    <el-option label="投票" :value="2"></el-option>
                    <el-option label="活动" :value="3"></el-option>
                    <el-option label="采集" :value="4"></el-option>
             </el-select>
            </el-form-item>
             <el-form-item label="题目:" :label-width="formLabelWidth">
              <el-input v-model="AddQuesNaireForm.title" autocomplete="off"></el-input>
            </el-form-item>
           <el-form-item label="内容:" :label-width="formLabelWidth">
              <el-input v-model="AddQuesNaireForm.content" 
                        type="textarea"
                        :rows="2"
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
            <el-form-item label="是否公开:" :label-width="formLabelWidth">
                <el-select v-model="AddQuesNaireForm.isLook" placeholder="是/否" :clearable="true">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="2"></el-option>
             </el-select>
            </el-form-item>
             <el-form-item label="修改问题:" :label-width="formLabelWidth">
                    <el-button type="success" size="small" @click="showAddquestionDia" >添加问题</el-button>
                 <!-- 表格显示问题 -->
                   <el-table
                    border
                    style="margin-top:15px; width: 70%"
                    :data="questionTableList">
                     <el-table-column
                        type="index"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        prop="questionTitle"
                        label="题目"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        prop="questionOptions"
                        label="选项"
                        width="300">
                    </el-table-column>
                    <el-table-column
                        width=""
                        align="center"
                        prop="questionKind"
                        label="类型">
                         <template slot-scope="scope">
                                <el-tag v-if="scope.row.questionKind == 1" type="success" size="mini">判断</el-tag>
                                <el-tag v-else-if="scope.row.questionKind == 2" type="warning" size="mini">单选</el-tag>
                                <el-tag v-else-if="scope.row.questionKind == 3" type="danger" size="mini">多选</el-tag>
                        </template>
                    </el-table-column>

                     <el-table-column
                        label="操作"
                        align="center"
                        width="100">
                    <template slot-scope="scope">
                    <el-button  type="danger" 
                                circle
                                plain
                                size="small" 
                                icon="el-icon-delete"
                                @click="deletequestionsigle(scope.$index,scope.row)"
                                ></el-button>
                    </template>

                    </el-table-column>
                    </el-table>
                 
            </el-form-item>
              <el-form-item label="开始时间:" :label-width="formLabelWidth">
                   <el-date-picker
                        v-model="AddQuesNaireForm.startTime"
                        value-format="yyyy-MM-dd HH-mm-ss"
                        type="datetime"
                        placeholder="选择开始时间">
                   </el-date-picker>
            </el-form-item>
              <el-form-item label="结束时间:" :label-width="formLabelWidth">
                   <el-date-picker
                        v-model="AddQuesNaireForm.overTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH-mm-ss"
                        placeholder="选择结束时间">
                   </el-date-picker>
            </el-form-item><el-button type="success" 
                                      :style="{marginLeft:'15px'}"
                                      @click="handleEditDiscuss()" 
                                      plain>提交</el-button>
          </el-form>
          <!--  添加问题 -->
            <el-dialog
                        width="40%"
                        :close-on-click-moda="true"
                        @close="addcloseCB()"
                        title="添加问题"
                        :visible="innerVisible">
                            <el-form :model="addquestionForm">
                                <el-form-item label="题目:" :label-width="formLabelWidth">
                                    <el-input v-model="addquestionForm.questionTitle" autocomplete="off"></el-input>
                                </el-form-item>
                                 <el-form-item label="类型:" :label-width="formLabelWidth">
                                    <el-select v-model="addquestionForm.questionKind" placeholder="判断/单选/.." :clearable="true">
                                        <el-option label="判断" :value="1"></el-option>
                                        <el-option label="单选" :value="2"></el-option>
                                        <el-option label="多选" :value="3"></el-option>
                                        <el-option label="文本" :value="4"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    :label-width="formLabelWidth"
                                    v-for="(item, index) in optionsList.options"
                                    :label="'选项' + ++index + ':'"
                                    :key="index">
                                    <el-row>
                                        <el-col>
                                    <el-input v-model="item.value" placeholder="选项:内容" style="width:87%"></el-input>
                                    <el-button @click.prevent="removeDomain(item)" class="el-icon-close" style="color:red;"></el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-button @click="addDomain" class="el-icon-plus questionAddBtn" style="margin-left:80px;">选项</el-button>
                                <el-form-item label="排序:" :label-width="formLabelWidth">
                                    <el-input v-model="addquestionForm.questionOrders" autocomplete="off" placeholder="1"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="innerVisible = false">取 消</el-button>
                                <el-button 
                                     @click="addQuestion()"
                                     type="primary">添加</el-button>
                            </div>
                   </el-dialog>
          <!-- 修改问题 -->
            <!-- <el-dialog
                        width="40%"
                        :close-on-click-moda="true"
                        @close="addcloseCB()"
                        title="修改问题"
                        :visible="editcc">
                            <el-form :model="questionList">
                                <el-form-item label="题目:" :label-width="formLabelWidth">
                                    <el-input v-model="questionList.questionTitle" autocomplete="off"></el-input>
                                </el-form-item>
                                 <el-form-item label="类型:" :label-width="formLabelWidth">
                                    <el-select v-model="questionList.questionKind" placeholder="判断/单选/.." :clearable="true">
                                        <el-option label="判断" :value="1"></el-option>
                                        <el-option label="单选" :value="2"></el-option>
                                        <el-option label="多选" :value="3"></el-option>
                                        <el-option label="文本" :value="4"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    :label-width="formLabelWidth"
                                    v-for="(item, index) in optionsList.options"
                                    :label="'选项' + ++index + ':'"
                                    :key="index">
                                    <el-row>
                                        <el-col>
                                    <el-input v-model="item.value" placeholder="选项:内容" style="width:87%"></el-input>
                                    <el-button @click.prevent="removeDomain(item)" class="el-icon-close" style="color:red;"></el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>

                                <el-button @click="addDomain" class="el-icon-plus questionAddBtn" style="margin-left:80px;">选项</el-button>
                                <el-form-item label="排序:" :label-width="formLabelWidth">
                                    <el-input v-model="questionnaireQuestionAddFormList.orders" autocomplete="off" placeholder="1"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="editcc = false">取 消</el-button>
                                <el-button 
                                     @click="saveQuestion()"
                                     type="primary">保存</el-button>
                            </div>
                   </el-dialog> -->
    </el-card>
</template>

<script>

export default {
    data(){
        return{
            // 判断类型的
            typeFlag:'',
            innerVisible:false,
            editcc:false,
            formLabelWidth:'80px',
            AddQuesNaireForm:{}, 
            questionnaireQuestionAddFormList:{},
            // 选项数据
            optionsList:{options:[{value:''}]},
            // 回显问题列表
            // backShowlist:[],
             // 选中部门的数据
            checkedIds:[],
            // 所有部门
            departmentList:[],
            // 问题table回显数据
            questionTableList:[],
            //添加一个问题数据
            addquestionForm:{}
        }
    },
    created(){
        this.getMsgById()
    },
    mounted(){
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
        // 根据id获取数据 --页面回显
       async getMsgById(){
           var id = this.$store.state.discussId
           if(!id){
               this.$message.warning('加载失败')
               setTimeout(()=>{
                   this.$router.push('/')
                   return
               },500)
           }
           const res = await this.$http.post(`/web/v1/webQuestionnaire/get/questionnaireById?id=${id}`)
           const { data:{code,result}} = res
           console.log(res)
           if(code === 200){
               // 信息显示
               this.AddQuesNaireForm = result
               // 保存类型
               this.typeFlag = result.sort || ''
               // 选中部门显示
               this.checkedIds = JSON.parse(result.departmentList)
               // 问题table回显 webQuestionnaireQuestionBoList
               this.questionTableList = result.webQuestionnaireQuestionBoList
              
           }

           
        },
       // 提交修改请求
        async handleEditDiscuss(){
           // 处理部门参数
           // 部门
           this.AddQuesNaireForm.departmentList = this.checkedIds || []
           // 用户id
           this.AddQuesNaireForm.admnId = sessionStorage.getItem('createId')
           // 问题对象数组
            this.AddQuesNaireForm.questionnaireQuestionAddFormList = []
        
        for(var i = 0; i < this.questionTableList.length; i++){
            // var options = this.questionTableList[i].questionOptions.slice(1,-1).split(',')
             var options = this.questionTableList[i].questionOptions
            
            if(typeof options =='string'){
                options = this.questionTableList[i].questionOptions.slice(1,-1).split(',')
            }
            this.AddQuesNaireForm.questionnaireQuestionAddFormList.push({
                title: this.questionTableList[i].questionTitle,
                options: options,
                questionKind: this.questionTableList[i].questionKind,
                orders:0

            })
        }
           delete this.AddQuesNaireForm.webQuestionnaireQuestionBoList
           console.log(this.AddQuesNaireForm)
           

           const res = await this.$http.put(`/web/v1/webQuestionnaire/upd/questionnaireMessage`,this.AddQuesNaireForm)
           const { data: { code, result } } = res
           
           if(code === 200){
               this.$message.success(result)
            //    this.loadCollectionList()
               this.editCollectionShowDia = false
               // 成功以后跳转
               if(this.typeFlag == 1){
                   this.$router.push('/questionnaire')
               }else if(this.typeFlag == 2){
                   this.$router.push('/voting')

               }else if(this.typeFlag == 3){
                   this.$router.push('/activitys')
                
               }
               // 处理表单
                // this.AddCollectionForm = {}
                this.checkedIds.length = 0
                return
           }
            this.$message.success(msg)
             // 处理表单
            this.AddCollectionForm = {}
            this.checkedIds.length = 0

        },
        //添加问题 显示弹出框
        showAddquestionDia(){
            this.innerVisible = true
            // 清空表单
            this.addquestionForm = {}
        },
        //添加问题 处理问题选项options 
        addQuestion(){
            
            this.innerVisible = false
            this.addquestionForm.questionOptions = []
            // 处理options选项
            this.optionsList.options.forEach((v,i)=>{
                this.addquestionForm.questionOptions.push(v.value.trim())
            })
            // 关闭的时候回显问题 this.questionnaireQuestionAddFormList questionKind
            // const msg = {
            //                 questionTitle:this.questionnaireQuestionAddFormList.title,
            //                 questionOptions:this.questionnaireQuestionAddFormList.options,
            //                 questionKind:this.questionnaireQuestionAddFormList.questionKind,
            //             }
            // 加问题
            this.questionTableList.push(this.addquestionForm)
            console.log(this.addquestionForm)
            // 处理表单数据
            // this.AddQuesNaireForm.questionnaireQuestionAddFormList.push(this.questionnaireQuestionAddFormList)
           
        },
        //删除单个问题
        deletequestionsigle(index,rows){
            // 删问题
             this.questionTableList.splice(index, 1)
        },
         // 新增选项方法
         removeDomain(item){
              var index = this.optionsList.options.indexOf(item)
              if(index == 0) return
              if (index !== -1) {
              this.optionsList.options.splice(index, 1)
              }
         },
         addDomain(){
             this.optionsList.options.push({value: ''})
         },
         //弹框关闭
         addcloseCB(){
             this.questionnaireQuestionAddFormList = {}
         }
    }
}
</script>

<style>

</style>
