package com.cyl.helper.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cyl.helper.domain.entity.HelperAppReport;

/**
 * Mapper接口
 * 
 * @author lcy
 */
public interface HelperAppReportMapper extends BaseMapper<HelperAppReport> {
    /**
     * *查询列表
     *
     * @param helperAppReport 
     * @return 集合
     */
    List<HelperAppReport> selectByEntity(HelperAppReport helperAppReport);
    
    
    /**
     * *查询未处理的数据集合
     *
     * @param helperAppReport 
     * @return 集合
     */
    List<HelperAppReport> selectUnHandleReport(HelperAppReport helperAppReport);
    
    /**
     * *批量软删除
     * @param ids
     * @return
    */
    int updateDelFlagByIds(@Param("ids") Long[] ids);
    
    /**
     * *批量更新处理状态
     * @param ids
     * @return
    */
    int updateHandleFlagByIds(@Param("ids") List<Long> ids);
    
    
    /**
     * * 获取昨天活跃的App 账户数
     * @return
     */
    Integer getTotalActiveYesterday();
}
