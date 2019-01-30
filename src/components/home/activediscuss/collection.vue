<template>
    <el-card>
         <el-row>
            <el-col :span="8">
               
            </el-col>
            <el-col :span="16">
               
                 <el-button 
                 @click="showAddCollection()"
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
                    <el-tag v-else-if="scope.row.sort == 3" type="success" size="mini">活动</el-tag>
                    <el-tag v-else-if="scope.row.sort == 4" type="" size="mini">采集</el-tag>
                </template>
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
            prop="overTime"
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
                          @click="showEditCollectionDia(scope.row)"
                         >编辑</el-button>
              <el-button  plain 
                          size="mini" 
                          type="text" 
                          @click="hanleDeleVoting(scope.row)"
                          >删除</el-button>
            <el-button  plain 
                        size="mini" 
                        type="text" 
                        @click="hanlePreviewCollec(scope.row)"
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
          <!-- 新增的弹出框 -->
        <el-dialog title="新增采集" 
                   @closed="closeAddCB()"
                   :visible="addCollectionShowDia" 
                   width="50%"
                   :fullscreen="false">
          <el-form :model="AddCollectionForm" ref="addFormCollection">
               <el-form-item label="类别:" :label-width="formLabelWidth">
                <el-select v-model="AddCollectionForm.sort" placeholder="问卷/投票/活动/采集" :clearable="true">
                    <el-option label="问卷" :value="1"></el-option>
                    <el-option label="投票" :value="2"></el-option>
                    <el-option label="活动" :value="3"></el-option>
                    <el-option label="采集" :value="4"></el-option>
             </el-select>
            </el-form-item>
             <el-form-item label="题目:" :label-width="formLabelWidth">
              <el-input v-model="AddCollectionForm.title" autocomplete="off"></el-input>
            </el-form-item>
           <el-form-item label="内容:" :label-width="formLabelWidth">
              <el-input v-model="AddCollectionForm.content" 
                        type="textarea"
                        :rows="2"
                        placeholder="请输入问卷内容"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="部门:" :label-width="formLabelWidth">
                <el-checkbox-group v-model="checkedIds" @change="handleCheckedCitiesChange">
                    <el-checkbox
                         style="margin: 0 10px;"
                         v-for="(item,index) in departmentList" :label="item.id" :key="index"  >{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="是否公开:" :label-width="formLabelWidth">
                <el-select v-model="AddCollectionForm.isLook" placeholder="公开/隐藏" :clearable="true">
                    <el-option label="公开" :value="1"></el-option>
                    <el-option label="匿名" :value="2"></el-option>
             </el-select>
            </el-form-item>
              <el-form-item label="开始时间:" :label-width="formLabelWidth">
                   <el-date-picker
                        value-format="yyyy-MM-dd HH-mm-ss"
                        v-model="AddCollectionForm.startTime"
                        type="datetime"
                        placeholder="选择开始时间">
                   </el-date-picker>
            </el-form-item>
              <el-form-item label="结束时间:" :label-width="formLabelWidth">
                   <el-date-picker
                        value-format="yyyy-MM-dd HH-mm-ss"
                        v-model="AddCollectionForm.overTime"
                        type="datetime"
                        placeholder="选择结束时间">
                   </el-date-picker>
            </el-form-item> 
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addCollectionShowDia = false">取 消</el-button>
            <el-button type="primary" @click="handleAddCollection()">确 定</el-button>
          </div>
        </el-dialog>
          <!-- 修改的弹出框 -->
        <el-dialog title="修改采集" 
                   @closed="closeEditCB()"
                   :visible.sync="editCollectionShowDia" 
                   width="50%"
                   :fullscreen="false">
          <el-form :model="AddCollectionForm" ref="addFormCollection">
               <el-form-item label="类别:" :label-width="formLabelWidth">
                <el-select v-model="AddCollectionForm.sort" placeholder="问卷/投票/活动/采集" :clearable="true" :disabled="true">
                    <el-option label="问卷" :value="1"></el-option>
                    <el-option label="投票" :value="2"></el-option>
                    <el-option label="活动" :value="3"></el-option>
                    <el-option label="采集" :value="4"></el-option>
             </el-select>
            </el-form-item>
             <el-form-item label="题目:" :label-width="formLabelWidth">
              <el-input v-model="AddCollectionForm.title" autocomplete="off"></el-input>
            </el-form-item>
           <el-form-item label="内容:" :label-width="formLabelWidth">
              <el-input v-model="AddCollectionForm.content" 
                        type="textarea"
                        :rows="2"
                        placeholder="请输入问卷内容"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="部门:" :label-width="formLabelWidth">
                <el-checkbox-group v-model="checkedIds" @change="handleCheckedCitiesChange">
                    <el-checkbox
                         style="margin: 0 10px;"
                         v-for="(item,index) in departmentList" :label="item.id" :key="index"  >{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="是否公开:" :label-width="formLabelWidth">
                <el-select v-model="AddCollectionForm.isLook" placeholder="公开/隐藏" :clearable="true">
                    <el-option label="公开" :value="1"></el-option>
                    <el-option label="匿名" :value="2"></el-option>
             </el-select>
            </el-form-item>
              <el-form-item label="开始时间:" :label-width="formLabelWidth">
                   <el-date-picker
                        value-format="yyyy-MM-dd HH-mm-ss"
                        v-model="AddCollectionForm.startTime"
                        type="datetime"
                        placeholder="选择开始时间">
                   </el-date-picker>
            </el-form-item>
              <el-form-item label="结束时间:" :label-width="formLabelWidth">
                   <el-date-picker
                        value-format="yyyy-MM-dd HH-mm-ss"
                        v-model="AddCollectionForm.overTime"
                        type="datetime"
                        placeholder="选择结束时间">
                   </el-date-picker>
            </el-form-item> 
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editCollectionShowDia = false">取 消</el-button>
            <el-button type="primary" @click="handleEditCollection()">确 定</el-button>
          </div>
        </el-dialog>

           <!-- 查看的弹出框 -->
        <el-dialog title="修改采集" 
                   @closed="closePreviewCB()"
                   :visible.sync="previewCollectionShowDia" 
                   width="55%"
                   :fullscreen="false">
          <el-form :model="AddCollectionForm" ref="addFormCollection" :disabled="true">
               <el-form-item label="类别:" :label-width="formLabelWidth" >
                <el-select v-model="AddCollectionForm.sort" placeholder="问卷/投票/活动/采集" :clearable="true" :disabled="true">
                    <el-option label="问卷" :value="1"></el-option>
                    <el-option label="投票" :value="2"></el-option>
                    <el-option label="活动" :value="3"></el-option>
                    <el-option label="采集" :value="4"></el-option>
             </el-select>
            </el-form-item>
             <el-form-item label="题目:" :label-width="formLabelWidth">
              <el-input v-model="AddCollectionForm.title" autocomplete="off"></el-input>
            </el-form-item>
           <el-form-item label="内容:" :label-width="formLabelWidth">
              <el-input v-model="AddCollectionForm.content" 
                        type="textarea"
                        :rows="2"
                        placeholder="请输入问卷内容"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="部门:" :label-width="formLabelWidth">
                <el-checkbox-group v-model="checkedIds" @change="handleCheckedCitiesChange">
                    <el-checkbox
                         style="margin: 0 10px;"
                         v-for="(item,index) in departmentList" :label="item.id" :key="index"  >{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="是否公开:" :label-width="formLabelWidth">
                <el-select v-model="AddCollectionForm.isLook" placeholder="公开/隐藏" :clearable="true">
                    <el-option label="公开" :value="1"></el-option>
                    <el-option label="匿名" :value="2"></el-option>
             </el-select>
            </el-form-item>
              <el-form-item label="开始时间:" :label-width="formLabelWidth">
                   <el-date-picker
                        value-format="yyyy-MM-dd HH-mm-ss"
                        v-model="AddCollectionForm.startTime"
                        type="datetime"
                        placeholder="选择开始时间">
                   </el-date-picker>
            </el-form-item>
              <el-form-item label="结束时间:" :label-width="formLabelWidth">
                   <el-date-picker
                        value-format="yyyy-MM-dd HH-mm-ss"
                        v-model="AddCollectionForm.overTime"
                        type="datetime"
                        placeholder="选择结束时间">
                   </el-date-picker>
            </el-form-item> 
          </el-form>
           <el-button 
              @click="handledownloadAll()"
              type="success">批量下载</el-button>
          <!-- 采集表格 -->
          <el-table
            height="300"
            v-loading="isLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            ref="multipleTable"
            :data="collectiondownloadList"
            tooltip-effect="dark"
            style="width: 100%; margin-top:25px; "
            border
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="50">
            </el-table-column>

             <el-table-column
            prop="questionnaireUserOptionUserName"
            label="用户名"
            width="100">
            </el-table-column>
             <el-table-column
            prop="quoCollectUrl"
            label="采集文件url"
            width="">
                <template slot-scope='scope'>
                    <a :href="scope.row.quoCollectUrl" download>
                        <img :src='scope.row.quoCollectUrl' width="80px" style="" />
                    </a>
                </template>
            </el-table-column>
             <el-table-column
            prop="quoPictureJson"
            label="采集文件名称"
            width="100">
            </el-table-column>
             <el-table-column
            label="类别"
            align="center"
            width="100">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.quoType == 1" type="warning" size="mini">问卷</el-tag>
                    <el-tag v-else-if="scope.row.quoType == 2" type="danger" size="mini">投票</el-tag>
                    <el-tag v-else-if="scope.row.quoType == 3" type="success" size="mini">活动</el-tag>
                    <el-tag v-else-if="scope.row.quoType == 4" type="" size="mini">采集</el-tag>
                </template>
            </el-table-column>

            <el-table-column
              label="操作"
              fixed="right"
              width="80">
            <template slot-scope="scope">
              <el-button  plain 
                          size="small" 
                          type="text" 
                          @click="handleDownloadone(scope.row)"
                         >下载</el-button>
            </template>

            </el-table-column>
           
        </el-table>
        
          <div slot="footer" class="dialog-footer">
            <el-button @click="previewCollectionShowDia = false" type="primary">关闭</el-button>
          </div>
        </el-dialog>
       
       
    </el-card>
</template>

<script>
// import download from 'download.js'
export default {

    data(){
        return{
             // commmon配置参数
            // 新增采集弹窗口显示
            addCollectionShowDia:false,
            editCollectionShowDia:false,
            previewCollectionShowDia:false,
            innerVisible:false,
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
            // 新增采集数据
            AddCollectionForm:{},
            // 全部部门列表
            departmentList:[],
            // 选中部门的数据
            checkedIds:[],
            // 采集下载情况表格
            collectiondownloadList:[],
            //批量下载id
            downloadAddId:''
        }
    },
    created(){
        this.loadCollectionList()
        //获取部门列表
        this.getDepartmentList()
    },
    methods:{
        async loadCollectionList(){
           const res = await this.$http.post(`/web/v1/webQuestionnaire/get/allQuestionnaire`,{
               "pageNum":this.pagenum,
               "pageSize":this.pagesize,
               "sort":4,
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
        // 渲染部门列表
        // /web/v1/webQuestionnaire/get/department
        async getDepartmentList(){
            const res = await this.$http.post(`/web/v1/webQuestionnaire/get/department`)
            const { data:{ code, result } } = res
            if(code === 200) {
                this.departmentList = result
            }
            
        },
        handleCheckedCitiesChange(val){
            
            console.log(this.checkedIds)
        },
        // 新增采集
        showAddCollection(){
            // 显示对话框
            this.addCollectionShowDia = true
            
        },
        // 清空表单
        // 新增发送请求
       async handleAddCollection(){
           // 处理部门参数
           this.AddCollectionForm.departmentList = this.checkedIds
           this.AddCollectionForm.admnId = sessionStorage.getItem('createId')
          
         const res = await this.$http.post(`/web/v1/webQuestionnaire/add/questionnaireCollect`,this.AddCollectionForm) 
       
         const { data: { code,result} } = res
         if(code === 200){
             this.$message.success(result)
             this.addCollectionShowDia = false
             this.loadCollectionList()
             // 清空表单
             this.AddCollectionForm = {}
             // 清空复选
             this.checkedIds = []         }
        },
        // 修改采集
        showEditCollectionDia(rows){
            // 显示对话框
            this.editCollectionShowDia = true
            // 显示信息
            this.AddCollectionForm = rows
            console.log(rows)
            
            // this.checkedIds =JSON.parse(rows.departmentList)
            this.$http.post(`/web/v1/webQuestionnaire/get/questionnaireById?id=${rows.id}`)
            .then((res)=>{
                console.log('------------------------------')
                console.log(res)
                const { data:{ code,result } } = res
                if(code === 200){
                 // 显示部门选中情况
                   this.checkedIds =JSON.parse(result.departmentList) 
                }
            })

          
            
        },
        // 发送修改请求
       async handleEditCollection(){
           // 处理部门参数
           this.AddCollectionForm.departmentList = this.checkedIds
           this.AddCollectionForm.admnId = sessionStorage.getItem('createId')
           // 删除问题列表 属性
           delete this.AddCollectionForm.webQuestionnaireQuestionBoList
           const res = await this.$http.put(`/web/v1/webQuestionnaire/upd/questionnaireMessage`,this.AddCollectionForm)
           console.log('msg-------------')
           console.log(res)
           const { data: { code, result } } = res
           if(code === 200){
               this.$message.success(result)
               this.loadCollectionList()
               this.editCollectionShowDia = false
               // 处理表单
                this.AddCollectionForm = {}
                this.checkedIds.length = 0
                return
           }
            this.$message.success(msg)
             // 处理表单
            this.AddCollectionForm = {}
            this.checkedIds = []

        },
        // 查看功能，采集下载
        hanlePreviewCollec(rows){
            // 保存批量下载id
            this.downloadAddId = rows.id
            this.previewCollectionShowDia = true
            // 显示信息
            this.AddCollectionForm = rows
            this.$http.post(`/web/v1/webQuestionnaire/get/questionnaireById?id=${rows.id}`)
            .then((res)=>{
               
                const { data:{ code,result } } = res
                if(code === 200){
                    console.log(result)
                    console.log('rererre')
                    // 显示部门选中情况
                    this.checkedIds =JSON.parse(result.departmentList) 
                      // 采集情况table数据
                    this.collectiondownloadList = result.webQuestionnaireUserOptionBoList
                }
            })
            
        },
        // 采集单个下载
       async handleDownloadone(rows){
         console.log(rows)
           const res = await this.$http.get(`/web/v1/webQuestionnaire/down/picDown?picName=${rows.quoPictureJson}&url=${rows.quoCollectUrl}`)
           window.open(res)
        
        },
        //批量下载
       async handledownloadAll(){
           
        const res = await this.$http.get(`/web/v1/webQuestionnaire/down/caiJi?id=${this.downloadAddId}`)
        const { data: { code, result } } = res
        if(code === 200){
            //  download(result, 'collec.zip')
        }
        // var url = 'http://192.168.7.183:9091/web/v1/webQuestionnaire/down/caiJi?id='+ this.downloadAddId
        // var xhr = new XMLHttpRequest()
        // xhr.open('get', url, true)
        // xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
        // xhr.responseType = "blob"
        // xhr.onload = function () {   
           
        //     // if (this.status === 200) {
        //     //     var blob = this.response
        //     //     var reader = new FileReader()
        //     //     reader.readAsDataURL(blob);   
        //     //     reader.onload = function (e) {
        //     //         var a = document.createElement('a')  
        //     //         a.download = 'collec.zip';
        //     //         a.href = e.target.result;
        //     //         $("body").append(a)    
        //     //         a.click();
        //     //         $(a).remove();
        //     //     }


        //         const link = document.createElement('a');
        //         const blob = new Blob([this.response], {type: 'application/zip'});
        //         link.setAttribute('href', window.URL.createObjectURL(blob));
        //         link.setAttribute('download', 'collec.zip');
        //         link.style.visibility = 'hidden';
        //         document.body.appendChild(link);
        //         link.click();
        //         document.body.removeChild(link);

            

       

        
        // }
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
                this.loadCollectionList()
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
            this.ids = []
            rows.forEach(element =>{
            this.ids.push(element.id)
            })
            // 批量删除逻辑
            const res = await this.$http.post(`/web/v1/webQuestionnaire/hide/questionnaireById`,this.ids)
           
            const { data: { code, msg } } = res
            if(code == 200){
                this.$message.success(msg)
                this.loadCollectionList()
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
             
            this.tableChecked = val
            
        },
        // 分页
        handleSizeChange (val) {
          this.pagesize = val
          this.loadCollectionList()
        },
        handleCurrentChange (val) {
          this.pagenum = val
          this.loadCollectionList()
        },
        // 新增弹出框关闭
        closeAddCB(){
          this.AddCollectionForm = {}
          this.checkedIds.length = 0

        },
        closeEditCB(){
           this.AddCollectionForm = {}
           this.checkedIds.length = 0
        },
        closePreviewCB(){
            this.AddCollectionForm = {}
           this.checkedIds.length = 0
        }
    }
}
</script>

<style>

</style>
