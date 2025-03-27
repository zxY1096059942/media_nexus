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
 * app助手-app与账户关系表对象 helper_app_member
 *
 * @author zcc
 */
@ApiModel(description="app助手-app与账户关系表对象")
@Data
@TableName("helper_app_member")
public class HelperAppMember extends BaseAudit {
    private static final long serialVersionUID = 1L;

    @ApiModelProperty("ID")
    private Long id;

    @ApiModelProperty("app_id")
    @Excel(name = "app_id")
    private Long appId;

    @ApiModelProperty("账户id")
    @Excel(name = "账户id")
    private Long memberId;

    @ApiModelProperty("部门状态（0正常 1停用）")
    @Excel(name = "部门状态", readConverterExp = "0=正常,1=停用")
    private String status;

    @ApiModelProperty("删除标志（0代表存在 2代表删除）")
    private String delFlag;

    @ApiModelProperty("显示顺序")
    @Excel(name = "显示顺序")
    private Integer orderNum;

    @ApiModelProperty("部门id")
    @Excel(name = "部门id")
    private Long deptId;

    /**
     * 任务首次运行时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime firstRunTime;

    /**
     * 任务首次运行时间
     */
    @ApiModelProperty("任务状态 0:运行 1:暂停")
    @Excel(name = "任务状态 0:运行 1:暂停")
    private String runStatus;

    /**
     * 任务首次运行时间
     */
    @ApiModelProperty("子任务Id")
    @Excel(name = "子任务Id")
    private Long subTaskId;

    /*@ApiModelProperty("app名称")
    @Excel(name = "app名称")
    private String appName;

    @ApiModelProperty("app页名称")
    @Excel(name = "app页名称")
    private String appPageName;

    private int taskTime;

    private String appJsPath;


    private String appApkUrl;

    private String displayFlag;

    *//** 昵称 *//*
    private String nickname;

    *//** 隐藏前三位后四位的手机号 *//*
    private String phoneHidden;*/

}

