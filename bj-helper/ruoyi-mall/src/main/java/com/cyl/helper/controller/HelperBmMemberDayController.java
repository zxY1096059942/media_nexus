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

import com.cyl.helper.convert.HelperBmMemberDayConvert;
import com.cyl.helper.domain.entity.HelperBmMemberDay;
import com.cyl.helper.domain.query.HelperBmMemberDayQuery;
import com.cyl.helper.domain.vo.HelperBmMemberDayVO;
import com.cyl.helper.service.HelperBmMemberDayService;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
/**
 * 账户成员日报表Controller
 *
 * @author lcy
 * @date 2024-10-16
 */
@Api(value ="账户成员日报表接口列表")
@RestController
@RequestMapping("/helper/helperBmMemberDay")
public class HelperBmMemberDayController extends BaseController {
    @Autowired
    private HelperBmMemberDayService service;
    @Autowired
    private HelperBmMemberDayConvert convert;

    @ApiOperation("查询账户成员日报表列表")
    @PreAuthorize("@ss.hasPermi('helper:helperBmMemberDay:list')")
    @PostMapping("/list")
    public ResponseEntity<Page<HelperBmMemberDay>> list(@RequestBody HelperBmMemberDayQuery query, Pageable page) {
        List<HelperBmMemberDay> list = service.selectList(query, page);
        return ResponseEntity.ok(new PageImpl<>(list, page, ((com.github.pagehelper.Page)list).getTotal()));
    }


    @ApiOperation("导出账户成员日报表列表")
    @PreAuthorize("@ss.hasPermi('helper:helperBmMemberDay:export')")
    @Log(title = "账户成员日报表", businessType = BusinessType.EXPORT)
    @GetMapping("/export")
    public ResponseEntity<String> export(HelperBmMemberDayQuery query) {
        List<HelperBmMemberDay> list = service.selectList(query, null);
        ExcelUtil<HelperBmMemberDayVO> util = new ExcelUtil<>(HelperBmMemberDayVO.class);
        return ResponseEntity.ok(util.writeExcel(convert.dos2vos(list), "账户成员日报表数据"));
    }

    @ApiOperation("获取账户成员日报表详细信息")
    @PreAuthorize("@ss.hasPermi('helper:helperBmMemberDay:query')")
    @GetMapping(value = "/{id}")
    public ResponseEntity<HelperBmMemberDay> getInfo(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.selectById(id));
    }

    @ApiOperation("新增账户成员日报表")
    @PreAuthorize("@ss.hasPermi('helper:helperBmMemberDay:add')")
    @Log(title = "账户成员日报表", businessType = BusinessType.INSERT)
    @PostMapping
    public ResponseEntity<Integer> add(@RequestBody HelperBmMemberDay helperBmMemberDay) {
        return ResponseEntity.ok(service.insert(helperBmMemberDay));
    }

    @ApiOperation("修改账户成员日报表")
    @PreAuthorize("@ss.hasPermi('helper:helperBmMemberDay:edit')")
    @Log(title = "账户成员日报表", businessType = BusinessType.UPDATE)
    @PutMapping
    public ResponseEntity<Integer> edit(@RequestBody HelperBmMemberDay helperBmMemberDay) {
        return ResponseEntity.ok(service.update(helperBmMemberDay));
    }

    @ApiOperation("删除账户成员日报表")
    @PreAuthorize("@ss.hasPermi('helper:helperBmMemberDay:remove')")
    @Log(title = "账户成员日报表", businessType = BusinessType.DELETE)
	@DeleteMapping("/{ids}")
    public ResponseEntity<Integer> remove(@PathVariable Long[] ids) {
        return ResponseEntity.ok(service.deleteByIds(ids));
    }
}
