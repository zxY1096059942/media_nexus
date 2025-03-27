package com.cyl.helper.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cyl.helper.domain.entity.HelperBmMemberAppDay;

/**
 * Mapper接口
 * 
 * @author lcy
 */
public interface HelperBmMemberAppDayMapper extends BaseMapper<HelperBmMemberAppDay> {
    /**
     * *查询列表
     *
     * @param helperBmMemberAppDay 
     * @return 集合
     */
    List<HelperBmMemberAppDay> selectByEntity(HelperBmMemberAppDay helperBmMemberAppDay);

    /**
     * *批量软删除
     * @param ids
     * @return
    */
    int updateDelFlagByIds(@Param("ids") Long[] ids);
    
    
    /**
     * *批量插入数据
     * @param helperBmMemberAppDayList
     * @return
     */
    Integer insertHelperBmMemberAppDays(@Param("helperBmMemberAppDayList")  List<HelperBmMemberAppDay> helperBmMemberAppDayList);
    
    
    /**
     * @param date
     * @return
     */
    Integer insertMemberAppDaysForDate(@Param("date") Integer date);
    
    /**
     * *删除指定日期的数据
     * @param yearMonthDay
     * @return
     */
    int deleteByYearMonthDay(@Param("yearMonthDay") Integer yearMonthDay);
}
