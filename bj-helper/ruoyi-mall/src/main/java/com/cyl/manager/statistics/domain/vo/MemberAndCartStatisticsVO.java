package com.cyl.manager.statistics.domain.vo;

import lombok.Data;

@Data
public class MemberAndCartStatisticsVO {
    private Integer memberCount;
    private Integer cartCount;
    
    private Integer appCount;
    
    private Integer onlineCount;

}
