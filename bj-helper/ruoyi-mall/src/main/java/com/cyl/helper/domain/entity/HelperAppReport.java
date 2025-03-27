package com.cyl.helper.domain.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseAudit;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
/**
 * 【请填写功能名称】对象 helper_app_report
 * 
 * @author lcy
 */
@ApiModel(description="【请填写功能名称】对象")
@Data
@TableName("helper_app_report")
public class HelperAppReport extends BaseAudit {
    private static final long serialVersionUID = 1L;

    @ApiModelProperty("ID")
    private Long id;

    @ApiModelProperty("TYPE")
    @Excel(name = "TYPE")
    private String type;

    @ApiModelProperty("CODE")
    @Excel(name = "CODE")
    private String code;

    @ApiModelProperty("上报数据内容")
    @Excel(name = "上报数据内容")
    private String reportData;

    @ApiModelProperty("数据生成时间")
    @Excel(name = "数据生成时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dataTime;

    @ApiModelProperty("部门状态（0正常 1停用）")
    @Excel(name = "部门状态", readConverterExp = "0=正常,1=停用")
    private String status;

    @ApiModelProperty("删除标志（0代表存在 2代表删除）")
    private String delFlag;

    @ApiModelProperty("账号ID")
    @Excel(name = "账号ID")
    private Long memberId;

    @ApiModelProperty("设备ID")
    @Excel(name = "设备ID")
    private String deviceid;

    @ApiModelProperty("显示顺序")
    @Excel(name = "显示顺序")
    private Integer orderNum;

    @ApiModelProperty("部门id")
    @Excel(name = "部门id")
    private Long deptId;
    /** 处理状态 */
    @Excel(name = "处理状态")
    private Integer handleStatus;    
    
    @TableField(exist = false)
    private List<String> codes;
}
