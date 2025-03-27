package com.cyl.helper.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cyl.helper.domain.entity.HelperBmMemberAppDay;
import com.cyl.helper.domain.entity.HelperBmMemberDay;

/**
 * *Mapper接口
 * 
 * @author lcy
 */
public interface HelperBmMemberDayMapper extends BaseMapper<HelperBmMemberDay> {
    /**
     * *查询列表
     *
     * @param helperBmMemberDay 
     * @return 集合
     */
    List<HelperBmMemberDay> selectByEntity(HelperBmMemberDay helperBmMemberDay);

    /**
     * *批量软删除
     * @param ids
     * @return
    */
    int updateDelFlagByIds(@Param("ids") Long[] ids);
    
    
    
    /**
     * *删除指定日期的数据
     * @param yearMonthDay
     * @return
     */
    int deleteByYearMonthDay(@Param("yearMonthDay") Integer yearMonthDay);

       
    /**
     * *批量插入数据
     * @param helperBmMemberDayList
     * @return
     */
    Integer insertHelperBmMemberDays(@Param("helperBmMemberDayList")  List<HelperBmMemberDay> helperBmMemberDayList);
}
