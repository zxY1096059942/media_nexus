package com.cyl.helper.domain.entity;

import java.time.LocalDateTime;
import com.ruoyi.common.annotation.Excel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import com.baomidou.mybatisplus.annotation.TableName;
/**
 * 会员任务执行对象 helper_bm_member_app_day
 * 
 * @author lcy
 */
@ApiModel(description="会员任务执行对象")
@Data
@TableName("helper_bm_member_task_day")
public class HelperBmMemberTaskDay {
    private static final long serialVersionUID = 1L;

    @ApiModelProperty("ID")
    private Long id;

    @ApiModelProperty("RECORD_YEAR_MONTH")
    @Excel(name = "RECORD_YEAR_MONTH")
    private Integer recordYearMonth;

    @ApiModelProperty("TASKID")
    @Excel(name = "TASK_ID")
    private Integer taskId;
    
    @ApiModelProperty("TASKNAME")
    @Excel(name = "TASK_NAME")
    private String taskName;
    
    @ApiModelProperty("TASKTYPEE")
    @Excel(name = "TASK_TYPE")
    private String taskType;
    
    @ApiModelProperty("MEMBER_ID")
    @Excel(name = "MEMBER_ID")
    private Long memberId;

    @ApiModelProperty("APP_ID")
    @Excel(name = "APP_ID")
    private Long appId;

    @ApiModelProperty("NUM")
    @Excel(name = "NUM")
    private Integer num; 

    @ApiModelProperty("更新时间")
    private LocalDateTime updateTime;

    @ApiModelProperty("创建时间")
    private LocalDateTime createTime;

}
