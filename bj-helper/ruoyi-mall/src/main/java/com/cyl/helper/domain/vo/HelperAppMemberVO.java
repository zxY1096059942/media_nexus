package com.cyl.helper.domain.vo;


import com.ruoyi.common.annotation.Excel;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.ruoyi.common.core.domain.BaseAudit;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
/**
 * app助手-app与账户关系表 数据视图对象
 *
 * @author zcc
 */
@Data
public class HelperAppMemberVO {
    /** ID */
    private Long id;

    private String appName;

    private String appPageName;

    private int taskTime;

    private int orderNum;



    private String appJsPath;


    private String appApkUrl;



    private String displayFlag;

    /** 昵称 */
    private String nickname;

    /** 隐藏前三位后四位的手机号 */
    private String phoneHidden;
}
