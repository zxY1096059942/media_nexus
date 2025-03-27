package com.cyl.h5.controller;

import com.cyl.h5.domain.form.RegisterForm;
import com.cyl.h5.domain.vo.H5LoginVO;
import com.cyl.h5.domain.vo.RegisterVO;
import com.cyl.h5.domain.vo.ValidatePhoneVO;
import com.cyl.h5.service.H5MemberService;
import com.cyl.manager.ums.domain.vo.MemberVO;
import com.ruoyi.common.core.domain.model.LoginMember;
import com.ruoyi.framework.web.service.TokenService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/h5")
public class APPMemberController {

    @Autowired
    private H5MemberService service;
    @Autowired
    private TokenService tokenService;
    @ApiOperation("APP账户手机号密码登录")
    @PostMapping("/account/login")
    public ResponseEntity<H5LoginVO> accountLogin(@RequestBody String data){
        return ResponseEntity.ok(service.accountLogin(data));
    }
    @ApiOperation("获取APP账户信息")
    @GetMapping("/member/info")
    public ResponseEntity<MemberVO> getMemberInfo(){
        return ResponseEntity.ok(service.getMemberInfo());
    }
    @ApiOperation("新增APP账户登录记录")
    @GetMapping("/record/login")
    public void add(HttpServletRequest request) {
        LoginMember loginMember = tokenService.getLoginMember(request);
        if (loginMember != null){
            service.insert(loginMember.getMemberId());
        }
    }
    @ApiOperation("APP账户注册")
    @PostMapping("/register")
    public ResponseEntity<RegisterVO> register(@RequestBody RegisterForm request){
        return ResponseEntity.ok(service.register(request));
    }
    @ApiOperation("APP账户注册登录验证码校验手机号")
    @GetMapping("/validate/{phone}")
    public ResponseEntity<ValidatePhoneVO> validate(@PathVariable String phone){
        return ResponseEntity.ok(service.validate(phone));
    }
    @ApiOperation("APP账户sms登录")
    @PostMapping("/sms/login")
    public ResponseEntity<H5LoginVO> smsLogin(@RequestBody String data){
        return ResponseEntity.ok(service.smsLogin(data));
    }



}
