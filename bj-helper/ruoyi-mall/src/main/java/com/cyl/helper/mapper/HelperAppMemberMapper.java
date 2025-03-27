package com.cyl.helper.mapper;


import java.util.List;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cyl.helper.domain.entity.HelperAppMember;
import com.cyl.helper.domain.form.HelperAppMemberForm;
import com.cyl.helper.domain.query.HelperAppMemberQuery;
import com.cyl.helper.domain.vo.HelperAppMemberVO;
import org.apache.ibatis.annotations.Param;

/**
 * app助手-app与账户关系表Mapper接口
 *
 * @author zcc
 */
public interface HelperAppMemberMapper extends BaseMapper<HelperAppMember> {
    /**
     * 查询app助手-app与账户关系表列表
     *
     * @param helperAppMember app助手-app与账户关系表
     * @return app助手-app与账户关系表集合
     */
    List<HelperAppMember> selectByEntity(HelperAppMember helperAppMember);

    /**
     * 批量软删除
     * @param ids
     * @return
     */
    int updateDelFlagByIds(@Param("ids") Long[] ids);

    int batchDeleteByIds(@Param("ids") Long[] ids);

    int batchDeleteByMemberId(@Param("appIds") Long[] ids,@Param("memberId") Long memberId);
    

    List<HelperAppMemberVO> selectByMemberList(HelperAppMemberQuery query);

    int bacthInsert(List<HelperAppMemberForm> helperAppMemberForm);
}
