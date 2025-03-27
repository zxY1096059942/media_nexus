package com.cyl.helper.mapper;


import java.util.List;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cyl.helper.domain.entity.HelperApp;
import org.apache.ibatis.annotations.Param;

/**
 * APP软件管理Mapper接口
 *
 * @author whb
 */
public interface HelperAppMapper extends BaseMapper<HelperApp> {
    /**
     * *查询APP软件管理列表
     *
     * @param helperApp APP软件管理
     * @return APP软件管理集合
     */
    List<HelperApp> selectByEntity(HelperApp helperApp);

    /**
     * *批量软删除
     * @param ids
     * @return
     */
    int updateDelFlagByIds(@Param("ids") Long[] ids);
    
    /**
     * * 获取今天之前的App 数
     * @return
     */
    Integer getTotalBeforeNow();
    
    /**
     * * 获取昨天新增的App 数
     * @return
     */
    Integer getTotalNewYesterday();
}
