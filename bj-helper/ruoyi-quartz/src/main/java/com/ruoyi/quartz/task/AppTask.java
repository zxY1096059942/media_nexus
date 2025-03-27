package com.ruoyi.quartz.task;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson2.JSONObject;
import com.cyl.app.MessageModelHelper;
import com.cyl.helper.domain.entity.HelperAppReport;
import com.cyl.helper.domain.entity.HelperBmMemberAppDay;
import com.cyl.helper.domain.entity.HelperBmMemberDay;
import com.cyl.helper.domain.entity.HelperBmMemberTaskDay;
import com.cyl.helper.mapper.HelperAppMapper;
import com.cyl.helper.mapper.HelperAppReportMapper;
import com.cyl.helper.mapper.HelperBmMemberAppDayMapper;
import com.cyl.helper.mapper.HelperBmMemberDayMapper;
import com.cyl.helper.mapper.HelperBmMemberTaskDayMapper;
import com.cyl.manager.ums.mapper.MemberMapper;
import com.ruoyi.common.config.RuoYiConfig;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;

import lombok.extern.slf4j.Slf4j;

@Component("appTask")
@Slf4j
public class AppTask {
	@Autowired
	private HelperAppReportMapper helperAppReportMapper;
	@Autowired
	private HelperAppMapper helperAppMapper;
	@Autowired
	private MemberMapper memberMapper;
	@Autowired
	private HelperBmMemberDayMapper helperBmMemberDayMapper;

	@Autowired
	private HelperBmMemberAppDayMapper helperBmMemberAppDayMapper;

	@Autowired
	private HelperBmMemberTaskDayMapper helperBmMemberTaskDayMapper;

	@Autowired
	private RuoYiConfig ruoYiConfig;

	public void ryMultipleParams(String s, Boolean b, Long l, Double d, Integer i) {
		System.out.println(StringUtils.format("执行多参方法： 字符串类型{}，布尔类型{}，长整型{}，浮点型{}，整形{}", s, b, l, d, i));
	}

