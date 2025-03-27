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
public class HelperBmMemberDayVO  {
   /** ID */
    private Long id;
   /** RECORD_YEAR_MONTH */
    @Excel(name = "RECORD_YEAR_MONTH")
    private Integer recordYearMonth;
   /** RECORD_DAY */
    @Excel(name = "RECORD_DAY")
    private Integer recordDay;
   /** MEMBER_TOTAL_NUM */
    @Excel(name = "MEMBER_TOTAL_NUM")
    private Integer memberTotalNum;
   /** MEMBER_NEW_NUM */
    @Excel(name = "MEMBER_NEW_NUM")
    private Integer memberNewNum;
   /** MEMBER_ACTIVE_NUM */
    @Excel(name = "MEMBER_ACTIVE_NUM")
    private Integer memberActiveNum;
   /** MEMBER_ANOMALIES_NUM */
    @Excel(name = "MEMBER_ANOMALIES_NUM")
    private Integer memberAnomaliesNum;
   /** 更新时间 */
    private LocalDateTime updateTime;
   /** 创建时间 */
    private LocalDateTime createTime;
}
