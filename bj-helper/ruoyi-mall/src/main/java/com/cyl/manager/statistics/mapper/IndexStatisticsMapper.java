package com.cyl.manager.statistics.mapper;


import java.util.List;

import com.cyl.manager.statistics.domain.query.GoodsStatisticsQuery;
import com.cyl.manager.statistics.domain.query.OrderStatisticsQuery;
import com.cyl.manager.statistics.domain.vo.AppStatusStatisticsVO;
import com.cyl.manager.statistics.domain.vo.MemberStatisticsVO;
import com.cyl.manager.statistics.domain.vo.MemberStatusStatisticsVO;
import com.cyl.manager.statistics.domain.vo.OrderStatisticsVO;
import com.cyl.manager.statistics.domain.vo.ProductTopVO;

public interface IndexStatisticsMapper {
    List<ProductTopVO> goodsSkuStatistics(GoodsStatisticsQuery goodsStatisticsQuery);

    List<ProductTopVO> goodsStatistics(GoodsStatisticsQuery goodsStatisticsQuery);
    List<OrderStatisticsVO> orderStatistics(OrderStatisticsQuery param);
    
    List<MemberStatisticsVO> memberAccountStatistics(OrderStatisticsQuery param);

    List<MemberStatusStatisticsVO> memberStatusStatistics();
    
    List<AppStatusStatisticsVO> appStatusStatistics();
}
