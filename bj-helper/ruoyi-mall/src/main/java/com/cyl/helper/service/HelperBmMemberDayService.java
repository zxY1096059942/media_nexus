package com.cyl.helper.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cyl.helper.domain.entity.HelperBmMemberDay;
import com.cyl.helper.domain.query.HelperBmMemberDayQuery;
import com.cyl.helper.mapper.HelperBmMemberDayMapper;
import com.github.pagehelper.PageHelper;


/**
 * 【请填写功能名称】Service业务层处理
 *
 *
 * @author zcc
 */
@Service
public class HelperBmMemberDayService {
    @Autowired
    private HelperBmMemberDayMapper helperBmMemberDayMapper;

    /**
     * 查询【请填写功能名称】
     *
     * @param id 【请填写功能名称】主键
     * @return 【请填写功能名称】
     */
    public HelperBmMemberDay selectById(Long id) {
        return helperBmMemberDayMapper.selectById(id);
    }

    /**
     * 查询【请填写功能名称】列表
     *
     * @param query 查询条件
     * @param page 分页条件
     * @return 【请填写功能名称】
     */
    public List<HelperBmMemberDay> selectList(HelperBmMemberDayQuery query, Pageable page) {
        if (page != null) {
            PageHelper.startPage(page.getPageNumber() + 1, page.getPageSize());
        }
        QueryWrapper<HelperBmMemberDay> qw = new QueryWrapper<>();
        
        Integer recordYearMonth = query.getRecordYearMonth();
        if (recordYearMonth != null) {
            qw.eq("record_year_month", recordYearMonth);
        }
        Integer recordDay = query.getRecordDay();
        if (recordDay != null) {
            qw.eq("record_day", recordDay);
        }
        Integer memberTotalNum = query.getMemberTotalNum();
        if (memberTotalNum != null) {
            qw.eq("member_total_num", memberTotalNum);
        }
        Integer memberNewNum = query.getMemberNewNum();
        if (memberNewNum != null) {
            qw.eq("member_new_num", memberNewNum);
        }
        Integer memberActiveNum = query.getMemberActiveNum();
        if (memberActiveNum != null) {
            qw.eq("member_active_num", memberActiveNum);
        }
        Integer memberAnomaliesNum = query.getMemberAnomaliesNum();
        if (memberAnomaliesNum != null) {
            qw.eq("member_anomalies_num", memberAnomaliesNum);
        }
        qw.orderByDesc("record_year_month");
        return helperBmMemberDayMapper.selectList(qw);
    }

    /**
     * 新增【请填写功能名称】
     *
     * @param helperBmMemberDay 【请填写功能名称】
     * @return 结果
     */
    public int insert(HelperBmMemberDay helperBmMemberDay) {
//        helperBmMemberDay.setDelFlag(0);
        helperBmMemberDay.setCreateTime(LocalDateTime.now());
        return helperBmMemberDayMapper.insert(helperBmMemberDay);
    }

    /**
     * 修改【请填写功能名称】
     *
     * @param helperBmMemberDay 【请填写功能名称】
     * @return 结果
     */
    public int update(HelperBmMemberDay helperBmMemberDay) {
        return helperBmMemberDayMapper.updateById(helperBmMemberDay);
    }

    /**
     * 批量删除【请填写功能名称】
     *
     * @param ids 需要删除的【请填写功能名称】主键
     * @return 结果
     */
    public int deleteByIds(Long[] ids) {
        return helperBmMemberDayMapper.updateDelFlagByIds(ids);
    }

    /**
     * 删除【请填写功能名称】信息
     *
     * @param id 【请填写功能名称】主键
     * @return 结果
     */
    public int deleteById(Long id) {
        Long[] ids = {id};
        return helperBmMemberDayMapper.updateDelFlagByIds(ids);
    }
}
