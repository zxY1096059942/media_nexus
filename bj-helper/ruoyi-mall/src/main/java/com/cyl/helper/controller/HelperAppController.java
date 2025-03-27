package com.cyl.helper.controller;


import com.cyl.helper.convert.HelperAppConvert;
import com.cyl.helper.domain.entity.HelperApp;
import com.cyl.helper.domain.query.HelperAppMemberListQuery;
import com.cyl.helper.domain.query.HelperAppQuery;
import com.cyl.helper.domain.vo.HelperAppMemberVO;
import com.cyl.helper.domain.vo.HelperAppVO;
import com.cyl.helper.service.HelperAppMemberService;
import com.cyl.helper.service.HelperAppService;
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
 * APP软件管理Controller
 *
 * @author whb
 * @date 2024-10-13
 */
@Api(description ="APP软件管理接口列表")
@RestController
@RequestMapping("/helper/helperApp")
public class HelperAppController extends BaseController {
    @Autowired
    private HelperAppService service;
    @Autowired
    private HelperAppConvert convert;

    @Autowired
    private HelperAppMemberService helperAppMemberService;

    @ApiOperation("查询APP软件管理列表")
    @PreAuthorize("@ss.hasPermi('helper:helperApp:list')")
    @PostMapping("/list")
    public ResponseEntity<Page<HelperApp>> list(@RequestBody HelperAppQuery query, Pageable page) {
        List<HelperApp> list = service.selectList(query, page);
        return ResponseEntity.ok(new PageImpl<>(list, page, ((com.github.pagehelper.Page)list).getTotal()));
    }

    @ApiOperation("导出APP软件管理列表")
    @PreAuthorize("@ss.hasPermi('helper:helperApp:export')")
    @Log(title = "APP软件管理", businessType = BusinessType.EXPORT)
    @GetMapping("/export")
    public ResponseEntity<String> export(HelperAppQuery query) {
        List<HelperApp> list = service.selectList(query, null);
        ExcelUtil<HelperAppVO> util = new ExcelUtil<>(HelperAppVO.class);
        return ResponseEntity.ok(util.writeExcel(convert.dos2vos(list), "APP软件管理数据"));
    }

    @ApiOperation("获取APP软件管理详细信息")
    @PreAuthorize("@ss.hasPermi('helper:helperApp:query')")
    @GetMapping(value = "/{id}")
    public ResponseEntity<HelperApp> getInfo(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.selectById(id));
    }

    @ApiOperation("新增APP软件管理")
    @PreAuthorize("@ss.hasPermi('helper:helperApp:add')")
    @Log(title = "APP软件管理", businessType = BusinessType.INSERT)
    @PostMapping
    public ResponseEntity<Integer> add(@RequestBody HelperApp helperApp) {
        return ResponseEntity.ok(service.insert(helperApp));
    }

    @ApiOperation("修改APP软件管理")
    @PreAuthorize("@ss.hasPermi('helper:helperApp:edit')")
    @Log(title = "APP软件管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public ResponseEntity<Integer> edit(@RequestBody HelperApp helperApp) {
        return ResponseEntity.ok(service.update(helperApp));
    }

    @ApiOperation("删除APP软件管理")
    @PreAuthorize("@ss.hasPermi('helper:helperApp:remove')")
    @Log(title = "APP软件管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public ResponseEntity<Integer> remove(@PathVariable Long[] ids) {
        return ResponseEntity.ok(service.deleteByIds(ids));
    }


    @ApiOperation("获取APP配置软件管理详细信息")
    @GetMapping(value = "/getUserByListHelperApp/{id}")
    public ResponseEntity<List<HelperAppMemberVO> > getUserByListHelperApp(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.getUserByListHelperApp(id));
    }

    @ApiOperation("修改用户任务的状态")
    @GetMapping(value = "/updateUserHelperAppStatus/{id}")
    public ResponseEntity<List<HelperAppMemberVO> > updateUserHelperAppStatus(@PathVariable("id") Long id) {
        List<HelperAppMemberVO> userByListHelperApp = service.getUserByListHelperApp(id);

        return ResponseEntity.ok(service.getUserByListHelperApp(id));
    }


    @ApiOperation("删除APP配置软件管理")
    @Log(title = "删除APP配置软件管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/bacthDelHelperApp/{ids}")
    public ResponseEntity<Integer> bacthDelHelperApp(@PathVariable Long[] ids) {
        return ResponseEntity.ok(helperAppMemberService.deleteByIds(ids));
    }

    @ApiOperation("删除APP配置软件管理")
    @Log(title = "删除APP配置软件管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/bacthDelHelperApp/{ids}/{memberId}")
    public ResponseEntity<Integer> batchDeleteByMemberId(@PathVariable Long[] ids,@PathVariable Long memberId) {
    	
        return ResponseEntity.ok(helperAppMemberService.batchDeleteByMemberId(ids,memberId));
    }
    

    @ApiOperation("添加APP配置软件管理")
    @Log(title = "添加APP配置软件管理", businessType = BusinessType.INSERT)
    @PostMapping("/bacthAddHelperApp")
    public ResponseEntity<Integer> bacthAddHelperApp(@RequestBody HelperAppMemberListQuery query) {
        return ResponseEntity.ok(helperAppMemberService.bacthAddHelperApp(query));
    }



}
