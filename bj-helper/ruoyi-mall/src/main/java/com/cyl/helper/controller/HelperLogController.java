package com.cyl.helper.controller;


import com.cyl.helper.convert.HelperLogConvert;
import com.cyl.helper.domain.entity.HelperLog;
import com.cyl.helper.domain.query.HelperLogQuery;
import com.cyl.helper.domain.vo.HelperLogVO;
import com.cyl.helper.service.HelperLogService;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
/**
 * 上报日志Controller
 *
 * @author zcc
 * @date 2024-10-13
 */
@Api(description ="上报日志接口列表")
@RestController
@RequestMapping("/helper/helperLog")
public class HelperLogController extends BaseController {
    @Autowired
    private HelperLogService service;
    @Autowired
    private HelperLogConvert convert;

    @ApiOperation("查询上报日志列表")
    @PreAuthorize("@ss.hasPermi('helper:helperLog:list')")
    @PostMapping("/list")
    public ResponseEntity<Page<HelperLog>> list(@RequestBody HelperLogQuery query, Pageable page) {
        List<HelperLog> list = service.selectList(query, page);
        return ResponseEntity.ok(new PageImpl<>(list, page, ((com.github.pagehelper.Page)list).getTotal()));
    }

    @ApiOperation("导出上报日志列表")
    @PreAuthorize("@ss.hasPermi('helper:helperLog:export')")
    @Log(title = "上报日志", businessType = BusinessType.EXPORT)
    @GetMapping("/export")
    public ResponseEntity<String> export(HelperLogQuery query) {
        List<HelperLog> list = service.selectList(query, null);
        ExcelUtil<HelperLogVO> util = new ExcelUtil<>(HelperLogVO.class);
        return ResponseEntity.ok(util.writeExcel(convert.dos2vos(list), "上报日志数据"));
    }

    @ApiOperation("获取上报日志详细信息")
    @PreAuthorize("@ss.hasPermi('helper:helperLog:query')")
    @GetMapping(value = "/{operId}")
    public ResponseEntity<HelperLog> getInfo(@PathVariable("operId") Long operId) {
        return ResponseEntity.ok(service.selectByOperId(operId));
    }

    @ApiOperation("新增上报日志")
    @PreAuthorize("@ss.hasPermi('helper:helperLog:add')")
    @Log(title = "上报日志", businessType = BusinessType.INSERT)
    @PostMapping
    public ResponseEntity<Integer> add(@RequestBody HelperLog helperLog) {
        return ResponseEntity.ok(service.insert(helperLog));
    }

    @ApiOperation("修改上报日志")
    @PreAuthorize("@ss.hasPermi('helper:helperLog:edit')")
    @Log(title = "上报日志", businessType = BusinessType.UPDATE)
    @PutMapping
    public ResponseEntity<Integer> edit(@RequestBody HelperLog helperLog) {
        return ResponseEntity.ok(service.update(helperLog));
    }

    @ApiOperation("删除上报日志")
    @PreAuthorize("@ss.hasPermi('helper:helperLog:remove')")
    @Log(title = "上报日志", businessType = BusinessType.DELETE)
    @DeleteMapping("/{operIds}")
    public ResponseEntity<Integer> remove(@PathVariable Long[] operIds) {
        return ResponseEntity.ok(service.deleteByOperIds(operIds));
    }
}
