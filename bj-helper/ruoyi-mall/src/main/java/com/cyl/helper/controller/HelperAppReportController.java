package com.cyl.helper.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cyl.helper.convert.HelperAppReportConvert;
import com.cyl.helper.domain.entity.HelperAppReport;
import com.cyl.helper.domain.query.HelperAppReportQuery;
import com.cyl.helper.domain.vo.HelperAppReportVO;
import com.cyl.helper.service.HelperAppReportService;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
/**
 * 数据上报Controller
 *
 * @author lcy
 * @date 2024-10-16
 */
@Api(value ="数据上报接口列表")
@RestController
@RequestMapping("/helper/helperAppReport")
public class HelperAppReportController extends BaseController {
    @Autowired
    private HelperAppReportService service;
    @Autowired
    private HelperAppReportConvert convert;

    @ApiOperation("查询数据上报列表")
    @PreAuthorize("@ss.hasPermi('helper:helperAppReport:list')")
    @PostMapping("/list")
    public ResponseEntity<Page< HelperAppReport>> list(@RequestBody  HelperAppReportQuery query, Pageable page) {
        List< HelperAppReport> list = service.selectList(query, page);
        return ResponseEntity.ok(new PageImpl<>(list, page, ((com.github.pagehelper.Page)list).getTotal()));
    }

    @ApiOperation("导出数据上报列表")
    @PreAuthorize("@ss.hasPermi('helper:helperAppReport:export')")
    @Log(title = "数据上报", businessType = BusinessType.EXPORT)
    @GetMapping("/export")
    public ResponseEntity<String> export( HelperAppReportQuery query) {
        List<HelperAppReport> list = service.selectList(query, null);
        ExcelUtil< HelperAppReportVO> util = new ExcelUtil<>( HelperAppReportVO.class);
        return ResponseEntity.ok(util.writeExcel(convert.dos2vos(list), "数据上报数据"));
    }

    @ApiOperation("获取数据上报详细信息")
    @PreAuthorize("@ss.hasPermi('helper:helperAppReport:query')")
    @GetMapping(value = "/{id}")
    public ResponseEntity<HelperAppReport> getInfo(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.selectById(id));
    }

    @ApiOperation("新增数据上报")
    @PreAuthorize("@ss.hasPermi('helper:helperAppReport:add')")
    @Log(title = "数据上报", businessType = BusinessType.INSERT)
    @PostMapping
    public ResponseEntity<Integer> add(@RequestBody HelperAppReport helperAppReport) {
        return ResponseEntity.ok(service.insert(helperAppReport));
    }

    @ApiOperation("修改数据上报")
    @PreAuthorize("@ss.hasPermi('helper:helperAppReport:edit')")
    @Log(title = "数据上报", businessType = BusinessType.UPDATE)
    @PutMapping
    public ResponseEntity<Integer> edit(@RequestBody HelperAppReport helperAppReport) {
        return ResponseEntity.ok(service.update(helperAppReport));
    }

    @ApiOperation("删除数据上报")
    @PreAuthorize("@ss.hasPermi('helper:helperAppReport:remove')")
    @Log(title = "数据上报", businessType = BusinessType.DELETE)
	@DeleteMapping("/{ids}")
    public ResponseEntity<Integer> remove(@PathVariable Long[] ids) {
        return ResponseEntity.ok(service.deleteByIds(ids));
    }
}
