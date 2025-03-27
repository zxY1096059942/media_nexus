package com.cyl.helper.domain.entity;

import java.time.LocalDateTime;
import com.ruoyi.common.annotation.Excel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import com.baomidou.mybatisplus.annotation.TableName;
/**
 * 对象 helper_bm_member_app_day
 * 
 * @author lcy
 */
@ApiModel(description="对象")
@Data
@TableName("helper_bm_member_app_day")
public class HelperBmMemberAppDay {
    private static final long serialVersionUID = 1L;

    @ApiModelProperty("ID")
    private Long id;

    @ApiModelProperty("RECORD_YEAR_MONTH")
    @Excel(name = "RECORD_YEAR_MONTH")
    private Integer recordYearMonth;

    @ApiModelProperty("RECORD_DAY")
    @Excel(name = "RECORD_DAY")
    private Integer recordDay;

    @ApiModelProperty("MEMBER_ID")
    @Excel(name = "MEMBER_ID")
    private Long memberId;

    @ApiModelProperty("APP_ID")
    @Excel(name = "APP_ID")
    private Long appId;

    @ApiModelProperty("GOLD_COIN_NUM")
    @Excel(name = "GOLD_COIN_NUM")
    private Integer goldCoinNum;

    @ApiModelProperty("RED_PACKET_AMOUNT")
    @Excel(name = "RED_PACKET_AMOUNT")
    private Long redPacketAmount;

    @ApiModelProperty("CASH_OUT_AMOUNT")
    @Excel(name = "CASH_OUT_AMOUNT")
    private Long cashOutAmount;

    @ApiModelProperty("更新时间")
    private LocalDateTime updateTime;

    @ApiModelProperty("创建时间")
    private LocalDateTime createTime;

}
