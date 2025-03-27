package com.cyl.helper.domain.vo;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseAudit;

import lombok.Data;
/**
 * 【请填写功能名称】 数据视图对象
 * 
 * @author lcy
 */
@Data
public class HelperAppReportVO  extends BaseAudit {
   /** ID */
    private Long id;
   /** TYPE */
    @Excel(name = "TYPE")
    private String type;
   /** CODE */
    @Excel(name = "CODE")
    private String code;
   /** 上报数据内容 */
    @Excel(name = "上报数据内容")
    private String reportData;
   /** 数据生成时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Excel(name = "数据生成时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dataTime;
   /** 部门状态（0正常 1停用） */
    @Excel(name = "部门状态", readConverterExp = "0=正常,1=停用")
    private String status;
   /** 账号ID */
    @Excel(name = "账号ID")
    private Long memberId;
   /** 设备ID */
    @Excel(name = "设备ID")
    private String deviceid;
   /** 显示顺序 */
    @Excel(name = "显示顺序")
    private Integer orderNum;
   /** 部门id */
    @Excel(name = "部门id")
    private Long deptId;
    /** 处理状态 */
    @Excel(name = "处理状态")
    private Integer handleStatus;
}
