package com.cyl.helper.domain.dto;


import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseAudit;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
/**
 * APP软件管理 DTO 对象
 *
 * @author whb
 */
@Data
public class HelperAppDTO extends BaseAudit {
    private Long id;
    private String appName;
    private String appPageName;
    private Integer taskTime;
    private String status;
    private Integer orderNum;
    private Long deptId;
    private String appJsPath;
    private String appApkUrl;

    private String displayFlag;
}
