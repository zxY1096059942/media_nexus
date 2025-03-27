package com.cyl.helper.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cyl.helper.domain.entity.HelperBmMemberTaskDay;

/**
 * Mapper接口
 * 
 * @author lcy
 */
public interface HelperBmMemberTaskDayMapper extends BaseMapper<HelperBmMemberTaskDay> {
    /**
     * *查询列表
     *
     * @param helperBmMemberTaskDay 
     * @return 集合
     */
    List<HelperBmMemberTaskDay> selectByEntity(HelperBmMemberTaskDay helperBmMemberTaskDay);

    /**
     * *批量软删除
     * @param ids
     * @return
    */
    int deleteByIds(@Param("ids") Long[] ids);
    
    
    /**
     * *批量插入数据
     * @param helperBmMemberTaskDayList
     * @return
     */
    Integer inserthelperBmMemberTaskDays(@Param("helperBmMemberTaskDayList")  List<HelperBmMemberTaskDay> helperBmMemberTaskDayList);
    
    
    /**
     * *删除指定日期的数据
     * @param yearMonthDay
     * @return
     */
    int deleteByYearMonthDay(@Param("yearMonthDay") Integer yearMonthDay);

}
