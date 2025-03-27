package com.cyl.helper.domain.vo;


import com.ruoyi.common.annotation.Excel;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.ruoyi.common.core.domain.BaseAudit;
import lombok.Data;
/**
 * APP软件管理 数据视图对象
 *
 * @author whb
 */
@Data
public class HelperAppVO extends BaseAudit {
    /** ID */
    @Excel(name = "ID")
    private Long id;
    /** app名称 */
    @Excel(name = "app名称")
    private String appName;
    /** app包名 */
    @Excel(name = "app包名")
    private String appPageName;
    @Excel(name = "app任务时长")
    private Integer taskTime;

    private String appJsPath;
    private String appApkUrl;
    private String displayFlag;
    /** 状态 */
    @Excel(name = "状态")
    private String status;
    /** 显示顺序 */
    @Excel(name = "显示顺序")
    private Integer orderNum;
    /** 部门id */
    private Long deptId;
}
