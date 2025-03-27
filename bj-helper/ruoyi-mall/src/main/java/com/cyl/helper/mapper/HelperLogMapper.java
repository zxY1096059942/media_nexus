package com.cyl.helper.mapper;


import java.util.List;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cyl.helper.domain.entity.HelperLog;
import org.apache.ibatis.annotations.Param;

/**
 * 上报日志Mapper接口
 *
 * @author zcc
 */
public interface HelperLogMapper extends BaseMapper<HelperLog> {
    /**
     * 查询上报日志列表
     *
     * @param helperLog 上报日志
     * @return 上报日志集合
     */
    List<HelperLog> selectByEntity(HelperLog helperLog);

    /**
     * 批量软删除
     * @param ids
     * @return
     */
    int updateDelFlagByIds(@Param("ids") Long[] ids);
}

