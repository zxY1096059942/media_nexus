package com.cyl.helper.domain.dto;

import java.time.LocalDateTime;
import lombok.Data;
/**
 * 【请填写功能名称】 DTO 对象
 *
 * @author zcc
 */
@Data
public class HelperBmMemberAppDayDTO {
    private Long id;
    private Integer recordYearMonth;
    private Integer recordDay;
    private Long memberId;
    private Long appId;
    private Integer goldCoinNum;
    private Long redPacketAmount;
    private Long cashOutAmount;
    private LocalDateTime updateTime;
    private LocalDateTime createTime;
}
