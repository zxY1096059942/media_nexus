package com.cyl.helper.domain.dto;


import com.ruoyi.common.core.domain.BaseAudit;
import lombok.Data;
/**
 * app助手-app与账户关系表 DTO 对象
 *
 * @author zcc
 */
@Data
public class HelperAppMemberDTO extends BaseAudit {
    private Long id;
    private Long appId;
    private Long memberId;
    private String status;
    private Integer orderNum;
    private Long deptId;
}

