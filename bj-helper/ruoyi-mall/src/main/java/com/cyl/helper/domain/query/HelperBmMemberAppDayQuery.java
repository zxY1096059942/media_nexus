package com.cyl.helper.domain.query;

import java.time.LocalDateTime;
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
public class HelperBmMemberAppDayQuery{
    @ApiModelProperty("RECORD_YEAR_MONTH 精确匹配")
    private Integer recordYearMonth;

    @ApiModelProperty("RECORD_DAY 精确匹配")
    private Integer recordDay;

    @ApiModelProperty("MEMBER_ID 精确匹配")
    private Long memberId;

    @ApiModelProperty("APP_ID 精确匹配")
    private Long appId;

    @ApiModelProperty("GOLD_COIN_NUM 精确匹配")
    private Integer goldCoinNum;

    @ApiModelProperty("RED_PACKET_AMOUNT 精确匹配")
    private Long redPacketAmount;

    @ApiModelProperty("CASH_OUT_AMOUNT 精确匹配")
    private Long cashOutAmount;

}
