package com.cyl.helper.domain.vo;

import java.time.LocalDateTime;
import com.ruoyi.common.annotation.Excel;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
/**
 * 【请填写功能名称】 数据视图对象
 * 
 * @author lcy
 */
@Data
public class HelperBmMemberAppDayVO  {
   /** ID */
    private Long id;
   /** RECORD_YEAR_MONTH */
    @Excel(name = "RECORD_YEAR_MONTH")
    private Integer recordYearMonth;
   /** RECORD_DAY */
    @Excel(name = "RECORD_DAY")
    private Integer recordDay;
   /** MEMBER_ID */
    @Excel(name = "MEMBER_ID")
    private Long memberId;
   /** APP_ID */
    @Excel(name = "APP_ID")
    private Long appId;
   /** GOLD_COIN_NUM */
    @Excel(name = "GOLD_COIN_NUM")
    private Integer goldCoinNum;
   /** RED_PACKET_AMOUNT */
    @Excel(name = "RED_PACKET_AMOUNT")
    private Long redPacketAmount;
   /** CASH_OUT_AMOUNT */
    @Excel(name = "CASH_OUT_AMOUNT")
    private Long cashOutAmount;
   /** 更新时间 */
    private LocalDateTime updateTime;
   /** 创建时间 */
    private LocalDateTime createTime;
}
