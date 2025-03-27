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

import com.cyl.helper.convert.HelperBmMemberAppDayConvert;
import com.cyl.helper.domain.entity.HelperBmMemberAppDay;
import com.cyl.helper.domain.query.HelperBmMemberAppDayQuery;
import com.cyl.helper.domain.vo.HelperBmMemberAppDayVO;
import com.cyl.helper.service.HelperBmMemberAppDayService;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
/**
 * 会员收益日报表Controller
 *
 * @author lcy
 * @date 2024-10-16
 */
@Api(description ="会员收益日报表接口列表")
@RestController
@RequestMapping("/helper/helperBmMemberAppDay")
public class HelperBmMemberAppDayController extends BaseController {
    @Autowired
    private HelperBmMemberAppDayService service;
    @Autowired
    private HelperBmMemberAppDayConvert convert;

    @ApiOperation("查询会员收益日报表列表")
    @PreAuthorize("@ss.hasPermi('helper:helperBmMemberAppDay:list')")
    @PostMapping("/list")
    public ResponseEntity<Page<HelperBmMemberAppDay>> list(@RequestBody HelperBmMemberAppDayQuery query, Pageable page) {
        List<HelperBmMemberAppDay> list = service.selectList(query, page);
        return ResponseEntity.ok(new PageImpl<>(list, page, ((com.github.pagehelper.Page)list).getTotal()));
    }

    @ApiOperation("导出会员收益日报表列表")
    @PreAuthorize("@ss.hasPermi('helper:helperBmMemberAppDay:export')")
    @Log(title = "会员收益日报表", businessType = BusinessType.EXPORT)
    @GetMapping("/export")
    public ResponseEntity<String> export(HelperBmMemberAppDayQuery query) {
        List<HelperBmMemberAppDay> list = service.selectList(query, null);
        ExcelUtil<HelperBmMemberAppDayVO> util = new ExcelUtil<>(HelperBmMemberAppDayVO.class);
        return ResponseEntity.ok(util.writeExcel(convert.dos2vos(list), "会员收益日报表数据"));
    }

    @ApiOperation("获取会员收益日报表详细信息")
    @PreAuthorize("@ss.hasPermi('helper:helperBmMemberAppDay:query')")
    @GetMapping(value = "/{id}")
    public ResponseEntity<HelperBmMemberAppDay> getInfo(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.selectById(id));
    }

    @ApiOperation("新增会员收益日报表")
    @PreAuthorize("@ss.hasPermi('helper:helperBmMemberAppDay:add')")
    @Log(title = "会员收益日报表", businessType = BusinessType.INSERT)
    @PostMapping
    public ResponseEntity<Integer> add(@RequestBody HelperBmMemberAppDay helperBmMemberAppDay) {
        return ResponseEntity.ok(service.insert(helperBmMemberAppDay));
    }

    @ApiOperation("修改会员收益日报表")
    @PreAuthorize("@ss.hasPermi('helper:helperBmMemberAppDay:edit')")
    @Log(title = "会员收益日报表", businessType = BusinessType.UPDATE)
    @PutMapping
    public ResponseEntity<Integer> edit(@RequestBody HelperBmMemberAppDay helperBmMemberAppDay) {
        return ResponseEntity.ok(service.update(helperBmMemberAppDay));
    }

    @ApiOperation("删除会员收益日报表")
    @PreAuthorize("@ss.hasPermi('helper:helperBmMemberAppDay:remove')")
    @Log(title = "会员收益日报表", businessType = BusinessType.DELETE)
	@DeleteMapping("/{ids}")
    public ResponseEntity<Integer> remove(@PathVariable Long[] ids) {
        return ResponseEntity.ok(service.deleteByIds(ids));
    }
}
