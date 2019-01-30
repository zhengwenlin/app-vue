<template>
    <el-card>
          <span :style="{'text-align':'center',fontStyle:'nomal'}">添加活动</span>
          <el-form :model="AddQuesNaireForm">
               <el-form-item label="类别:" :label-width="formLabelWidth">
                <el-select v-model="AddQuesNaireForm.sort" placeholder="问卷/投票/活动/采集" :clearable="true">
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
             <el-form-item label="添加问题:" :label-width="formLabelWidth">
                 <el-badge  class="item">
                    <el-button size="small" @click="innerVisible=true">+</el-button>
                 </el-badge>
                 <!-- 回显列表 -->
                 <el-card v-if="backShowlist.length !== 0">
                     <div v-for="(v,index) in backShowlist" :key="index" style="border-bottom:1px dashed #ccc; padding:10px 0">
                        题目{{index + 1}}: {{ v.title }} <br>
                        选项: <el-checkbox v-for=" (item, i) in v.options"  :key="i">{{item}}</el-checkbox>
                     </div>
                 </el-card>
                   <el-dialog
                        width="40%"
                        :close-on-click-moda="true"
                        @close="addcloseCB()"
                        title="添加问题"
                        :visible="innerVisible">
                            <el-form :model="questionnaireQuestionAddFormList">
                                <el-form-item label="题目:" :label-width="formLabelWidth">
                                    <el-input v-model="questionnaireQuestionAddFormList.title" autocomplete="off"></el-input>
                                </el-form-item>
                                 <el-form-item label="类型:" :label-width="formLabelWidth">
                                    <el-select v-model="questionnaireQuestionAddFormList.questionKind" placeholder="判断/单选/.." :clearable="true">
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
                                <el-button @click="innerVisible = false">取 消</el-button>
                                <el-button 
                                     @click="addQuestion()"
                                     type="primary">添加</el-button>
                            </div>
                   </el-dialog>
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
                                      @click="handleAddQuesnaire()" 
                                      plain>提交</el-button>
          </el-form>
          
    </el-card>
</template>

<script>

export default {
    data(){
        return{
            innerVisible:false,
            formLabelWidth:'80px',
            AddQuesNaireForm:{
                questionnaireQuestionAddFormList:[],
                
            }, 
            questionnaireQuestionAddFormList:{},
            // 选项数据
            optionsList:{options:[{value:''}]},
            // 回显问题列表
            backShowlist:[],
             // 选中部门的数据
            checkedIds:[],
            //所有部门列表
            departmentList:[]
        }
    },
    created(){
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
       async handleAddQuesnaire(){
            //收集数据
             this.AddQuesNaireForm.admnId = sessionStorage.getItem('createId')
             this.AddQuesNaireForm.departmentList = this.checkedIds

             const res = await this.$http.post(`/web/v1/webQuestionnaire/add/questionnaire`, this.AddQuesNaireForm)
             const { data: { code, msg, result } } = res
             if(code == 200){
                 this.$message.success(msg)
                 this.$router.push('/activitys')
                 // 成功后初始化表单
                 this.optionsList = {options:[{value:''}]}
                 this.backShowlist = []
             }
         },
           
        
        addQuestion(){
            
            this.innerVisible = false
            this.questionnaireQuestionAddFormList.options = []
            // 处理options选项
            this.optionsList.options.forEach((v,i)=>{
                this.questionnaireQuestionAddFormList.options.push(v.value.trim())
            })
            // 关闭的时候回显问题 this.questionnaireQuestionAddFormList
            this.backShowlist.push(this.questionnaireQuestionAddFormList)
            // 处理表单数据
            this.AddQuesNaireForm.questionnaireQuestionAddFormList.push(this.questionnaireQuestionAddFormList)
           
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
