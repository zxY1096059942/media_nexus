package com.cyl.helper.convert;

import com.cyl.helper.domain.dto.HelperAppMemberDTO;
import com.cyl.helper.domain.entity.HelperAppMember;
import com.cyl.helper.domain.vo.HelperAppMemberVO;
import org.mapstruct.Mapper;

import java.util.List;
/**
 * app助手-app与账户关系表  DO <=> DTO <=> VO / BO / Query
 *
 * @author zcc
 */
@Mapper(componentModel = "spring")
public interface HelperAppMemberConvert  {

    /**
     * @param source DO
     * @return DTO
     */
    HelperAppMemberDTO do2dto(HelperAppMember source);

    /**
     * @param source DTO
     * @return DO
     */
    HelperAppMember dto2do(HelperAppMemberDTO source);

    List<HelperAppMemberVO> dos2vos(List<HelperAppMember> list);
}

