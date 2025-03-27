package com.cyl.helper.service;


import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.time.LocalDateTime;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cyl.helper.domain.entity.HelperLog;
import com.cyl.helper.domain.query.HelperLogQuery;
import com.cyl.helper.mapper.HelperLogMapper;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

/**
 * 上报日志Service业务层处理
 *
 *
 * @author zcc
 */
@Service
public class HelperLogService {
    @Autowired
    private HelperLogMapper helperLogMapper;

    /**
     * 查询上报日志
     *
     * @param operId 上报日志主键
     * @return 上报日志
     */
    public HelperLog selectByOperId(Long operId) {
        return helperLogMapper.selectById(operId);
    }

    /**
     * 查询上报日志列表
     *
     * @param query 查询条件
     * @param page 分页条件
     * @return 上报日志
     */
    public List<HelperLog> selectList(HelperLogQuery query, Pageable page) {
        if (page != null) {
            PageHelper.startPage(page.getPageNumber() + 1, page.getPageSize());
        }
        QueryWrapper<HelperLog> qw = new QueryWrapper<>();
        String title = query.getTitle();
        if (!StringUtils.isEmpty(title)) {
            qw.eq("title", title);
        }
        Integer businessType = query.getBusinessType();
        if (businessType != null) {
            qw.eq("business_type", businessType);
        }
        String method = query.getMethod();
        if (!StringUtils.isEmpty(method)) {
            qw.eq("method", method);
        }
        String requestMethod = query.getRequestMethod();
        if (!StringUtils.isEmpty(requestMethod)) {
            qw.eq("request_method", requestMethod);
        }
        Integer operatorType = query.getOperatorType();
        if (operatorType != null) {
            qw.eq("operator_type", operatorType);
        }
        String operNameLike = query.getOperNameLike();
        if (!StringUtils.isEmpty(operNameLike)) {
            qw.like("oper_name", operNameLike);
        }
        String deptNameLike = query.getDeptNameLike();
        if (!StringUtils.isEmpty(deptNameLike)) {
            qw.like("dept_name", deptNameLike);
        }
        String operUrl = query.getOperUrl();
        if (!StringUtils.isEmpty(operUrl)) {
            qw.eq("oper_url", operUrl);
        }
        String operIp = query.getOperIp();
        if (!StringUtils.isEmpty(operIp)) {
            qw.eq("oper_ip", operIp);
        }
        String operLocation = query.getOperLocation();
        if (!StringUtils.isEmpty(operLocation)) {
            qw.eq("oper_location", operLocation);
        }
        String operParam = query.getOperParam();
        if (!StringUtils.isEmpty(operParam)) {
            qw.eq("oper_param", operParam);
        }
        String jsonResult = query.getJsonResult();
        if (!StringUtils.isEmpty(jsonResult)) {
            qw.eq("json_result", jsonResult);
        }
        Integer status = query.getStatus();
        if (status != null) {
            qw.eq("status", status);
        }
        String errorMsg = query.getErrorMsg();
        if (!StringUtils.isEmpty(errorMsg)) {
            qw.eq("error_msg", errorMsg);
        }
        LocalDateTime operTime = query.getOperTime();
        if (operTime != null) {
            qw.eq("oper_time", operTime);
        }
        qw.orderByDesc("oper_time");
        return helperLogMapper.selectList(qw);
    }

    /**
     * 新增上报日志
     *
     * @param helperLog 上报日志
     * @return 结果
     */
    public int insert(HelperLog helperLog) {
        return helperLogMapper.insert(helperLog);
    }

    /**
     * 修改上报日志
     *
     * @param helperLog 上报日志
     * @return 结果
     */
    public int update(HelperLog helperLog) {
        return helperLogMapper.updateById(helperLog);
    }

    /**
     * 批量删除上报日志
     *
     * @param operIds 需要删除的上报日志主键
     * @return 结果
     */
    public int deleteByOperIds(Long[] operIds) {
        return helperLogMapper.updateDelFlagByIds(operIds);
    }

    /**
     * 删除上报日志信息
     *
     * @param operId 上报日志主键
     * @return 结果
     */
    public int deleteByOperId(Long operId) {
        Long[] operIds = {operId};
        return helperLogMapper.updateDelFlagByIds(operIds);
    }
}

