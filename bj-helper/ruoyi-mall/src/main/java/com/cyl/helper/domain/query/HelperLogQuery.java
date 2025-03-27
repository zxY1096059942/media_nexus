package com.cyl.helper.domain.query;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 上报日志 查询 对象
 *
 * @author zcc
 */
@ApiModel(description="上报日志 查询 对象")
@Data
public class HelperLogQuery {
    @ApiModelProperty("模块标题 精确匹配")
    private String title;

    @ApiModelProperty("业务类型（0其它 1新增 2修改 3删除） 精确匹配")
    private Integer businessType;

    @ApiModelProperty("方法名称 精确匹配")
    private String method;

    @ApiModelProperty("请求方式 精确匹配")
    private String requestMethod;

    @ApiModelProperty("操作类别（0其它 1后台用户 2手机端用户） 精确匹配")
    private Integer operatorType;

    @ApiModelProperty("操作人员 精确匹配")
    private String operNameLike;

    @ApiModelProperty("部门名称 精确匹配")
    private String deptNameLike;

    @ApiModelProperty("请求URL 精确匹配")
    private String operUrl;

    @ApiModelProperty("主机地址 精确匹配")
    private String operIp;

    @ApiModelProperty("操作地点 精确匹配")
    private String operLocation;

    @ApiModelProperty("请求参数 精确匹配")
    private String operParam;

    @ApiModelProperty("返回参数 精确匹配")
    private String jsonResult;

    @ApiModelProperty("操作状态（0正常 1异常） 精确匹配")
    private Integer status;

    @ApiModelProperty("错误消息 精确匹配")
    private String errorMsg;

    @ApiModelProperty("操作时间 精确匹配")
    private LocalDateTime operTime;

}

