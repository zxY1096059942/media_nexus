package com.cyl.helper.domain.entity;

import java.time.LocalDateTime;
import com.ruoyi.common.annotation.Excel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import com.baomidou.mybatisplus.annotation.TableName;
/**
 * 【请填写功能名称】对象 helper_bm_member_day
 * 
 * @author lcy
 */
@ApiModel(description="【请填写功能名称】对象")
@Data
@TableName("helper_bm_member_day")
public class HelperBmMemberDay {
    private static final long serialVersionUID = 1L;

    @ApiModelProperty("ID")
    private Long id;

    @ApiModelProperty("RECORD_YEAR_MONTH")
    @Excel(name = "RECORD_YEAR_MONTH")
    private Integer recordYearMonth;

    @ApiModelProperty("RECORD_DAY")
    @Excel(name = "RECORD_DAY")
    private Integer recordDay;

    @ApiModelProperty("MEMBER_TOTAL_NUM")
    @Excel(name = "MEMBER_TOTAL_NUM")
    private Integer memberTotalNum;

    @ApiModelProperty("MEMBER_NEW_NUM")
    @Excel(name = "MEMBER_NEW_NUM")
    private Integer memberNewNum;

    @ApiModelProperty("MEMBER_ACTIVE_NUM")
    @Excel(name = "MEMBER_ACTIVE_NUM")
    private Integer memberActiveNum;

    @ApiModelProperty("MEMBER_ANOMALIES_NUM")
    @Excel(name = "MEMBER_ANOMALIES_NUM")
    private Integer memberAnomaliesNum;

    @ApiModelProperty("更新时间")
    private LocalDateTime updateTime;

    @ApiModelProperty("创建时间")
    private LocalDateTime createTime;

}
