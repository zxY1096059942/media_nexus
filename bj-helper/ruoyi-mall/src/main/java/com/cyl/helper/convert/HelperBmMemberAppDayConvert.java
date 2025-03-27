package com.cyl.helper.convert;

import java.util.List;

import org.mapstruct.Mapper;

import com.cyl.helper.domain.dto.HelperBmMemberAppDayDTO;
import com.cyl.helper.domain.entity.HelperBmMemberAppDay;
import com.cyl.helper.domain.vo.HelperBmMemberAppDayVO;
/**
 * 【请填写功能名称】  DO <=> DTO <=> VO / BO / Query
 *
 * @author lcy
 */
@Mapper(componentModel = "spring")
public interface HelperBmMemberAppDayConvert  {

    /**
     * @param source DO
     * @return DTO
     */
    HelperBmMemberAppDayDTO do2dto(HelperBmMemberAppDay source);

    /**
     * @param source DTO
     * @return DO
     */
    HelperBmMemberAppDay dto2do(HelperBmMemberAppDayDTO source);

    List<HelperBmMemberAppDayVO> dos2vos(List<HelperBmMemberAppDay> list);
}
