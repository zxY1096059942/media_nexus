package com.cyl.helper.domain.query;

import java.time.LocalDateTime;

import com.ruoyi.common.annotation.Excel;

import lombok.Data;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * 【请填写功能名称】 查询 对象
 *
 * @author lcy
 */
@ApiModel(description="【请填写功能名称】 查询 对象")
@Data
public class HelperAppReportQuery{
    @ApiModelProperty("TYPE 精确匹配")
    private String type;

    @ApiModelProperty("CODE 精确匹配")
    private String code;

    @ApiModelProperty("上报数据内容 精确匹配")
    private String reportData;

    @ApiModelProperty("数据生成时间 精确匹配")
    private LocalDateTime dataTime;

    @ApiModelProperty("部门状态（0正常 1停用） 精确匹配")
    private String status;

    @ApiModelProperty("账号ID 精确匹配")
    private Long memberid;

    @ApiModelProperty("设备ID 精确匹配")
    private Long deviceid;

    @ApiModelProperty("显示顺序 精确匹配")
    private Integer orderNum;

    @ApiModelProperty("部门id 精确匹配")
    private Long deptId;

    /** 处理状态 */
    @ApiModelProperty("处理状态 精确匹配")
    private Integer handleStatus;
}
