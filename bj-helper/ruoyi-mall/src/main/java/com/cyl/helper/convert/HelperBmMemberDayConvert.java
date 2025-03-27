package com.cyl.helper.convert;

import java.util.List;

import org.mapstruct.Mapper;

import com.cyl.helper.domain.dto.HelperBmMemberDayDTO;
import com.cyl.helper.domain.entity.HelperBmMemberDay;
import com.cyl.helper.domain.vo.HelperBmMemberDayVO;
/**
 * 【请填写功能名称】  DO <=> DTO <=> VO / BO / Query
 *
 * @author lcy
 */
@Mapper(componentModel = "spring")
public interface HelperBmMemberDayConvert  {

    /**
     * @param source DO
     * @return DTO
     */
    HelperBmMemberDayDTO do2dto(HelperBmMemberDay source);

    /**
     * @param source DTO
     * @return DO
     */
    HelperBmMemberDay dto2do(HelperBmMemberDayDTO source);

    List<HelperBmMemberDayVO> dos2vos(List<HelperBmMemberDay> list);
}
