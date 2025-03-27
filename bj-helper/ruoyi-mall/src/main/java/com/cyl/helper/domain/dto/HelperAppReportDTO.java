package com.cyl.helper.domain.dto;

import java.time.LocalDateTime;

import com.ruoyi.common.core.domain.BaseAudit;

import lombok.Data;
/**
 * 【请填写功能名称】 DTO 对象
 *
 * @author lcy
 */
@Data
public class HelperAppReportDTO extends BaseAudit {
    private Long id;
    private String type;
    private String code;
    private String reportData;
    private LocalDateTime dataTime;
    private String status;
    private Long memberid;
    private Long deviceid;
    private Integer orderNum;
    private Long deptId;
    /** 处理状态 */
    private Integer handleStatus;
}
