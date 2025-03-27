package com.cyl.helper.domain.query;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 【请填写功能名称】 查询 对象
 *
 * @author lcy
 */
@ApiModel(description="【请填写功能名称】 查询 对象")
@Data
public class HelperBmMemberDayQuery{
    @ApiModelProperty("RECORD_YEAR_MONTH 精确匹配")
    private Integer recordYearMonth;

    @ApiModelProperty("RECORD_DAY 精确匹配")
    private Integer recordDay;

    @ApiModelProperty("MEMBER_TOTAL_NUM 精确匹配")
    private Integer memberTotalNum;

    @ApiModelProperty("MEMBER_NEW_NUM 精确匹配")
    private Integer memberNewNum;

    @ApiModelProperty("MEMBER_ACTIVE_NUM 精确匹配")
    private Integer memberActiveNum;

    @ApiModelProperty("MEMBER_ANOMALIES_NUM 精确匹配")
    private Integer memberAnomaliesNum;

}
