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
          v-hasPermi="['helper:HelperBmMemberDay:remove']"
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
          v-hasPermi="['helper:helperBmMemberDay:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="HelperBmMemberDayList" >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="日期" align="center" prop="recordYearMonth" v-if="columns[0].visible"/>
      <el-table-column label="天" align="center" prop="recordDay" v-if="columns[1].visible"/>
      <el-table-column label="会员账户总数" align="center" prop="memberTotalNum" v-if="columns[2].visible"/>
      <el-table-column label="会员新增数" align="center" prop="memberNewNum" v-if="columns[3].visible"/>
      <el-table-column label="会员活跃数" align="center" prop="memberActiveNum" v-if="columns[4].visible"/>
      <el-table-column label="会员异常数" align="center" prop="memberAnomaliesNum" v-if="columns[5].visible"/>
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['helper:helperBmMemberDay:remove']"
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
import { listHelperBmMemberDay, getHelperBmMemberDay, delHelperBmMemberDay, addHelperBmMemberDay, updateHelperBmMemberDay, exportHelperBmMemberDay } from "@/api/helper/helperBmMemberDay";

export default {
  name: "HelperBmMemberDay",
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
      HelperBmMemberDayList: [],
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
        memberTotalNum: null,
        memberNewNum: null,
        memberActiveNum: null,
        memberAnomaliesNum: null,
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
      },
      columns: [
            { key: 1, label: "日期", visible:  true  },
            { key: 2, label: "天", visible:  true  },
            { key: 3, label: "会员账户总数", visible:  true  },
            { key: 4, label: "会员新增数", visible:  true  },
            { key: 5, label: "会员活跃数", visible:  true  },
            { key: 6, label: "会员异常数", visible:  true  },
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
      listHelperBmMemberDay(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.HelperBmMemberDayList = content;
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
        memberTotalNum: null,
        memberNewNum: null,
        memberActiveNum: null,
        memberAnomaliesNum: null,
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
      getHelperBmMemberDay(id).then(response => {
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
            updateHelperBmMemberDay(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHelperBmMemberDay(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除【请填写功能名称】编号为"' + ids + '"的数据项？').then(function() {
        return delHelperBmMemberDay(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有【请填写功能名称】数据项？').then(() => {
        this.exportLoading = true;
        return exportHelperBmMemberDay(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
