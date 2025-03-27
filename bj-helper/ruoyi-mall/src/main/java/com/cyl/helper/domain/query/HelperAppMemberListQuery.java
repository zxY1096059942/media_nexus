package com.cyl.helper.domain.query;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * app助手-app与账户关系表 查询 对象
 *
 * @author zcc
 */
@ApiModel(description="app助手-app与账户关系表 查询 对象")
@Data
public class HelperAppMemberListQuery {
    @ApiModelProperty("app_id 精确匹配")
    private List<Long> appId;

    @ApiModelProperty("账户id 精确匹配")
    private Long memberId;



}
