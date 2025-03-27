<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="app名称" prop="appName">
        <el-input
          v-model.trim="queryParams.appName"
          placeholder="请输入app名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="app包名" prop="appPageName">
        <el-input
          v-model.trim="queryParams.appPageName"
          placeholder="请输入app包名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
            <el-option
              v-for="dict in dict.type.sys_common_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
        </el-select>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['helper:helperApp:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['helper:helperApp:edit']"
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
          v-hasPermi="['helper:helperApp:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['helper:helperApp:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table Table v-loading="loading" :data="HelperAppList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="app名称" align="center" prop="appName" v-if="columns[0].visible"/>
      <el-table-column label="app包名" align="center" prop="appPageName" v-if="columns[1].visible"/>
      <el-table-column label="任务时长(分钟)" align="center" prop="taskTime" v-if="columns[2].visible"/>
      <el-table-column label="显示顺序" align="center" prop="orderNum" v-if="columns[3].visible"/>

      <el-table-column label="脚本路径" align="center" prop="appJsPath" v-if="columns[3].visible"/>

      <el-table-column label="下载地址" align="center" prop="appApkUrl" v-if="columns[3].visible"/>
      <el-table-column label="是否显示" align="center" prop="displayFlag" v-if="columns[5].visible">
        <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_common_display_flag" :value="scope.row.displayFlag"/>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" prop="status" v-if="columns[4].visible">
        <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_common_status" :value="scope.row.status"/>
        </template>
      </el-table-column>

      
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDelete(scope.row)"
            v-hasPermi="['helper:HelperApp:remove']"
          >配置任务</el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['helper:helperApp:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['helper:helperApp:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table >

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改APP软件管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="app名称" prop="appName">
          <el-input v-model.trim="form.appName" placeholder="请输入app名称" />
        </el-form-item>
        <el-form-item label="app包名" prop="appPageName">
          <el-input v-model.trim="form.appPageName" placeholder="请输入app包名" />
        </el-form-item>
        <el-form-item label="任务时长" prop="taskTime">
          <el-input v-model.trim="form.taskTime" placeholder="请输入APP任务时长" />
        </el-form-item>
        <el-form-item label="脚本路径" prop="appJsPath">
          <el-input v-model.trim="form.appJsPath" placeholder="请输入APP脚本路径" />
        </el-form-item>

        <el-form-item label="下载地址" prop="appApkUrl">
          <el-input v-model.trim="form.appApkUrl" placeholder="请输入APk下载地址" />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_common_status"
              :key="dict.value"
              :label="dict.value"            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否显示">
          <el-radio-group v-model="form.displayFlag">
            <el-radio
              v-for="dict in dict.type.sys_common_display_flag"
              :key="dict.value"
              :label="dict.value"            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input v-model.trim="form.orderNum" placeholder="请输入显示顺序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listHelperApp, getHelperApp, delHelperApp, addHelperApp, updateHelperApp, exportHelperApp } from "@/api/helper/helperApp";

export default {
  name: "HelperApp",
  dicts: ['sys_common_status','sys_common_display_flag'],
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
      // APP软件管理表格数据
      HelperAppList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        appName: null,
        appPageName: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        appName: [
          { required: true, message: "app名称不能为空", trigger: "blur" }
        ],
        appPageName: [
          { required: true, message: "app包名不能为空", trigger: "blur" }
        ],
        taskTime: [
          { required: true, message: "app任务时长不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" }
        ],
        displayFlag: [
          { required: true, message: "是否显示不能为空", trigger: "blur" }
        ]
        
      },
      columns: [
        { key: 0, label: "ID", visible:  true  },
            { key: 1, label: "app名称", visible:  true  },
            { key: 2, label: "app包名", visible:  true  },
            { key: 3, label: "任务时长", visible:  true  },
            { key: 5, label: "状态", visible:  true  },
            { key: 6, label: "显示顺序", visible:  true  },
            { key: 4, label: "是否显示", visible:  true  },
             ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询APP软件管理列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listHelperApp(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.HelperAppList = content;
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
        appName: null,
        appPageName: null,
        status: "0",
        displayFlag: "0",
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        orderNum: null,
        deptId: null
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
      this.title = "添加APP软件管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHelperApp(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改APP软件管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHelperApp(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHelperApp(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除APP软件管理编号为"' + ids + '"的数据项？').then(function() {
        return delHelperApp(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有APP软件管理数据项？').then(() => {
        this.exportLoading = true;
        return exportHelperApp(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
