package com.cyl.helper.domain.dto;

import java.time.LocalDateTime;
import lombok.Data;
/**
 * 【请填写功能名称】 DTO 对象
 *
 * @author zcc
 */
@Data
public class HelperBmMemberDayDTO {
    private Long id;
    private Integer recordYearMonth;
    private Integer recordDay;
    private Integer memberTotalNum;
    private Integer memberNewNum;
    private Integer memberActiveNum;
    private Integer memberAnomaliesNum;
    private LocalDateTime updateTime;
    private LocalDateTime createTime;
}
