<template>
   <el-card>
    <el-row>
        <el-col :span="8">
            <el-button type="primary">新增人员</el-button>
        </el-col>
        <el-col :span="8">
            <el-button type="success">导入排班安排</el-button>
        </el-col>
    </el-row>
    <el-table
             v-loading="isLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            ref="multipleTable"
            :data="arrangeWorkTableList"
            tooltip-effect="dark"
            style="width: 100%; margin-top:25px; "
            border
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="50">
            </el-table-column>

             <el-table-column
            prop="userName"
            label="姓名"
            width="80">
            </el-table-column>
           
             <el-table-column
            prop="week"
            label="排班情况"
            width="250">
                 <el-table-column
                    prop="type"
                    label="排序"
                    width="90">
                </el-table-column>
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
          :page-sizes="[ 6, 8, 10, 12]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
   </el-card>
</template>

<script>
export default {
    data(){
        return{
            // commmon配置参数
            // 表格加载动画
            isLoading: true,
          // 分页相关的属性
            pagenum: 1,
            pagesize: 4,
            total: 20,
            //table数据
            arrangeWorkTableList:[]
        }
    },
    mounted(){
        this.loadUserWorkList()
    },
    methods:{
        //加载人员列表
       async loadUserWorkList(){
           const res = await this.$http.post(`/api/v1/arrangeWorkWeb/queryArrangeWorkDepartment?userId=${sessionStorage.getItem('createId')}`)
           const { data: { code, result } } = res
           if(code === 200){
               this.isLoading = false
               this.arrangeWorkTableList = result
           }
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
        handleSelectionChange(){

        }
    }
}
</script>

<style>

</style>
