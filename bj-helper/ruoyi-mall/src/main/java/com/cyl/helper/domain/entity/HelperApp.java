package com.cyl.helper.domain.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseAudit;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;

/**
 * APP软件管理对象 helper_app
 *
 * @author whb
 */
@ApiModel(description="APP软件管理对象")
@Data
@TableName("helper_app")
public class HelperApp extends BaseAudit {
    private static final long serialVersionUID = 1L;

    @ApiModelProperty("ID")
    @Excel(name = "ID")
    private Long id;

    @ApiModelProperty("app名称")
    @Excel(name = "app名称")
    private String appName;

    @ApiModelProperty("app包名")
    @Excel(name = "app包名")
    private String appPageName;

    @ApiModelProperty("app时长")
    @Excel(name = "app时长")
    private Integer taskTime;



    @ApiModelProperty("app脚本路径")
    @Excel(name = "app脚本路径")
    private String appJsPath;

    @ApiModelProperty("apk下载地址")
    @Excel(name = "apk下载地址")
    private String appApkUrl;

    @ApiModelProperty("状态")
    @Excel(name = "状态")
    private String status;

    @ApiModelProperty("是否显示（0显示，1不显示）")
    @Excel(name = "是否显示")
    private String displayFlag;



    @ApiModelProperty("删除标志（0代表存在 2代表删除）")
    private String delFlag;

    @ApiModelProperty("显示顺序")
    @Excel(name = "显示顺序")
    private Integer orderNum;

    @ApiModelProperty("部门id")
    private Long deptId;

    /**
     * 创建者
     */
    private Long createBy;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * 更新者
     */
    private Long updateBy;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

}
