package com.cyl.helper.domain.dto;


import java.time.LocalDateTime;
import lombok.Data;
/**
 * 上报日志 DTO 对象
 *
 * @author zcc
 */
@Data
public class HelperLogDTO {
    private Long operId;
    private String title;
    private Integer businessType;
    private String method;
    private String requestMethod;
    private Integer operatorType;
    private String operName;
    private String deptName;
    private String operUrl;
    private String operIp;
    private String operLocation;
    private String operParam;
    private String jsonResult;
    private Integer status;
    private String errorMsg;
    private LocalDateTime operTime;
}
