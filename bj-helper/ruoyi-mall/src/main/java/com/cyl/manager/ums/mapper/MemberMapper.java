package com.cyl.manager.ums.mapper;

import java.util.List;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cyl.manager.ums.domain.entity.Member;

/**
 * 会员信息Mapper接口
 * 
 * @author zcc
 */
public interface MemberMapper extends BaseMapper<Member> {
    /**
     * *查询会员信息列表
     *
     * @param member 会员信息
     * @return 会员信息集合
     */
    List<Member> selectByEntity(Member member);
    
    /**
     * * 获取今天之前的会员账号数
     * @return
     */
    Integer getTotalBeforeNow();
    
    /**
     * * 获取昨天新增的会员账户数
     * @return
     */
    Integer getTotalNewYesterday();
}
