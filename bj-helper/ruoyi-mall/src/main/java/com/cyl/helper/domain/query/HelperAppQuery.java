package com.cyl.helper.domain.query;
import lombok.Data;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;


/**
 * APP软件管理 查询 对象
 *
 * @author whb
 */
@ApiModel(description="APP软件管理 查询 对象")
@Data
public class HelperAppQuery {
    @ApiModelProperty("app名称 精确匹配")
    private String appNameLike;

    @ApiModelProperty("app包名 精确匹配")
    private String appPageNameLike;
    @ApiModelProperty("app任务时长")
    private Integer taskTime;

    @ApiModelProperty("状态 精确匹配")
    private String status;

    private String appJsPath;
    private String appApkUrl;

}