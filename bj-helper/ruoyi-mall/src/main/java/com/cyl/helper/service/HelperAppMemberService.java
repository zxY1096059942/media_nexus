package com.cyl.helper.service;


import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cyl.app.MessageModel;
import com.cyl.app.MessageModelHelper;
import com.cyl.app.WebSocketServe;
import com.cyl.helper.domain.entity.HelperAppMember;
import com.cyl.helper.domain.entity.HelperLog;
import com.cyl.helper.domain.form.HelperAppMemberForm;
import com.cyl.helper.domain.query.HelperAppMemberListQuery;
import com.cyl.helper.domain.query.HelperAppMemberQuery;
import com.cyl.helper.domain.vo.HelperAppMemberVO;
import com.cyl.helper.mapper.HelperAppMemberMapper;
import com.cyl.manager.ums.domain.entity.Member;
import com.github.pagehelper.PageHelper;
import com.ruoyi.common.utils.AesCryptoUtils;
import com.ruoyi.common.utils.bean.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * app助手-app与账户关系表Service业务层处理
 *
 * @author zcc
 */
@Service
public class HelperAppMemberService {
    @Autowired
    private HelperAppMemberMapper helperAppMemberMapper;

    /**
     * 查询app助手-app与账户关系表
     *
     * @param id app助手-app与账户关系表主键
     * @return app助手-app与账户关系表
     */
    public HelperAppMember selectById(Long id) {
        return helperAppMemberMapper.selectById(id);
    }

    /**
     * 查询app助手-app与账户关系表列表
     *
     * @param query 查询条件
     * @param page  分页条件
     * @return app助手-app与账户关系表
     */
    public List<HelperAppMember> selectList(HelperAppMemberQuery query, Pageable page) {
        if (page != null) {
            PageHelper.startPage(page.getPageNumber() + 1, page.getPageSize());
        }
        QueryWrapper<HelperAppMember> qw = new QueryWrapper<>();
        qw.eq("del_flag", 0);
        Long appId = query.getAppId();
        if (appId != null) {
            qw.eq("app_id", appId);
        }
        Long memberId = query.getMemberId();
        if (memberId != null) {
            qw.eq("member_id", memberId);
        }

        return helperAppMemberMapper.selectList(qw);
    }

    /**
     * 新增app助手-app与账户关系表
     *
     * @param helperAppMember app助手-app与账户关系表
     * @return 结果
     */
    public int insert(HelperAppMember helperAppMember) {
        helperAppMember.setDelFlag("0");
        helperAppMember.setCreateTime(LocalDateTime.now());
        return helperAppMemberMapper.insert(helperAppMember);
    }

    /**
     * 修改app助手-app与账户关系表
     *
     * @param helperAppMember app助手-app与账户关系表
     * @return 结果
     */
    public int update(HelperAppMember helperAppMember) {
        return helperAppMemberMapper.updateById(helperAppMember);
    }

    /**
     * 批量删除app助手-app与账户关系表
     *
     * @param ids 需要删除的app助手-app与账户关系表主键
     * @return 结果
     */
    public int deleteByIds(Long[] ids) {
        return helperAppMemberMapper.batchDeleteByIds(ids);
    }

    public int batchDeleteByMemberId(Long[] appIds,Long memberId) {
        return helperAppMemberMapper.batchDeleteByMemberId(appIds,memberId);
    }
    /**
     * 删除app助手-app与账户关系表信息
     *
     * @param id app助手-app与账户关系表主键
     * @return 结果
     */
    public int deleteById(Long id) {
        Long[] ids = {id};
        return helperAppMemberMapper.updateDelFlagByIds(ids);
    }

    public List<HelperAppMemberVO> selectByMemberList(HelperAppMemberQuery query) {

        QueryWrapper<HelperAppMember> qw = new QueryWrapper<HelperAppMember>();
        qw.eq("member_id", query.getMemberId());
        return helperAppMemberMapper.selectByMemberList(query);
    }

    public List<HelperAppMember> selectByPageList(HelperAppMemberQuery query) {
        QueryWrapper<HelperAppMember> qw = new QueryWrapper<HelperAppMember>();
        qw.eq("member_id", query.getMemberId());
        qw.eq("run_status", "0");
        List<HelperAppMember> list = helperAppMemberMapper.selectList(qw);

        return list;
    }


    public int bacthInsert(List<HelperAppMemberForm> helperAppMemberForm) {
        return helperAppMemberMapper.bacthInsert(helperAppMemberForm);
    }

    public Integer bacthAddHelperApp(HelperAppMemberListQuery query) {
        List<HelperAppMemberForm> helperAppMemberFormList = new ArrayList<>();

        for (Long appId : query.getAppId()) {
            QueryWrapper<HelperAppMember> qw = new QueryWrapper<>();
            if (appId != null) {
                qw.eq("app_id", appId);
            }
            if (query.getMemberId() != null) {
                qw.eq("member_id", query.getMemberId());
            }

            List<HelperAppMember> amlist = helperAppMemberMapper.selectList(qw);
            if (CollUtil.isNotEmpty(amlist)) {
                continue;
            }
            HelperAppMemberForm helperAppMemberForm = new HelperAppMemberForm();
            helperAppMemberForm.setAppId(appId);
            helperAppMemberForm.setMemberId(query.getMemberId());
            helperAppMemberFormList.add(helperAppMemberForm);
        }
        if (CollUtil.isEmpty(helperAppMemberFormList)) {
            return 0;
        } else {
            //发送WebSocket消息
            /*MessageModel msgModel=new MessageModel();
            msgModel.setMemberId(memberId);
            msgModel.setMessage(message);
            msgModel.setMessageType(MessageModelHelper.MESSAGETYPE_INFO);
            WebSocketServe.sendMessage(msgModel, query.getMemberId());*/

            return helperAppMemberMapper.bacthInsert(helperAppMemberFormList);
        }
    }
}

