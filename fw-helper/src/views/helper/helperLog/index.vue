<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
        <el-form-item label="模块标题" prop="title">
          <el-input
            v-model.trim="queryParams.title"
            placeholder="请输入模块标题"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="业务类型" prop="businessType">
          <el-select v-model="queryParams.businessType" placeholder="请选择业务类型" clearable size="small">
                <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="方法名称" prop="method">
          <el-input
            v-model.trim="queryParams.method"
            placeholder="请输入方法名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="请求方式" prop="requestMethod">
          <el-input
            v-model.trim="queryParams.requestMethod"
            placeholder="请输入请求方式"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="操作类别" prop="operatorType">
          <el-select v-model="queryParams.operatorType" placeholder="请选择操作类别" clearable size="small">
              <el-option
                v-for="dict in dict.type.sys_oper_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
          </el-select>
        </el-form-item>
        <el-form-item label="操作人员" prop="operName">
          <el-input
            v-model.trim="queryParams.operName"
            placeholder="请输入操作人员"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model.trim="queryParams.deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <template v-if="showMoreCondition">
        <el-form-item label="请求URL" prop="operUrl">
          <el-input
            v-model.trim="queryParams.operUrl"
            placeholder="请输入请求URL"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="主机地址" prop="operIp">
          <el-input
            v-model.trim="queryParams.operIp"
            placeholder="请输入主机地址"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="操作地点" prop="operLocation">
          <el-input
            v-model.trim="queryParams.operLocation"
            placeholder="请输入操作地点"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="操作状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择操作状态" clearable size="small">
              <el-option
                v-for="dict in dict.type.sys_common_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间" prop="operTime">
          <el-date-picker
              clearable
              size="small"
              v-model="queryParams.operTime"
              type="datetime"
              value-format="yyyy-MM-ddTHH:mm:ss"
              placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
      </template>
        <el-form-item class="flex_one tr">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          <el-button :icon="showMoreCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" size="mini" @click="showMoreCondition = !showMoreCondition">{{showMoreCondition ? '收起条件' : '展开条件'}}</el-button>
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
            v-hasPermi="['helper:helperLog:add']"
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
            v-hasPermi="['helper:helperLog:edit']"
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
            v-hasPermi="['helper:helperLog:remove']"
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
            v-hasPermi="['helper:helperLog:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="HelperLogList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="模块标题" align="center" prop="title" v-if="columns[0].visible"/>
        <el-table-column label="业务类型" align="center" prop="businessType" v-if="columns[1].visible"/>
        <el-table-column label="方法名称" align="center" prop="method" v-if="columns[2].visible"/>
        <el-table-column label="请求方式" align="center" prop="requestMethod" v-if="columns[3].visible"/>
        <el-table-column label="操作类别" align="center" prop="operatorType" v-if="columns[4].visible">
          <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_oper_type" :value="scope.row.operatorType"/>
          </template>
        </el-table-column>
        <el-table-column label="操作人员" align="center" prop="operName" v-if="columns[5].visible"/>
        <el-table-column label="部门名称" align="center" prop="deptName" v-if="columns[6].visible"/>
        <el-table-column label="请求URL" align="center" prop="operUrl" v-if="columns[7].visible"/>
        <el-table-column label="主机地址" align="center" prop="operIp" v-if="columns[8].visible"/>
        <el-table-column label="操作地点" align="center" prop="operLocation" v-if="columns[9].visible"/>
        <el-table-column label="请求参数" align="center" prop="operParam" v-if="columns[10].visible"/>
        <el-table-column label="返回参数" align="center" prop="jsonResult" v-if="columns[11].visible"/>
        <el-table-column label="操作状态" align="center" prop="status" v-if="columns[12].visible">
          <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_common_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="错误消息" align="center" prop="errorMsg" v-if="columns[13].visible"/>
        <el-table-column label="操作时间" align="center" prop="operTime" width="180" v-if="columns[14].visible">
          <template slot-scope="scope">
              <span>{{ parseTime(scope.row.operTime, '')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['helper:helperLog:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['helper:helperLog:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
  
      <!-- 添加或修改上报日志对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
          <el-form-item label="模块标题" prop="title">
            <el-input v-model.trim="form.title" placeholder="请输入模块标题" />
          </el-form-item>
          <el-form-item label="业务类型" prop="businessType">
            <el-select v-model="form.businessType" placeholder="请选择业务类型">
              <el-option label="请选择字典生成" value="" />
            </el-select>
          </el-form-item>
          <el-form-item label="方法名称" prop="method">
            <el-input v-model.trim="form.method" placeholder="请输入方法名称" />
          </el-form-item>
          <el-form-item label="请求方式" prop="requestMethod">
            <el-input v-model.trim="form.requestMethod" placeholder="请输入请求方式" />
          </el-form-item>
          <el-form-item label="操作类别" prop="operatorType">
            <el-select v-model="form.operatorType" placeholder="请选择操作类别">
              <el-option
                v-for="dict in dict.type.sys_oper_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"            ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作人员" prop="operName">
            <el-input v-model.trim="form.operName" placeholder="请输入操作人员" />
          </el-form-item>
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model.trim="form.deptName" placeholder="请输入部门名称" />
          </el-form-item>
          <el-form-item label="请求URL" prop="operUrl">
            <el-input v-model.trim="form.operUrl" placeholder="请输入请求URL" />
          </el-form-item>
          <el-form-item label="主机地址" prop="operIp">
            <el-input v-model.trim="form.operIp" placeholder="请输入主机地址" />
          </el-form-item>
          <el-form-item label="操作地点" prop="operLocation">
            <el-input v-model.trim="form.operLocation" placeholder="请输入操作地点" />
          </el-form-item>
          <el-form-item label="请求参数" prop="operParam">
            <el-input v-model="form.operParam" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="返回参数" prop="jsonResult">
            <el-input v-model="form.jsonResult" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="操作状态">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in dict.type.sys_common_status"
                :key="dict.value"
                :label="parseInt(dict.value)"            >{{dict.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="错误消息" prop="errorMsg">
            <el-input v-model="form.errorMsg" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="操作时间" prop="operTime">
            <el-date-picker clearable size="small"
                          v-model="form.operTime"
                          type="datetime"
                          value-format="yyyy-MM-ddTHH:mm:ss"
                          placeholder="选择操作时间">
            </el-date-picker>
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
  import { listHelperLog, getHelperLog, delHelperLog, addHelperLog, updateHelperLog, exportHelperLog } from "@/api/helper/helperLog";
  
  export default {
    name: "HelperLog",
    dicts: ['sys_oper_type', 'sys_common_status'],
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
        // 上报日志表格数据
        HelperLogList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          title: null,
          businessType: null,
          method: null,
          requestMethod: null,
          operatorType: null,
          operName: null,
          deptName: null,
          operUrl: null,
          operIp: null,
          operLocation: null,
          operParam: null,
          jsonResult: null,
          status: null,
          errorMsg: null,
          operTime: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
        },
        columns: [
              { key: 1, label: "模块标题", visible:  true  },
              { key: 2, label: "业务类型（0其它 1新增 2修改 3删除）", visible:  true  },
              { key: 3, label: "方法名称", visible:  true  },
              { key: 4, label: "请求方式", visible:  true  },
              { key: 5, label: "操作类别（0其它 1后台用户 2手机端用户）", visible:  true  },
              { key: 6, label: "操作人员", visible:  true  },
              { key: 7, label: "部门名称", visible:  true  },
              { key: 8, label: "请求URL", visible:  true  },
              { key: 9, label: "主机地址", visible:  true  },
              { key: 10, label: "操作地点", visible:  false  },
              { key: 11, label: "请求参数", visible:  false  },
              { key: 12, label: "返回参数", visible:  false  },
              { key: 13, label: "操作状态（0正常 1异常）", visible:  false  },
              { key: 14, label: "错误消息", visible:  false  },
              { key: 15, label: "操作时间", visible:  false  },
           ],
        showMoreCondition: false
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询上报日志列表 */
      getList() {
        this.loading = true;
        const {pageNum, pageSize} = this.queryParams;
        const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
        const pageReq = {page: pageNum - 1, size: pageSize};
        listHelperLog(query, pageReq).then(response => {
          const { content, totalElements } = response
          this.HelperLogList = content;
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
          operId: null,
          title: null,
          businessType: null,
          method: null,
          requestMethod: null,
          operatorType: null,
          operName: null,
          deptName: null,
          operUrl: null,
          operIp: null,
          operLocation: null,
          operParam: null,
          jsonResult: null,
          status: 0,
          errorMsg: null,
          operTime: null
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
        this.ids = selection.map(item => item.operId)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加上报日志";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const operId = row.operId || this.ids
        getHelperLog(operId).then(response => {
          this.form = response;
          this.open = true;
          this.title = "修改上报日志";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.operId != null) {
              updateHelperLog(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addHelperLog(this.form).then(response => {
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
        const operIds = row.operId || this.ids;
        this.$modal.confirm('是否确认删除上报日志编号为"' + operIds + '"的数据项？').then(function() {
          return delHelperLog(operIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$modal.confirm('是否确认导出所有上报日志数据项？').then(() => {
          this.exportLoading = true;
          return exportHelperLog(queryParams);
        }).then(response => {
          this.$download.download(response);
          this.exportLoading = false;
        }).catch(() => {});
      }
    }
  };
  </script>
  