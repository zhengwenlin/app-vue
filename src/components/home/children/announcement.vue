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
                 @click="showAddAnnounce()"
                 type="primary">新增</el-button>
                 <el-button type="danger" :disabled="true">批量删除</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
          <el-table
             v-loading="isLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            ref="multipleTable"
            id="contentTable"
            :data="announceList"
            tooltip-effect="dark"
             style="width: 100%; margin-top:30px;"
            border
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="40">
            </el-table-column>
             <el-table-column
            prop="title"
            label="题目"
            width="350">
            </el-table-column>
             <el-table-column
            prop="bannerUrl"
            label="头图"
            width="120">
            <template slot-scope="scope"><img v-bind:src=scope.row.bannerUrl style="display:block; width:100px;height:60px" alt="暂无"></template>
            </el-table-column>
             <el-table-column
            prop="type"
            label="首页轮播"
            width="">
            <template slot-scope="scope">{{ scope.row.type == 0 ? '否':'是' }}</template>
            </el-table-column>
             <el-table-column
            prop="commentCount"
            label="评论数"
            width="">
            </el-table-column> <el-table-column
            prop="readCount"
            label="阅读数"
            width="">
            </el-table-column> <el-table-column
            prop="transpondCount"
            label="转发数"
            width="">
            </el-table-column> <el-table-column
            prop="unreadCount"
            label="未读数"
            width="">
            </el-table-column>
            <el-table-column
              label="操作" width="180" >
            <template slot-scope="scope">
              <el-button  plain 
                          size="small" 
                          type="text" 
                          @click="showEditAnnounce(scope.row,scope.row.announcementAttachmentList)"
                          >修改</el-button>
              <el-button  plain 
                          size="small" 
                          type="text" 
                          @click="hanleDeleteAnnounce(scope.row)"
                          >删除</el-button>
              <el-button  plain 
                          size="small" 
                          @click="hanleLookAnnounce(scope.row)"
                          type="text" 
                          >查看</el-button>
              <el-button  plain 
                          size="small" 
                          @click="showAnnounceRights(scope.row,scope.row.userIdList)"
                          type="text" 
                          style="color:#67C23A"
                          >权限</el-button>
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
        <!-- 新增的弹出框 -->
        <el-dialog title="新增公告" 
                   @open="addOpenDia()"
                   @close="closeAddCB()"
                   :visible.sync="addAnnounceShow" 
                   width="50%"
                   :fullscreen="false">
          <el-form :model="AddAnnounceForm">
            <el-form-item label="题目:" :label-width="formLabelWidth">
              <el-input v-model="AddAnnounceForm.title" autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item label="内容:" :label-width="formLabelWidth">
                <quillEditor 
                        class="editor" 
                        v-model="AddAnnounceForm.content"
                        ref="addQuillEditor"
                        :options="editorOption"
                       >
                </quillEditor>
            </el-form-item>
             <el-form-item label="类型:" :label-width="formLabelWidth">
                <el-select v-model="AddAnnounceForm.sort" placeholder="请选择类型" :clearable="true">
                    <el-option label="公告" :value="1"></el-option>
             </el-select>
            </el-form-item>
            <el-form-item label="头图:" :label-width="formLabelWidth">
              <el-upload
                class="upload-bannerURL"
                :on-remove="handleRemove"
                :limit="1"
                action=""
                :http-request="uploadSectionFile"
                ref="addUpload"
                :file-list="fileListURL"
                list-type="picture">
                <el-button size="small" type="primary" plain>点击上传</el-button>
              </el-upload>
            </el-form-item>
              <el-form-item label="首页轮播:" :label-width="formLabelWidth">
              <!-- <el-input v-model="AddAnnounceForm.type" autocomplete="off"></el-input> -->
                <el-select v-model="AddAnnounceForm.type" placeholder="首页轮播">
                      <el-option label="否" :value="0"></el-option>
                      <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="添加附件:" :label-width="formLabelWidth">
              <el-upload
                :on-remove="handleRemove"
                :limit="10"
                action=""
                accept="*/*"
                :http-request="uploadEnclosureFile"
                ref="addUpload"
                :file-list="EnclosureFileList"
                list-type="picture">
                <el-button size="small" type="primary" plain class="el-icon-plus"></el-button>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addAnnounceShow = false">取 消</el-button>
            <el-button type="primary" @click="handleAddAnnounce()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 修改弹出框 -->
        <el-dialog title="修改公告"
                   @close="closeEditCB()"
                   :visible.sync="editAnnounceShow">
          <el-form :model="AddAnnounceForm">
             <el-form-item label="题目:" :label-width="formLabelWidth">
              <el-input v-model="AddAnnounceForm.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="内容:" :label-width="formLabelWidth">
                
                <quillEditor class="editor" v-model="AddAnnounceForm.content"></quillEditor>
            </el-form-item>
            <el-form-item label="类型:" :label-width="formLabelWidth">
                <el-select v-model="AddAnnounceForm.sort" placeholder="请选择类型" :clearable="true">
                    <el-option label="公告" :value="1"></el-option>
             </el-select>
            </el-form-item>
            <el-form-item label="头图:" :label-width="formLabelWidth">
               <el-upload
                class="upload-bannerURL"
                 action=""
                :http-request="uploadSectionFile"
                :file-list="editFileListURL"
                list-type="picture">
                <el-button size="small" type="primary" plain>点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
              <!-- 图片预览 -->
            </el-form-item>
            <el-form-item label="首页轮播:" :label-width="formLabelWidth">
                <el-select v-model="AddAnnounceForm.type" placeholder="首页轮播">
                      <el-option label="否" :value="0"></el-option>
                      <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
               <el-form-item label="附件:" :label-width="formLabelWidth">
              <el-upload
                :on-remove="handleEnclosureFileRemove"
                :limit="10"
                action=""
                :http-request="uploadEnclosureFile"
                ref="addUpload"
                :file-list="EnclosureFileList"
                list-type="picture">
                <el-button size="small" type="primary" plain class="el-icon-plus"></el-button>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editAnnounceShow = false">取 消</el-button>
            <el-button type="primary" @click="handleEditAnnounce()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 查看功能弹出框 -->
        <el-dialog title="查看公告"
                   @open="handleOpen()"
                   @close="closeLookCB()"
                   :visible.sync="lookAnnounceShow">
          <el-form :model="AddAnnounceForm" :disabled="true">
             <el-form-item label="题目:" :label-width="formLabelWidth">
              <el-input v-model="AddAnnounceForm.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="内容:" :label-width="formLabelWidth">
                
                <quillEditor class="editor" v-model="AddAnnounceForm.content" :disabled="true"></quillEditor>
            </el-form-item>
            <el-form-item label="类型:" :label-width="formLabelWidth">
                <el-select v-model="AddAnnounceForm.sort" placeholder="请选择类型" :clearable="true">
                    <el-option label="公告" :value="1"></el-option>
             </el-select>
            </el-form-item>
            <el-form-item label="头图:" :label-width="formLabelWidth" >
              <!-- 图片预览 -->
               <img src="" alt="" ref="previewBanner" style="width:140px; height:80px;">
            </el-form-item>
             <el-form-item label="首页轮播:" :label-width="formLabelWidth">
                <el-select v-model="AddAnnounceForm.type" placeholder="首页轮播">
                      <el-option label="否" :value="0"></el-option>
                      <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="附件:" :label-width="formLabelWidth" >
              <!-- 附件预览 -->
               <span ref="previewattchFile"></span>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="lookAnnounceShow = false">关闭</el-button>
          </div>
        </el-dialog>
        <!-- 权限tree -->
        <el-dialog title="公告权限" 
                   @close="closeRightsCB()"
                   @opened="treeOpenCB()"
                   :visible.sync="announceRightsShowDia"
                   width="40%"
                   :fullscreen="false">
          <el-tree
            ref="tree"
            :data="departmentUsersList"
            show-checkbox
            default-expand-all
            node-key="id"
            :default-checked-keys="checkedList"
            :props="defaultProps">
          </el-tree>
          <div slot="footer" class="dialog-footer">
            <el-button @click="announceRightsShowDia = false">取 消</el-button>
            <el-button type="primary" @click="handleSetAnnounceRight()">确 定</el-button>
          </div>
        </el-dialog>
    </el-card>
