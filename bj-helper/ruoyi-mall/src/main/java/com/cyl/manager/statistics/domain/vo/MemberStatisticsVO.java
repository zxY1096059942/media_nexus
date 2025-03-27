package com.cyl.manager.statistics.domain.vo;

import lombok.Data;

/**
 * @author lcy
 * @date 2024-10-16
 */
@Data
public class MemberStatisticsVO {

    private String date;
    //新增账户数
    private Long newNum;
    //活跃账户数
    private Long activeNum;
    //异常账户数
    private Long anomaliesNum;
    //总账户数
    private Long totalNum;
}
