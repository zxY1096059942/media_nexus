package com.cyl.helper.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cyl.helper.domain.entity.HelperBmMemberAppDay;
import com.cyl.helper.domain.query.HelperBmMemberAppDayQuery;
import com.cyl.helper.mapper.HelperBmMemberAppDayMapper;
import com.github.pagehelper.PageHelper;

/**
 * 【请填写功能名称】Service业务层处理
 *
 *
 * @author zcc
 */
@Service
public class HelperBmMemberAppDayService {
    @Autowired
    private HelperBmMemberAppDayMapper helperBmMemberAppDayMapper;

    /**
     * 查询【请填写功能名称】
     *
     * @param id 【请填写功能名称】主键
     * @return 【请填写功能名称】
     */
    public HelperBmMemberAppDay selectById(Long id) {
        return helperBmMemberAppDayMapper.selectById(id);
    }

    /**
     * 查询【请填写功能名称】列表
     *
     * @param query 查询条件
     * @param page 分页条件
     * @return 【请填写功能名称】
     */
    public List<HelperBmMemberAppDay> selectList(HelperBmMemberAppDayQuery query, Pageable page) {
        if (page != null) {
            PageHelper.startPage(page.getPageNumber() + 1, page.getPageSize());
        }
        QueryWrapper<HelperBmMemberAppDay> qw = new QueryWrapper<>();
        
        Integer recordYearMonth = query.getRecordYearMonth();
        if (recordYearMonth != null) {
            qw.eq("record_year_month", recordYearMonth);
        }
        Integer recordDay = query.getRecordDay();
        if (recordDay != null) {
            qw.eq("record_day", recordDay);
        }
        Long memberId = query.getMemberId();
        if (memberId != null) {
            qw.eq("member_id", memberId);
        }
        Long appId = query.getAppId();
        if (appId != null) {
            qw.eq("app_id", appId);
        }
        Integer goldCoinNum = query.getGoldCoinNum();
        if (goldCoinNum != null) {
            qw.eq("gold_coin_num", goldCoinNum);
        }
        Long redPacketAmount = query.getRedPacketAmount();
        if (redPacketAmount != null) {
            qw.eq("red_packet_amount", redPacketAmount);
        }
        Long cashOutAmount = query.getCashOutAmount();
        if (cashOutAmount != null) {
            qw.eq("cash_out_amount", cashOutAmount);
        }
        qw.orderByDesc("record_year_month");
        return helperBmMemberAppDayMapper.selectList(qw);
    }

    /**
     * 新增【请填写功能名称】
     *
     * @param helperBmMemberAppDay 【请填写功能名称】
     * @return 结果
     */
    public int insert(HelperBmMemberAppDay helperBmMemberAppDay) {
//        helperBmMemberAppDay.setDelFlag(0);
        helperBmMemberAppDay.setCreateTime(LocalDateTime.now());
        return helperBmMemberAppDayMapper.insert(helperBmMemberAppDay);
    }

    /**
     * 修改【请填写功能名称】
     *
     * @param helperBmMemberAppDay 【请填写功能名称】
     * @return 结果
     */
    public int update(HelperBmMemberAppDay helperBmMemberAppDay) {
        return helperBmMemberAppDayMapper.updateById(helperBmMemberAppDay);
    }

    /**
     * 批量删除【请填写功能名称】
     *
     * @param ids 需要删除的【请填写功能名称】主键
     * @return 结果
     */
    public int deleteByIds(Long[] ids) {
        return helperBmMemberAppDayMapper.updateDelFlagByIds(ids);
    }

    /**
     * 删除【请填写功能名称】信息
     *
     * @param id 【请填写功能名称】主键
     * @return 结果
     */
    public int deleteById(Long id) {
        Long[] ids = {id};
        return helperBmMemberAppDayMapper.updateDelFlagByIds(ids);
    }
}
