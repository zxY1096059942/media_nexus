<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      
      <el-form-item label="业务编码" prop="code">
        <el-input
          v-model.trim="queryParams.code"
          placeholder="请输入编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数据上报时间" prop="createTime">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.createTime"
            type="datetime"
            value-format="yyyy-MM-dd"
            placeholder="选择数据上报时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="处理状态" prop="handleStatus">
        <el-select v-model="queryParams.status" placeholder="请选择处理状态" clearable size="small">
              <el-option label="未处理" value="0" />
              <el-option label="已处理" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="账号ID" prop="memberid">
        <el-input
          v-model.trim="queryParams.memberid"
          placeholder="请输入账号ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备ID" prop="deviceid">
        <el-input
          v-model.trim="queryParams.deviceid"
          placeholder="请输入设备ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" >
       <span> </span>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
       
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['helper:HelperAppReport:remove']"
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
          v-hasPermi="['helper:helperAppReport:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="HelperAppReportList" >      
      <el-table-column label="数据类型" align="center" prop="type" v-if="columns[0].visible"/>
      <el-table-column label="业务编码" align="center" prop="code" v-if="columns[1].visible"/>
      <el-table-column label="上报数据内容" align="center" prop="reportData" v-if="columns[2].visible"/>
      <el-table-column label="数据上报时间" align="center" prop="createTime" width="180" v-if="columns[3].visible">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号ID" align="center" prop="memberId" v-if="columns[5].visible"/>
      <el-table-column label="设备ID" align="center" prop="deviceid" v-if="columns[6].visible"/>
      <el-table-column label="显示顺序" align="center" prop="orderNum" v-if="columns[7].visible"/>
      <el-table-column label="部门id" align="center" prop="deptId" v-if="columns[8].visible"/>
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['helper:HelperAppReport:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
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
import { listHelperAppReport, getHelperAppReport, delHelperAppReport, addHelperAppReport, updateHelperAppReport, exportHelperAppReport } from "@/api/helper/helperAppReport";

export default {
  name: "HelperAppReport",
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
      HelperAppReportList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        code: null,
        reportData: null,
        dataTime: null,
        status: null,
        memberid: null,
        deviceid: null,
        handleStatus: null,
        createTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          { required: true, message: "TYPE不能为空", trigger: "change" }
        ],
        dataTime: [
          { required: true, message: "数据生成时间不能为空", trigger: "blur" }
        ],
        memberid: [
          { required: true, message: "账号ID不能为空", trigger: "blur" }
        ],
      },
      columns: [
            { key: 1, label: "数据类型", visible:  true  },
            { key: 2, label: "业务编码", visible:  true  },
            { key: 3, label: "上报数据内容", visible:  true  },
            { key: 4, label: "数据上报时间", visible:  true  },
            { key: 5, label: "部门状态（0正常 1停用）", visible:  true  },
            { key: 7, label: "账号ID", visible:  true  },
            { key: 8, label: "设备ID", visible:  true  },
            { key: 13, label: "显示顺序", visible:  false  },
            { key: 14, label: "部门id", visible:  false  },
         ],
      showMoreCondition: false
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
      listHelperAppReport(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.HelperAppReportList = content;
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
        type: null,
        code: null,
        reportData: null,
        dataTime: null,
        status: "0",
        memberid: null,
        deviceid: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        orderNum: null,
        handleStatus: null
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加【请填写功能名称】";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHelperAppReport(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHelperAppReport(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHelperAppReport(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除编号为"' + ids + '"的数据项？').then(function() {
        return delHelperAppReport(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有数据项？').then(() => {
        this.exportLoading = true;
        return exportHelperAppReport(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
