package com.cyl.helper.convert;


import com.cyl.helper.domain.dto.HelperLogDTO;
import com.cyl.helper.domain.entity.HelperLog;
import com.cyl.helper.domain.vo.HelperLogVO;
import org.mapstruct.Mapper;
import java.util.List;
/**
 * 上报日志  DO <=> DTO <=> VO / BO / Query
 *
 * @author zcc
 */
@Mapper(componentModel = "spring")
public interface HelperLogConvert  {

    /**
     * @param source DO
     * @return DTO
     */
    HelperLogDTO do2dto(HelperLog source);

    /**
     * @param source DTO
     * @return DO
     */
    HelperLog dto2do(HelperLogDTO source);

    List<HelperLogVO> dos2vos(List<HelperLog> list);
}