	public void runTaskReport(String params) {
		if ("YUNKONG".equals(ruoYiConfig.getPlat())) {
			log.info("执行runTaskReport方法：" + params);
			HelperAppReport helperAppReport = new HelperAppReport();
			helperAppReport.setType(MessageModelHelper.MESSAGETYPE_INFO);
			helperAppReport.setCode(MessageModelHelper.MESSAGECODE_200);
			helperAppReport.setHandleStatus(0);
			List<HelperAppReport> reports = helperAppReportMapper.selectUnHandleReport(helperAppReport);
			List<Long> ids = new ArrayList<Long>(reports.size());
			final ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap();
			for (HelperAppReport report : reports) {
				try {
					log.info("runTaskReport is {}:", report.getReportData());
					JSONObject jsonInfo = JSONObject.parseObject(report.getReportData());
					String execDay = jsonInfo.getString("execDay").substring(0, 10);
					execDay = execDay.replace("-", "");
					String key = execDay + ":" + report.getMemberId() + ":" + jsonInfo.getString("appId") + ":"
							+ jsonInfo.getString("taskId") + ":" + jsonInfo.getString("taskName");
//						log.debug("key:==="+key);
					map.computeIfAbsent(key, k -> {
						Integer value = map.get(k);
						if (value == null) {
							return jsonInfo.getInteger("gold");
						} else {
							// 键值对存在时，直接返回值
							return value + jsonInfo.getInteger("gold");
						}
					});

					// TODO 需要补充业务数据上报处理逻辑
					ids.add(report.getId());
				} catch (Exception e) {
					log.error("处理上报的数据异常:", e);
				}
			}
			if (ids.size() > 0) {
				List<HelperBmMemberTaskDay> helperBmMemberTaskList = new ArrayList(ids.size());
				for (Map.Entry<String, Integer> entry : map.entrySet()) {
					String[] key = entry.getKey().split(":");
//		    			log.debug(entry.getKey()+":::"+entry.getValue());
//		    			log.debug("key[0:"+ key);
					HelperBmMemberTaskDay item = new HelperBmMemberTaskDay();
					item.setRecordYearMonth(Integer.parseInt(key[0]));
					item.setMemberId(Long.parseLong(key[1]));
					item.setAppId(Long.parseLong(key[2]));
					item.setNum(entry.getValue());
					item.setCreateTime(LocalDateTime.now());
					item.setTaskId(Integer.parseInt(key[3]));
					item.setTaskName(key[4]);
					item.setTaskType("coin");
					helperBmMemberTaskList.add(item);
				}
				helperBmMemberTaskDayMapper.inserthelperBmMemberTaskDays(helperBmMemberTaskList);
				helperAppReportMapper.updateHandleFlagByIds(ids);
				map.clear();
				ids.clear();
				ids = null;
			}
		}

	}
	public void runReport(String params) {
		if ("YUNKONG".equals(ruoYiConfig.getPlat())) {
			log.info("执行runReport方法：" + params);
			List<String> codes=new ArrayList<>();
			codes.add(MessageModelHelper.MESSAGECODE_300);
			codes.add(MessageModelHelper.MESSAGECODE_301);
			codes.add(MessageModelHelper.MESSAGECODE_302);
			HelperAppReport helperAppReport = new HelperAppReport();
			helperAppReport.setType(MessageModelHelper.MESSAGETYPE_INFO);
			helperAppReport.setCodes(codes);
			helperAppReport.setHandleStatus(0);
			List<HelperAppReport> reports = helperAppReportMapper.selectUnHandleReport(helperAppReport);
			List<Long> ids = new ArrayList<Long>(reports.size());
			List<HelperBmMemberAppDay> helperBmMemberAppDayList=new ArrayList<>();
			for (HelperAppReport report : reports) {
				try {
					log.info("ReportData is {}:", report.getReportData());
					JSONObject jsonInfo = JSONObject.parseObject(report.getReportData());
					if(jsonInfo.getInteger("gold")!=null) {// 金额有值，则进行计算
						String execDay = jsonInfo.getString("planKey");
						execDay = execDay.replace("-", "");
						HelperBmMemberAppDay item=new HelperBmMemberAppDay();
						item.setRecordYearMonth(Integer.parseInt(execDay)); 
						item.setRecordDay(Integer.parseInt(execDay.substring(6)));
						item.setMemberId(report.getMemberId());
						item.setAppId(jsonInfo.getLong(("id")));
						item.setGoldCoinNum(jsonInfo.getInteger("gold"));
						item.setCreateTime(LocalDateTime.now()); 
						item.setCashOutAmount(0L);
						item.setRedPacketAmount(0L);
						ids.add(report.getId());
						helperBmMemberAppDayList.add(item);
					}
				} catch (Exception e) {
					log.error("处理上报的数据异常:", e);
				}
			}
			if (ids.size() > 0) {		
				helperBmMemberAppDayMapper.insertHelperBmMemberAppDays(helperBmMemberAppDayList);
				helperAppReportMapper.updateHandleFlagByIds(ids);				
				ids.clear();
				ids = null;
			}
		}

	}
	public void runCalculateMemberApp(String params) {
		if ("YUNKONG".equals(ruoYiConfig.getPlat())) {
			log.info("执行runCalculateMemberApp方法：" + params);
			Integer yesterday = Integer.valueOf(DateUtils.getYesterdayDate());
			helperBmMemberAppDayMapper.deleteByYearMonthDay(yesterday);
			helperBmMemberAppDayMapper.insertMemberAppDaysForDate(yesterday);			

		}

	}

	public void runCalculateMember() {
		if ("YUNKONG".equals(ruoYiConfig.getPlat())) {
			log.info("执行runCalculateMember方法");
			Integer totalBeforeNow = memberMapper.getTotalBeforeNow();
			Integer totalNewYesterday = memberMapper.getTotalNewYesterday();
			Integer totalActiveYesterday = helperAppReportMapper.getTotalActiveYesterday();
			HelperBmMemberDay entity = new HelperBmMemberDay();
			String yesterday = DateUtils.getYesterdayDate();
//		        log.debug(yesterday);
			entity.setRecordYearMonth(Integer.valueOf(yesterday));
			entity.setRecordDay(Integer.valueOf(yesterday.substring(6)));
			entity.setMemberTotalNum(totalBeforeNow);
			entity.setMemberNewNum(totalNewYesterday);
			entity.setMemberActiveNum(totalActiveYesterday);
			entity.setCreateTime(LocalDateTime.now());
			helperBmMemberDayMapper.deleteByYearMonthDay(entity.getRecordYearMonth());
			helperBmMemberDayMapper.insert(entity);
		}
	}

	public static void main(String[] aa) {
		System.out.println("20241020".substring(6));
	}
}
