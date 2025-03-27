package com.cyl.helper.domain.vo;


import java.time.LocalDateTime;
import com.ruoyi.common.annotation.Excel;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
/**
 * 上报日志 数据视图对象
 *
 * @author zcc
 */
@Data
public class HelperLogVO  {
    /** 日志主键 */
    private Long operId;
    /** 模块标题 */
    @Excel(name = "模块标题")
    private String title;
    /** 业务类型（0其它 1新增 2修改 3删除） */
    @Excel(name = "业务类型", readConverterExp = "0=其它,1=新增,2=修改,3=删除")
    private Integer businessType;
    /** 方法名称 */
    @Excel(name = "方法名称")
    private String method;
    /** 请求方式 */
    @Excel(name = "请求方式")
    private String requestMethod;
    /** 操作类别（0其它 1后台用户 2手机端用户） */
    @Excel(name = "操作类别", readConverterExp = "0=其它,1=后台用户,2=手机端用户")
    private Integer operatorType;
    /** 操作人员 */
    @Excel(name = "操作人员")
    private String operName;
    /** 部门名称 */
    @Excel(name = "部门名称")
    private String deptName;
    /** 请求URL */
    @Excel(name = "请求URL")
    private String operUrl;
    /** 主机地址 */
    @Excel(name = "主机地址")
    private String operIp;
    /** 操作地点 */
    @Excel(name = "操作地点")
    private String operLocation;
    /** 请求参数 */
    @Excel(name = "请求参数")
    private String operParam;
    /** 返回参数 */
    @Excel(name = "返回参数")
    private String jsonResult;
    /** 操作状态（0正常 1异常） */
    @Excel(name = "操作状态", readConverterExp = "0=正常,1=异常")
    private Integer status;
    /** 错误消息 */
    @Excel(name = "错误消息")
    private String errorMsg;
    /** 操作时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Excel(name = "操作时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime operTime;
}
