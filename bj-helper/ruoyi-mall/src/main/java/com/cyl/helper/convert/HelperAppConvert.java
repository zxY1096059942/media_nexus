package com.cyl.helper.convert;


import com.cyl.helper.domain.dto.HelperAppDTO;
import com.cyl.helper.domain.entity.HelperApp;
import com.cyl.helper.domain.vo.HelperAppVO;
import org.mapstruct.Mapper;
import java.util.List;
/**
 * APP软件管理  DO <=> DTO <=> VO / BO / Query
 *
 * @author whb
 */
@Mapper(componentModel = "spring")
public interface HelperAppConvert  {

    /**
     * @param source DO
     * @return DTO
     */
    HelperAppDTO do2dto(HelperApp source);

    /**
     * @param source DTO
     * @return DO
     */
    HelperApp dto2do(HelperAppDTO source);

    List<HelperAppVO> dos2vos(List<HelperApp> list);
}

