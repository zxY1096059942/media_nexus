<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="日期" prop="recordYearMonth">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.recordYearMonth"
            type="date"
            value-format="yyyyMMdd"
            placeholder="请输入日期">
        </el-date-picker>

      </el-form-item>
      <el-form-item label="会员账户" prop="memberId">
        <el-input
          v-model.trim="queryParams.memberId"
          placeholder="请输入会员ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="APPID" prop="appId">
        <el-input
          v-model.trim="queryParams.appId"
          placeholder="请输入APPID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
     <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['helper:helperBmMemberAppDay:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="HelperBmMemberAppDayList">
      
      <el-table-column label="日期" align="center" prop="recordYearMonth" v-if="columns[0].visible"/>
      <el-table-column label="会员账户" align="center" prop="memberId" v-if="columns[2].visible"/>
      <el-table-column label="APPID" align="center" prop="appId" v-if="columns[3].visible"/>
      <el-table-column label="金币数量" align="center" prop="goldCoinNum" v-if="columns[4].visible"/>
      <el-table-column label="红包金额" align="center" prop="redPacketAmount" v-if="columns[5].visible"/>
      <el-table-column label="现金" align="center" prop="cashOutAmount" v-if="columns[6].visible"/>     
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { listHelperBmMemberAppDay, getHelperBmMemberAppDay,exportHelperBmMemberAppDay } from "@/api/helper/helperBmMemberAppDay";

export default {
  name: "HelperBmMemberAppDay",
  data() {
    return {
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
      // 【请填写功能名称】表格数据
      HelperBmMemberAppDayList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30,
        recordYearMonth: null,
        recordDay: null,
        memberId: null,
        appId: null,
        goldCoinNum: null,
        redPacketAmount: null,
        cashOutAmount: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        recordYearMonth: [
          { required: true, message: "日期不能为空", trigger: "blur" }
        ],
        recordDay: [
          { required: true, message: "天不能为空", trigger: "blur" }
        ],
        memberId: [
          { required: true, message: "账户ID不能为空", trigger: "blur" }
        ],
        appId: [
          { required: true, message: "APPID不能为空", trigger: "blur" }
        ],
      },
      columns: [
            { key: 1, label: "日期", visible:  true  },
            { key: 2, label: "天", visible:  true  },
            { key: 3, label: "会员账户", visible:  true  },
            { key: 4, label: "APPID", visible:  true  },
            { key: 5, label: "金币", visible:  true  },
            { key: 6, label: "红包", visible:  true  },
            { key: 7, label: "现金", visible:  true  },
                 ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listHelperBmMemberAppDay(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.HelperBmMemberAppDayList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        recordYearMonth: null,
        recordDay: null,
        memberId: null,
        appId: null,
        goldCoinNum: null,
        redPacketAmount: null,
        cashOutAmount: null,
        updateTime: null,
        createTime: null
      };
      this.resetForm("form");
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
    
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有数据项？').then(() => {
        this.exportLoading = true;
        return exportHelperBmMemberAppDay(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
