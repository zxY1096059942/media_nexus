package com.cyl.helper.domain.form;

import com.ruoyi.common.annotation.Excel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
public class HelperAppMemberForm {
    @ApiModelProperty("appId集合")
    private Long appId;

    @ApiModelProperty("账户id")
    private Long memberId;
}
