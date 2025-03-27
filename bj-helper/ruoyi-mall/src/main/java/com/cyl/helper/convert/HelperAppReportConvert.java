package com.cyl.helper.convert;

import java.util.List;

import org.mapstruct.Mapper;

import com.cyl.helper.domain.dto.HelperAppReportDTO;
import com.cyl.helper.domain.entity.HelperAppReport;
import com.cyl.helper.domain.vo.HelperAppReportVO;
@Mapper(componentModel = "spring")
public interface HelperAppReportConvert  {

    /**
     * @param source DO
     * @return DTO
     */
    HelperAppReportDTO do2dto(HelperAppReport source);

    /**
     * @param source DTO
     * @return DO
     */
    HelperAppReport dto2do(HelperAppReportDTO source);

    List<HelperAppReportVO> dos2vos(List<HelperAppReport> list);
//    
}
