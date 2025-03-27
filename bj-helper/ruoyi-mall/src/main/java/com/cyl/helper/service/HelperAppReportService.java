package com.cyl.helper.service;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cyl.helper.domain.entity.HelperAppReport;
import com.cyl.helper.domain.query.HelperAppReportQuery;
import com.cyl.helper.mapper.HelperAppReportMapper;
import com.github.pagehelper.PageHelper;

/**
 * 【请填写功能名称】Service业务层处理
 *
 *
 * @author zcc
 */
@Service
public class HelperAppReportService {
	
    @Autowired
    private HelperAppReportMapper helperAppReportMapper;

    /**
     * 查询【请填写功能名称】
     *
     * @param id 【请填写功能名称】主键
     * @return 【请填写功能名称】
     */
    public HelperAppReport selectById(Long id) {
        return helperAppReportMapper.selectById(id);
    }

    /**
     * 查询【请填写功能名称】列表
     *
     * @param query 查询条件
     * @param page 分页条件
     * @return 【请填写功能名称】
     */
    
    public List<HelperAppReport> selectList(HelperAppReportQuery query, Pageable page) {
        if (page != null) {
            PageHelper.startPage(page.getPageNumber() + 1, page.getPageSize());
        }
        QueryWrapper<HelperAppReport> qw = new QueryWrapper<>();
        qw.eq("del_flag",0);
        String type = query.getType();
        if (!StringUtils.isEmpty(type)) {
            qw.eq("type", type);
        }
        String code = query.getCode();
        if (!StringUtils.isEmpty(code)) {
            qw.eq("code", code);
        }
        String reportData = query.getReportData();
        if (!StringUtils.isEmpty(reportData)) {
            qw.eq("report_data", reportData);
        }
        LocalDateTime dataTime = query.getDataTime();
        if (dataTime != null) {
            qw.eq("data_time", dataTime);
        }
        String status = query.getStatus();
        if (!StringUtils.isEmpty(status)) {
            qw.eq("status", status);
        }
        Long memberid = query.getMemberid();
        if (memberid != null) {
            qw.eq("memberId", memberid);
        }
        Long deviceid = query.getDeviceid();
        if (deviceid != null) {
            qw.eq("deviceId", deviceid);
        }
        Integer orderNum = query.getOrderNum();
        if (orderNum != null) {
            qw.eq("order_num", orderNum);
        }
        Long deptId = query.getDeptId();
        if (deptId != null) {
            qw.eq("dept_id", deptId);
        }
        qw.orderByDesc("create_time");
        return helperAppReportMapper.selectList(qw);
    }

    /**
     * 新增【请填写功能名称】
     *
     * @param helperAppReport 【请填写功能名称】
     * @return 结果
     */
    public int insert(HelperAppReport helperAppReport) {
//        helperAppReport.setDelFlag(0);
        helperAppReport.setCreateTime(LocalDateTime.now());
        return helperAppReportMapper.insert(helperAppReport);
    }

    /**
     * 修改【请填写功能名称】
     *
     * @param helperAppReport 【请填写功能名称】
     * @return 结果
     */
    public int update(HelperAppReport helperAppReport) {
        return helperAppReportMapper.updateById(helperAppReport);
    }

    /**
     * 批量删除【请填写功能名称】
     *
     * @param ids 需要删除的【请填写功能名称】主键
     * @return 结果
     */
    public int deleteByIds(Long[] ids) {
        return helperAppReportMapper.updateDelFlagByIds(ids);
    }

    /**
     * 删除【请填写功能名称】信息
     *
     * @param id 【请填写功能名称】主键
     * @return 结果
     */
    public int deleteById(Long id) {
        Long[] ids = {id};
        return helperAppReportMapper.updateDelFlagByIds(ids);
    }
}
