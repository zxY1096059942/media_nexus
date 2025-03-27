package com.cyl.manager.statistics.domain.vo;

import lombok.Data;

/**
 * @author lcy
 * @date 2024-10-16
 */
@Data
public class MemberStatusStatisticsVO {

    private Integer status;
    //总账户数
    private Long totalNum;
}
