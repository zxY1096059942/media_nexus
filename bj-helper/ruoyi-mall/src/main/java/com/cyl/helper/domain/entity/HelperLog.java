package com.cyl.helper.domain.entity;


import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.ruoyi.common.annotation.Excel;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
/**
 * 上报日志对象 helper_log
 *
 * @author zcc
 */
@ApiModel(description="上报日志对象")
@Data
@TableName("helper_log")
public class HelperLog {
    private static final long serialVersionUID = 1L;

    @ApiModelProperty("日志主键")
    @TableId(value = "oper_id", type = IdType.AUTO)
    private Long operId;

    @ApiModelProperty("模块标题")
    @Excel(name = "模块标题")
    private String title;

    @ApiModelProperty("业务类型（0其它 1新增 2修改 3删除）")
    @Excel(name = "业务类型", readConverterExp = "0=其它,1=新增,2=修改,3=删除")
    private Integer businessType;

    @ApiModelProperty("方法名称")
    @Excel(name = "方法名称")
    private String method;

    @ApiModelProperty("请求方式")
    @Excel(name = "请求方式")
    private String requestMethod;

    @ApiModelProperty("操作类别（0其它 1后台用户 2手机端用户）")
    @Excel(name = "操作类别", readConverterExp = "0=其它,1=后台用户,2=手机端用户")
    private Integer operatorType;

    @ApiModelProperty("操作人员")
    @Excel(name = "操作人员")
    private String operName;

    @ApiModelProperty("部门名称")
    @Excel(name = "部门名称")
    private String deptName;

    @ApiModelProperty("请求URL")
    @Excel(name = "请求URL")
    private String operUrl;

    @ApiModelProperty("主机地址")
    @Excel(name = "主机地址")
    private String operIp;

    @ApiModelProperty("操作地点")
    @Excel(name = "操作地点")
    private String operLocation;

    @ApiModelProperty("请求参数")
    @Excel(name = "请求参数")
    private String operParam;

    @ApiModelProperty("返回参数")
    @Excel(name = "返回参数")
    private String jsonResult;

    @ApiModelProperty("操作状态（0正常 1异常）")
    @Excel(name = "操作状态", readConverterExp = "0=正常,1=异常")
    private Integer status;

    @ApiModelProperty("错误消息")
    @Excel(name = "错误消息")
    private String errorMsg;

    @ApiModelProperty("操作时间")
    @Excel(name = "操作时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime operTime;

}

