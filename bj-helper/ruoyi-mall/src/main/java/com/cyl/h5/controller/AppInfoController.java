package com.cyl.h5.controller;

import com.cyl.helper.domain.entity.HelperApp;
import com.cyl.helper.domain.entity.HelperAppMember;
import com.cyl.helper.domain.entity.HelperLog;
import com.cyl.helper.domain.form.HelperAppMemberForm;
import com.cyl.helper.domain.query.HelperAppMemberQuery;
import com.cyl.helper.domain.query.HelperAppQuery;
import com.cyl.helper.domain.vo.HelperAppMemberVO;
import com.cyl.helper.service.HelperAppMemberService;
import com.cyl.helper.service.HelperAppService;
import com.cyl.helper.service.HelperLogService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/h5/appInfo")
public class AppInfoController {
    @Autowired
    private HelperAppService service;

    @Autowired
    private HelperAppMemberService appMemberService;

    @Autowired
    private HelperLogService helperLogService;

    @ApiOperation("APP信息列表")
    @PostMapping("/list")
    public ResponseEntity<List<HelperApp>> list(HelperAppQuery query){
        List<HelperApp> list = service.selectList(query, null);
        return  ResponseEntity.ok(list);
    }

    @ApiOperation("根据用户id查询相关app关系列表")
    @PostMapping("/findMemberAndAppList")
    public ResponseEntity<List<HelperAppMemberVO>> findMemberAndAppList(@RequestBody HelperAppMemberQuery query){
        List<HelperAppMemberVO> helperAppMemberVOS = new ArrayList<HelperAppMemberVO>();
        List<HelperAppMember> list = appMemberService.selectByPageList(query);

        /*list.forEach(e -> {
            Long appId = e.getAppId();
            HelperApp helperApp = service.selectById(appId);
            HelperAppMemberVO HelperAppMemberVo = new HelperAppMemberVO();
            BeanUtils.copyProperties(helperApp, HelperAppMemberVo);
            helperAppMemberVOS.add(HelperAppMemberVo);
        });*/

        HelperAppMemberVO HelperAppMemberVo = new HelperAppMemberVO();
        HelperApp helperApp = service.selectById(15L);
        BeanUtils.copyProperties(helperApp, HelperAppMemberVo);
        helperAppMemberVOS.add(HelperAppMemberVo);

        return  ResponseEntity.ok(helperAppMemberVOS);
    }

    @ApiOperation("根据用户id 更新 相关app关系列表")
    @PostMapping("/updateUserHelperAppStatus")
    public ResponseEntity updateUserHelperAppStatus(@RequestBody HelperAppMemberQuery query){
        boolean b = service.updateUserHelperAppStatus(query.getMemberId());
        if(!b){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("更新 app 配置成功!!");
    }





    @ApiOperation("批量新增AppId与用户id创建关系")
    @PostMapping("/addAppAndMember")
    public ResponseEntity<Integer> add(@RequestBody List<HelperAppMemberForm> helperAppMemberForm) {
        return ResponseEntity.ok(appMemberService.bacthInsert(helperAppMemberForm));
    }
    @ApiOperation("接收APP上报数据")
    @PostMapping("/addAppLog")
    public ResponseEntity<Integer> addAppLog(@RequestBody HelperLog helperLog) {
        return ResponseEntity.ok(helperLogService.insert(helperLog));
    }


}
