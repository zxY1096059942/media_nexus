package com.cyl.helper.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cyl.helper.domain.entity.HelperApp;
import com.cyl.helper.domain.entity.HelperAppMember;
import com.cyl.helper.domain.query.HelperAppMemberQuery;
import com.cyl.helper.domain.query.HelperAppQuery;
import com.cyl.helper.domain.vo.HelperAppMemberVO;
import com.cyl.helper.mapper.HelperAppMapper;
import com.cyl.helper.mapper.HelperAppMemberMapper;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

/**
 * APP软件管理Service业务层处理
 *
 *
 * @author whb
 */
@Service
public class HelperAppService {
    @Autowired
    private HelperAppMapper helperAppMapper;

    @Autowired
    private HelperAppMemberMapper helperAppMemberMapper;

    /**
     * 查询APP软件管理
     *
     * @param id APP软件管理主键
     * @return APP软件管理
     */
    public HelperApp selectById(Long id) {
        return helperAppMapper.selectById(id);
    }

    /**
     * 查询APP软件管理列表
     *
     * @param query 查询条件
     * @param page 分页条件
     * @return APP软件管理
     */
    public List<HelperApp> selectList(HelperAppQuery query, Pageable page) {
        if (page != null) {
            PageHelper.startPage(page.getPageNumber() + 1, page.getPageSize());
        }
        QueryWrapper<HelperApp> qw = new QueryWrapper<>();
        qw.eq("del_flag",0);
        String appNameLike = query.getAppNameLike();
        if (!StringUtils.isEmpty(appNameLike)) {
            qw.like("app_name", appNameLike);
        }
        String appPageNameLike = query.getAppPageNameLike();
        if (!StringUtils.isEmpty(appPageNameLike)) {
            qw.like("app_page_name", appPageNameLike);
        }
        String status = query.getStatus();
        if (!StringUtils.isEmpty(status)) {
            qw.eq("status", status);
        }
        return helperAppMapper.selectList(qw);
    }

    /**
     * 新增APP软件管理
     *
     * @param helperApp APP软件管理
     * @return 结果
     */
    public int insert(HelperApp helperApp) {
        helperApp.setDelFlag("0");
        helperApp.setCreateTime(LocalDateTime.now());
        return helperAppMapper.insert(helperApp);
    }

    /**
     * 修改APP软件管理
     *
     * @param helperApp APP软件管理
     * @return 结果
     */
    public int update(HelperApp helperApp) {
        return helperAppMapper.updateById(helperApp);
    }

    /**
     * 批量删除APP软件管理
     *
     * @param ids 需要删除的APP软件管理主键
     * @return 结果
     */
    public int deleteByIds(Long[] ids) {
        return helperAppMapper.updateDelFlagByIds(ids);
    }

    /**
     * 删除APP软件管理信息
     *
     * @param id APP软件管理主键
     * @return 结果
     */
    public int deleteById(Long id) {
        Long[] ids = {id};
        return helperAppMapper.updateDelFlagByIds(ids);
    }

    public List<HelperAppMemberVO> getUserByListHelperApp(Long id) {
        HelperAppMemberQuery query = new HelperAppMemberQuery();
        query.setMemberId(id);
        return helperAppMemberMapper.selectByMemberList(query);
    }

    public boolean updateUserHelperAppStatus(Long id) {
        // 获取 运行状态的任务 -> 处理缺省任务
        QueryWrapper<HelperAppMember> queryWrapper = new QueryWrapper<HelperAppMember>();
        queryWrapper.eq("run_status", 0);
        queryWrapper.eq("member_id", id);
        List<HelperAppMember> helperAppMembers = helperAppMemberMapper.selectList(queryWrapper);
        if(null == helperAppMembers){
            return false;
        }

        for(HelperAppMember helperAppMember : helperAppMembers){
            // 获取 首次运行日期
            LocalDateTime firstRunTime = helperAppMember.getFirstRunTime();
            if(null != firstRunTime){
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime targetDateTime = firstRunTime.plusDays(6);
                if(now.isAfter(targetDateTime)){
                    //把 当前日期 > 首次运行日期 的任务，改成暂停
                    helperAppMember.setStatus("1");
                    helperAppMemberMapper.updateById(helperAppMember);

                    // 查询子任务
                    Long subTaskId = helperAppMember.getSubTaskId();
                    HelperAppMember subTask = helperAppMemberMapper.selectById(subTaskId);

                    // 更新子任务的，首次运行日期，为 20 年以后
                    subTask.setFirstRunTime(now.plusYears(20));
                    // 更新子任务的状态
                    subTask.setRunStatus("0");
                }
            } else {
                // 如果，运行状态的任务，首次运行日期 为null，则设置初始值为，当前日期
                helperAppMember.setFirstRunTime(LocalDateTime.now());
                helperAppMemberMapper.updateById(helperAppMember);
            }
        }

        return true;
    }



}