</template>

<script>
// 富文本工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  // ['blockquote', 'code-block'],

  [{'header': 1}, {'header': 2}],               // custom button values
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
  [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
  [{'direction': 'rtl'}],                         // text direction

  [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
  [{'header': [1, 2, 3, 4, 5, 6, false]}],

  [{'color': []}, {'background': []}],          // dropdown with defaults from theme
  [{'font': []}],
  [{'align': []}],
  ['image'],
  ['clean']                                         // remove formatting button
]

import {quillEditor, Quill} from 'vue-quill-editor'
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'

Quill.register('modules/ImageExtend', ImageExtend)

export default {
    components: {quillEditor},
    data(){
        return {
          // 表格加载动画
            isLoading:true,
          // 分页相关的属性
            pagenum: 1,
            pagesize: 4,
            total: 20,
            
            announceList: [],
            searchVal:'',
            //新增显示
            addAnnounceShow:false,
            // 权限
            announceRightsShowDia:false,
            // 弹出框宽度
            formLabelWidth:'100px',
            // 修改公告 显示
            editAnnounceShow:false,
            // 查看弹出框显示
            lookAnnounceShow:false,
            // 修改绑定内容  content
            editAnTextarea:'',
            //重置新增数据原始数据保存
             AddAnnounceFormOld:{
                "announcementAttachmentList":[],
                "bannerUrl":"",
                "content":"",
                "createId":-1,
                "sort":"",
                "title":"",
                "type":""
           },
            // 新增数据
            AddAnnounceForm:{
                "announcementAttachmentList":[],
                "bannerUrl":"",
                "content":"",
                "createId":-1,
                "sort":"",
                "title":"",
                "type":""
           },
           //----富文本配置
          header: {token: ''},  // 有的图片服务器要求请求头需要有token之类的参数，写在这
          editorOption: {
              placeholder: '请输入公告内容',
              theme: 'snow',  // or 'bubble'
              modules: {
                  ImageExtend: {
                    loading: true,
                    name: 'uploadFile',
                    action: 'http://app.dtguai.com/api/v1/background/upload',
                    response: (res) => {
                      console.log(res)
                      return res.result.url
                    },
                    change: (xhr, formData) => {
                      // xhr.setRequestHeader('myHeader','myValue')
                      formData.append('uploadType', 1) // 传参数
                    },
                    error: () => {this.$message.error('图片添加失败')},  // 可选参数 上传失败触发的事件
                    success: () => {this.$message.success('图片添加成功')},  // 可选参数  上传成功触发的事件
                  },
                  toolbar: {
                      container: toolbarOptions,  // 工具栏
                      handlers: {
                        'image': function () {
                          
                          QuillWatch.emit(this.quill.id)
                        }
                      }
                  }
              }
          },// 富文本编辑器配置
          // 新增预览列表
          fileListURL:[],
          // 修改显示的预览列表
          editFileListURL:[],
          // 附件上传预览
          EnclosureFileList:[],
          // 附件信息
          attachMsg:'',
          // 权限部门和人员列表
          departmentUsersList:[],
          defaultProps: {
            children: 'userList',
            label: 'name'
          },
          // 选中
          checkedList:[],
          // 公告id
          announcementId:'',
          // 当前row信息
          currentRow:''
          
        }
        
    },
    mounted(){
      // 加载列表完成
      this.loadAnnounceList()
      // 部门人员列表
      this.getDepartmentUsersListAll()
    },
   
    methods:{
      
      handleSelectionChange(){

      },
      // 页面加载列表
     async loadAnnounceList(){
        const res = await this.$http.post('/api/v1/announcementWeb/getAnnouncementListPage',{
          "pageNum": this.pagenum,
          "pageSize": this.pagesize
        })
        
        const { data:{ code,result:{announcementList,total} } } = res
        if(code == 200){
          // 加载动画消失
          this.isLoading = false
          this.announceList = announcementList
          // 一共多少条
          this.total = total
        }
      },
      //搜索功能
     async handleSearch(){
       
       if(this.searchVal.trim() == ''){
         this.loadAnnounceList()
         return
       }
      
      const res = await this.$http.post('/api/v1/announcementWeb/getAnnouncementListPage',{
          "pageNum": this.pagenum,
          "pageSize": this.pagesize,
          "title":this.searchVal
        })
        
        const { status, data } = res;
        if(status == 200){
          this.announceList = data.result.announcementList
          this.total = data.result.total
        }
      },
      // 新增公告
      // 0. 打开对话框时初始化
      addOpenDia(){
        this.EnclosureFileList = []
        this.fileListURL = []
        this.AddAnnounceForm.announcementAttachmentList = []
      },
      // 1. 显示新增公告对话框
      showAddAnnounce(){
        this.addAnnounceShow = true
        
      },
      // 2. 处理新增请求
     async handleAddAnnounce(){
        // 关闭对话框
        this.addAnnounceShow = false
        // 获取用户id
        const createId = sessionStorage.getItem('createId')
        this.AddAnnounceForm.createId = createId
        // 发送请求
        //处理参数。内容
        const res = await this.$http.post('/api/v1/announcementWeb/post/save',this.AddAnnounceForm)
        console.log(res)
        const { data } = res;
        if(data.code == 200){
          this.$message.success(data.msg)
          this.pagenum = 1
          this.loadAnnounceList()
          // 清空表单
          this.AddAnnounceForm = this.AddAnnounceFormOld
          // 清空上传图片的列表
          this.$refs.addUpload.clearFiles()
          // 附件预览清空
          this.EnclosureFileList = []
          this.fileListURL = []
          this.AddAnnounceForm.announcementAttachmentList = []
          
        }

      },
      // 新增上传图片删除
      handleRemove(){
      },
      // 单删除
       hanleDeleteAnnounce(row){
        console.log(row.id)
        const id = row.id
        this.$confirm('删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 删除逻辑
           const res = await this.$http.delete('/api/v1/announcementWeb/delete/byId?id=' + id)
            console.log(res)
            const { data } = res
            if(data.code == 200){
              this.$message.success(data.msg)
              this.loadAnnounceList()
            }
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
       
      },
      // 修改公告
      showEditAnnounce(row,msg){
        console.log(msg)
        console.log('cccccccccccccccccccccccccccccccccccccc')
        // 显示弹出框
        this.editAnnounceShow = true
        // 显示公告信息
        this.AddAnnounceForm = row
        // 显示上传的预览图
        this.editFileListURL = [{url:row.bannerUrl}]
        // 附件预览 -- 最终要上传的附件list
        this.EnclosureFileList = [] //预览
        this.AddAnnounceForm.announcementAttachmentList = [] //上传
        const c = msg
        for(var i = 0; i < c.length; i++){
           this.EnclosureFileList.push({url:c[i].url,name:c[i].name})
           // 要是没有修改附件的话，这个就是要提交的数据
           this.AddAnnounceForm.announcementAttachmentList.push({url:c[i].url,name:c[i].name})
        }
        //
        console.log('-----')
        console.log(this.EnclosureFileList)
      },
      //提交修改公告，发送请求
      async handleEditAnnounce(){
        this.editAnnounceShow = false
        // 2 处理信息
        // this.AddAnnounceForm.announcementAttachmentList
        this.AddAnnounceForm.announcementAttachmentList = []
        // 要是修改的话，这个是要提交的数据 this.EnclosureFileList --在钩子中修改
        for(var i = 0; i < this.EnclosureFileList.length; i++){
          var msg = this.EnclosureFileList[i]
          this.AddAnnounceForm.announcementAttachmentList.push({name:msg.name,url:msg.url})
        }
        console.log(this.AddAnnounceForm.announcementAttachmentList)
        const res = await this.$http.put('/api/v1/announcementWeb/put/byId',this.AddAnnounceForm)
        const { data } = res
        if(data.code == 200) {
          this.$message.success(data.msg)
          this.pagenum = 1
          this.loadAnnounceList()
           // 清空表单
          this.AddAnnounceForm = this.AddAnnounceFormOld
          this.editFileListURL = []
          this.EnclosureFileList = []
        }
      },
      // 统一处理新增弹出框清空表单
      closeAddCB(){
        // 清空上传图片的列表
        this.$refs.addUpload.clearFiles()
        // 清空表单
         this.AddAnnounceForm = this.AddAnnounceFormOld
      },
      //统一处理修改弹出框清空表单
      closeEditCB(){
         this.AddAnnounceForm = this.AddAnnounceFormOld
        this.editFileListURL = []
      },
      // 头图文件上传
       async uploadSectionFile(param){
           const file = param.file;
           let fd = new FormData();
          fd.append('uploadFile',file);//传文件
          fd.append('uploadType',1);//传文件
          const res = await this.$http.post(`/api/v1/background/upload`,fd)
          console.log(res)
          const { data } = res
          if(data.code == 200){
            this.$message.success(data.msg)
            // 上传成功的时候，帮地址保存下来，用于提交
            this.AddAnnounceForm.bannerUrl = data.result.url
            this.editFileListURL = [{url:this.AddAnnounceForm.bannerUrl}]
            return
          }
          // 错误提示，清空上传图片列表
          this.$message.error(data.msg)
          this.fileListURL = []
        },
        // 分页
        handleSizeChange (val) {
          console.log(`每页 ${val} 条`)
          this.pagesize = val
          this.loadAnnounceList()
        },
        handleCurrentChange (val) {
          console.log(`当前页: ${val}`)
          this.pagenum = val
          this.loadAnnounceList()
        },
        // 查看功能
        hanleLookAnnounce(rows){
          console.log(rows)
          this.lookAnnounceShow = true
          this.AddAnnounceForm = rows
          console.log(this.$refs.previewBannerImg)
        },
        // 查看弹出框关闭cb
        closeLookCB(){
          this.lookAnnounceShow = false
          // 清空表单
           this.AddAnnounceForm = this.AddAnnounceFormOld
          this.editFileListURL = []
        },
        // 打开弹出框的cb
        handleOpen(){
          setTimeout(()=>{
            console.log(this.$refs.previewBanner)
            this.$refs.previewBanner.src = this.AddAnnounceForm.bannerUrl
            // 附件预览 图片，显示 文件，文件名 /\w(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/i
            const reg = /\.(.gif|\.jpeg|\.png|\.jpg|\.bmp)$/
            reg.test(this.attachMsg.fileName)?
            this.$refs.previewattchFile.innerHTML = `<img src="${this.attachMsg.url}" alt=""  style="width:140px; height:80px;">`:
            this.$refs.previewattchFile.innerHTML = `${this.attachMsg.fileName}`
           },0)
          
        },
        // 附件上传
       async uploadEnclosureFile(param){
          const file = param.file
          let fd = new FormData()
          fd.append('uploadFile',file);//传文件
          fd.append('uploadType',4);//传文件
          const res = await this.$http.post(`/api/v1/background/upload`,fd)
          console.log(res )
          const { data:{ code,msg,result } } = res
          if(code == 200){
           // 保存附件列表信息
           this.AddAnnounceForm.announcementAttachmentList.push({name:result.fileName,url:result.url})
          // 附件预览
          this.EnclosureFileList.push({url:result.url,name:result.fileName})
          
          }
          // 错误提示，清空上传图片列表
          this.$message.error(data.msg)
        },
        // 附件移除钩子
        handleEnclosureFileRemove(file, fileList){
            var a = []
            for(var i = 0; i < fileList.length; i++){
               a.push({url:fileList[i].url,name:fileList[i].name})
            }
            this.EnclosureFileList = a
        },
        // 权限管理公告
         showAnnounceRights(rows,userIdList){
           // 保存当前row信息
            this.currentRow = rows
            this.checkedList = []
            this.announceRightsShowDia = true
            // 保存公告id
            this.announcementId = rows.id
            // 默认选中
            console.log(rows)
            this.checkedList = userIdList
            console.log(this.checkedList) 
           
          },
        // 
       async getDepartmentUsersListAll(){
          const res = await this.$http.post(`/api/v1/departmentWebApi/getDepartmentUsersListAll`)
          const { data: { code, result } } = res
          if(code === 200){
            this.departmentUsersList = result
          }
        },
        // 设置权限
       async handleSetAnnounceRight(){
           // 获取被选这个权限的id
          const checkedKeys = this.$refs.tree.getCheckedKeys(true)
          console.log(checkedKeys)
          const res = await this.$http.post(`/api/v1/announcementWeb/configAnnouncement`,{
            "announcementId": this.announcementId,
            "userIdList":checkedKeys
          })
          const { data:{code, result} } = res
          if(code === 200){
            this.$message.success(result)
            this.announceRightsShowDia = false
            
            this.loadAnnounceList()

          }else {
            this.$message.error(result)
          }
        },
        closeRightsCB(){
          
        },
       treeOpenCB(){
          var list = this.currentRow.userIdList
          //  设置默认选中情况
             this.$refs.tree.setCheckedKeys(list)
           
        }
    }
}
</script>

<style scoped>
.ql-container{
  min-height: 150px;
}
/* 超出固定行数显示省略号 */
.context-wrap {
  width: 100%;
  white-space: normal;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  overflow: hidden;
                

}
.on {
    width: 100%;
    white-space: normal;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 0;
    text-overflow: ellipsis;
    overflow: hidden;
}


body .el-table th.gutter{
    display: table-cell!important;
}
.el-table{
  margin-bottom: 25px;
  min-height: 400px
}


</style>
