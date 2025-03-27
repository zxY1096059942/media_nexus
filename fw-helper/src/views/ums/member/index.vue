<template>
  <div class="app-container" v-if="show">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="创建时间">
        <el-date-picker
          size="small"
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          :clearable="true"
          :picker-options='pickerOptions'
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
 <el-form-item label="账号启用状态">
<el-select v-model="queryParams.status" placeholder="请选择" :clearable="true" size="small">
<el-option label="禁用" value="0">
</el-option>
<el-option label="启用" value="1">
</el-option>
 </el-select>
</el-form-item>
      <el-form-item label="账户名称" prop="nickname">
        <el-input
          v-model.trim="queryParams.nickname"
          placeholder="请输入账户名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model.trim="queryParams.phone"
          placeholder="请输入手机号码"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="备注" prop="mark">
        <el-select v-model="queryParams.hasMark" clearable size="small">
          <el-option value="1" label="有备注" />
          <el-option value="0" label="无备注"/>
        </el-select>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <!--        <el-button :icon="showMoreCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" size="mini" @click="showMoreCondition = !showMoreCondition">{{showMoreCondition ? '收起条件' : '展开条件'}}</el-button>-->
      </el-form-item>
    </el-form>


    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ums:member:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ums:member:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ums:member:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['ums:member:export']"
        >导出</el-button>
      </el-col>
    
      
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" ></right-toolbar>
    </el-row>


    <el-table v-loading="loading" :data="umsMemberList" >
      <el-table-column label="账户ID" prop="id" width="60"/>
      <el-table-column label="账户名称" prop="nickname" width="100"/>
      <el-table-column label="手机号码" prop="phoneHidden" width="120"/>
      <!-- <el-table-column label="启用状态" prop="status" width="150"/> -->
      <el-table-column label="佣金" width="80">
        <template v-slot="scope">
          <div>0.00</div>
        </template>
      </el-table-column>
      <el-table-column label="积分" width="80">
        <template v-slot="scope">
          <div>0.00</div>
        </template>
      </el-table-column>
      <el-table-column label="余额" width="80">
        <template v-slot="scope">
          <div>{{ scope.row.status }}</div>
        </template>
      </el-table-column>


      <el-table-column label="启用操作" align="center" key="status" width="80">
        <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :inactive-value="0" 
                :active-value="1"              
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
   
      </el-table-column>

      <el-table-column label="注册时间" prop="createTime" width="180">
        <template v-slot="scope">
          <div>{{ parseTime(scope.row.createTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="上次登录" prop="createTime">
        <template v-slot="scope">
          <div>{{ parseTime(scope.row.createTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template v-slot="scope">
          <span class="mr10">{{scope.row.mark}}</span>
          <i class="el-icon-edit pointer" @click="showUpdateMark(scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" fix="right" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="goAddApp(scope.row.id)"
          >添加APP</el-button>

          <el-button
            size="mini"
            type="text"
            @click="goConfigApp(scope.row.id)"
          >查看APP</el-button>

          <el-button
            size="mini"
            type="text"
            @click="showStatistics(scope.row.id)"
            v-hasPermi="['ums:member:statistics']"
          >查看数据
          </el-button>

          

          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ums:member:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ums:member:remove']"
          >删除</el-button>




          <!-- <el-button
            size="mini"
            type="text"
            @click="goOrder(scope.row.phoneEncrypted)"
          >查看下单</el-button>
          <el-button
            size="mini"
            type="text"
            @click="goCart(scope.row.phoneEncrypted)"
          >查看购物车</el-button> -->
        </template>
      </el-table-column>
    </el-table>



    <!-- 查看和删除配置APP对话框 -->
    <el-dialog :title="configAppObj.title" :visible.sync="configAppObj.open" width="800px" append-to-body>
        
    <el-table Table v-loading="loading" :data="FindHelperAppList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="appId" align="center" prop="id" />
      <el-table-column label="app名称" align="center" prop="appName" />
      <el-table-column label="app包名" align="center" prop="appPageName"/>
    </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="configAppSubmitForm(configAppObj.memberId)">删 除</el-button>
        <el-button @click="configAppCancel">取 消</el-button>
      </div>
    </el-dialog>


    
    <!-- 添加配置APP对话框 -->
    <el-dialog :title="addConfigAppObj.title" :visible.sync="addConfigAppObj.open" width="800px" append-to-body>
        
        <el-table Table v-loading="loading" :data="HelperAppList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="appId" align="center" prop="id" />
          <el-table-column label="app名称" align="center" prop="appName" />
          <el-table-column label="app包名" align="center" prop="appPageName"/>
        </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addConfigAppSubmitForm">确定</el-button>
            <el-button @click="addConfigAppCancel">取 消</el-button>
          </div>
        </el-dialog>


<!-- 添加或修改账户信息对话框 -->
<el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="账户名称" prop="nickname">
          <el-input v-model.trim="form.nickname" placeholder="请输入账户名称" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="form.password" placeholder="请输入密码" type="password" maxlength="20" show-password/>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneHidden">
          <el-input v-model.trim="form.phoneHidden" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input v-model.trim="form.mark" placeholder="请输入账户备注" />
        </el-form-item>
        <el-form-item label="启用状态">
              <!-- <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}
              </el-radio>
              </el-radio-group> -->
              <el-radio-group v-model="form.status">
                <el-radio  :label="1">启用</el-radio>
                <el-radio  :label="0">停用</el-radio>
              </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="头像" prop="avatar">
          <el-input v-model.trim="form.avatar" placeholder="请输入头像" />
        </el-form-item> -->
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option
              v-for="dict in dict.type.sys_user_sex"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在城市" prop="city">
          <el-input v-model.trim="form.city" placeholder="请输入账户所属城市" />
        </el-form-item>
        <el-form-item label="所在省份" prop="province">
          <el-input v-model.trim="form.province" placeholder="请输入账户所属省份" />
        </el-form-item>
        <el-form-item label="所在国家" prop="country">
          <el-input v-model.trim="form.country" placeholder="请输入账户所属国家"></el-input>
        </el-form-item>
     
        <el-form-item label="生日" prop="birthday">
          <el-date-picker clearable size="small"
                        v-model="form.birthday"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择生日">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="推广员id" prop="spreadUid">
          <el-input v-model.trim="form.spreadUid" placeholder="请输入推广员id" />
        </el-form-item>
        <el-form-item label="推广时间" prop="spreadTime">
          <el-date-picker clearable size="small"
                        v-model="form.spreadTime"
                        type="datetime"
                        value-format="yyyy-MM-ddTHH:mm:ss"
                        placeholder="选择推广员关联时间">
          </el-date-picker>
        </el-form-item> -->
        <!-- <el-form-item label="等级" prop="level">
          <el-input v-model.trim="form.level" placeholder="请输入等级" />
        </el-form-item>
        <el-form-item label="剩余积分" prop="integral">
          <el-input v-model.trim="form.integral" placeholder="请输入账户剩余积分" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="update" width="50%" append-to-body>
      <el-form ref="updateForm" :model="updateForm" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="账户名称" prop="nickname">
          <el-input v-model.trim="updateForm.nickname" placeholder="请输入账户名称" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="updateForm.password" placeholder="请输入密码" type="password" maxlength="20" show-password/>
        </el-form-item>
        <el-form-item label="手机号">
          {{updateForm.phoneHidden}}
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input v-model.trim="updateForm.mark" placeholder="请输入账户备注" />
        </el-form-item>
        <el-form-item label="启用状态">
              <el-radio-group v-model="updateForm.status">
                <el-radio  :label="1">启用</el-radio>
                <el-radio  :label="0">停用</el-radio>
              </el-radio-group>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="updateForm.gender" placeholder="请选择性别">
            <el-option
              v-for="dict in dict.type.sys_user_sex"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在城市" prop="city">
          <el-input v-model.trim="updateForm.city" placeholder="请输入账户所属城市" />
        </el-form-item>
        <el-form-item label="所在省份" prop="province">
          <el-input v-model.trim="updateForm.province" placeholder="请输入账户所属省份" />
        </el-form-item>
        <el-form-item label="所在国家" prop="country">
          <el-input v-model.trim="updateForm.country" placeholder="请输入账户所属国家"></el-input>
        </el-form-item>
     
        <el-form-item label="生日" prop="birthday">
          <el-date-picker clearable size="small"
                        v-model="updateForm.birthday"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择生日">
          </el-date-picker>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpdateForm">确 定</el-button>
        <el-button @click="cancelUpdate">取 消</el-button>
      </div>
    </el-dialog>


    

    <InBody v-show="total>0">
      <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </InBody>
    <!--  统计  -->
    <el-dialog :title="statisticsObj.title" :visible.sync="statisticsObj.open" width="500px" append-to-body>
      <el-descriptions direction="vertical" :column="2" border>
        <el-descriptions-item label="使用天数">{{ statisticsObj.data.cartCount }}</el-descriptions-item>
        <el-descriptions-item label="总金币数">￥{{ statisticsObj.data.orderCount }}</el-descriptions-item>
        <el-descriptions-item label="总金额">￥{{ statisticsObj.data.orderAmount.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="已提现金额">￥{{ statisticsObj.data.aftersaleCount }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <el-dialog title="修改备注" :visible.sync="remarkModal.visible" width="30%" append-to-body>
      <el-input type='textarea' :rows='3' placeholder='请输入内容' v-model='remarkModal.mark'/>
      <span class="dialog-footer" slot="footer">
        <el-button @click="remarkModal.visible = false">取 消</el-button>
        <el-button type='primary' @click='updateRemark'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addUmsMember,
  changeAccountStatus,
  decryptedPhone,
  delUmsMember,
  exportUmsMember,
  getUmsMember,
  listUmsMember,
  updateUmsMember,
  updateUmsMemberMark,
  viewStatistics
} from "@/api/ums/member";
import dateUtil from '@/utils/DateUtil';
import {isStarRepo} from "@/utils/is-star-plugin";
import {mapGetters} from "vuex";
import { listHelperApp,getUserByListHelperApp, bacthAddHelperApp, bacthDelHelperApp } from "@/api/helper/helperApp";


export default {
  name: "UmsMember",
  dicts: ['sys_normal_disable', 'sys_user_sex'],
  data() {
    return {
      show: false,
      pickerOptions: {
        shortcuts: dateUtil.getTimeShort()
      },
      remarkModal: {
        visible: false,
        mark: null,
        memberId: null,
      },
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 账户信息表格数据
      umsMemberList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      update: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickname: null,
        phone: null,
        status: undefined,
        hasMark: undefined
      },
      dateRange:[],
      // 表单参数
      form: {
       
      },
      updateForm:{

      },
      // 表单校验
      // 表单校验
      rules: {
        nickname: [
          { required: true, message: "账户账户名称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "账户密码不能为空", trigger: "blur" },
          { min: 5, max: 20, message: '账户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
        phoneHidden: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      showMoreCondition: false,
      statisticsObj: {
        open: false,
        data: {
          cartCount: 0,
          orderCount: 0,
          orderAmount: 0.00,
          aftersaleCount: 0
        },
        title: '账户数据统计'
      },
      configAppObj: {
        open: false,
        memberId: 0,
        data: {
         
        },
        title: '查看配置APP'
      },
      addConfigAppObj: {
        open: false,
        data: {
          appId:[],
          memberId: null,
        },
        title: '添加配置APP'
      },
      
      // APP软件管理表格数据
      HelperAppList: [],
      FindHelperAppList: [],
    };
  },

  async created() {
    const res = await isStarRepo('whb', 'YUNCAI', this.userId, '', 'APP助手', 'helper')
    this.show = res;
    if (res) {
      this.getList();
      
    }
  },
  computed:{
    ...mapGetters(['userId']),
  },


  methods: {
    showUpdateMark(record){
      this.remarkModal = {
        visible: true,
        mark: record.mark,
        memberId: record.id
      }
    },
    updateRemark(){
      updateUmsMemberMark({id:this.remarkModal.memberId,mark:this.remarkModal.mark})
        .then(res=>{
          if (res > 0) {
            this.$message.success('修改成功');
            this.remarkModal.visible = false;
            const obj = this.umsMemberList.filter(it=>it.id === this.remarkModal.memberId)[0]
            obj.mark = this.remarkModal.mark;
          } else {
            this.$message.success('修改失败');
          }
        })
    },

    getFindHelperAppList(id) {
      this.loading = true;
        getUserByListHelperApp(id).then(response => {
        const { content} = response
        this.FindHelperAppList = response;
        this.loading = false;
      });
    },

    getHelperAppList(id) {
      this.loading = true;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: 0, size: 1000};
      listHelperApp(query, pageReq).then(response => {
        const { content } = response
        this.HelperAppList = content;
        this.loading = false;
      });
    },

    /** 查询账户信息列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      let query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      if (!this.dateRange || this.dateRange.length > 0){
        query = { ...this.addDateRange2(query, this.dateRange) }
      }
      listUmsMember(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.umsMemberList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelUpdate() {
      this.update = false;
      this.resetUpdate();
    },
    configAppCancel() {
      this.configAppObj.open = false;
      this.configAppObj.memberId =0;
      this.reset();
    },

    addConfigAppCancel() {
      this.addConfigAppObj.open = false;
      this.reset();
    },

    addConfigAppSubmitForm() {
      const ids = this.ids;
      this.addConfigAppObj.data.appId = ids;
   
      this.addConfigAppObj.open = false;

      bacthAddHelperApp(this.addConfigAppObj.data).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
    },


    configAppSubmitForm(member) {
      const ids = this.ids;
      this.configAppObj.open = false;
      this.$modal.confirm('是否确认要删除"' + ids + '"这几款APP软件嘛？').then(function() {
        return bacthDelHelperApp(ids,member);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除APP软件成功");
      }).catch(() => {});
    },



    // 表单重置
    reset() {
      this.form = {
        id: null,
        nickname: null,
        password: null,
        phone: null,
        mark: null,
        status: null,
        avatar: null,
        gender: null,
        city: null,
        province: null,
        country: null,
        remark: null,
        birthday: null,
        spreadUid: null,
        spreadTime: null,
        level: null,
        integral: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    resetUpdate() {
      this.updateForm = {
        id: null,
        nickname: null,
        password: null,
        phone: null,
        mark: null,
        status: null,
        avatar: null,
        gender: null,
        city: null,
        province: null,
        country: null,
        remark: null,
        birthday: null,
        spreadUid: null,
        spreadTime: null,
        level: null,
        integral: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("updateForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加账户信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.resetUpdate();
      const id = row.id || this.ids
      getUmsMember(id).then(response => {
        this.updateForm = response;
        // this.updateForm.phone = this.phoneHidden;
        // delete this.updateForm.phoneHidden;
        // delete this.updateForm.decryptedPhone;
        this.update = true;
        this.title = "修改账户信息";
      });
    },
    



      
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateUmsMember(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUmsMember(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
        /** 提交按钮 */
    submitUpdateForm() {
      this.$refs["updateForm"].validate(valid => {
        if (valid) {
          if (this.updateForm.id != null) {
            updateUmsMember(this.updateForm).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.update = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除账户ID为"' + ids + '"的会员吗？').then(function() {
        return delUmsMember(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有账户信息数据项？').then(() => {
        this.exportLoading = true;
        return exportUmsMember(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    },
       /** 配置app */
    goConfigApp(row) {
      this.reset();
      const id = row;
      this.configAppObj.open = true;
      this.configAppObj.memberId= id;
      this.getFindHelperAppList(id);
    },

    goAddApp(row) {
      this.reset();
      const id = row;
      this.addConfigAppObj.data.memberId = id;
      this.addConfigAppObj.open = true;
      this.getHelperAppList(id);
    },
    // 更改账户状态
    handleStatusChange(row) {
      console.log('Switch changed to:', row);
      let text = row.status === 1 ? "启用" : "停用";
      const data = {
        memberId: row.id,
        status: row.status
      }
      this.$modal.confirm('确认要"' + text + '""' + row.nickname + '"账户吗？').then(function() {
        return changeAccountStatus(data);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "1" ? "0" : "1";
      });
    },

    
    // handleStatusChange(row){
    //   const data = {
    //     memberId: row.id,
    //     status: row.status
    //   }
    //   changeAccountStatus(data).then(response => {
    //     if (response < 1){
    //       this.$modal.msgError('操作失败')
    //       this.getList()
    //     }
    //   })
    // },
    goOrder(phone){
      decryptedPhone(phone).then(res => {
        this.$router.push({
          path: '/order/order',
          query: {
            phone: res
          }
        })
      })
    },
    goCart(phone){
      decryptedPhone(phone).then(res => {
        this.$router.push({
          path: '/member/shoppingCart',
          query: {
            phone: res
          }
        })
      })
    },
    showStatistics(memberId){
      viewStatistics(memberId).then((response) => {
        this.statisticsObj.data = response
        this.statisticsObj.open = true
      })
    }
  }
};
</script>
