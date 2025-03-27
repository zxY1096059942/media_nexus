package com.cyl.manager.statistics.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cyl.app.WebSocketServer;
import com.cyl.manager.statistics.domain.query.GoodsStatisticsQuery;
import com.cyl.manager.statistics.domain.query.OrderStatisticsQuery;
import com.cyl.manager.statistics.domain.vo.AppStatusStatisticsVO;
import com.cyl.manager.statistics.domain.vo.MemberAndCartStatisticsVO;
import com.cyl.manager.statistics.domain.vo.MemberStatisticsVO;
import com.cyl.manager.statistics.domain.vo.MemberStatusStatisticsVO;
import com.cyl.manager.statistics.domain.vo.OrderAndAftersaleStatisticsVO;
import com.cyl.manager.statistics.domain.vo.OrderStatisticsVO;
import com.cyl.manager.statistics.domain.vo.ProductTopVO;
import com.cyl.manager.statistics.service.IndexStatisticsService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

/**
 * 管理端,首页统计数据接口
 *
 * @author zhangcheng
 * @since 2023/05/15 13:53
 */
@Slf4j
@Api(tags = "管理端,首页统计数据接口")
@RestController
@RequestMapping("/dev/statistics/index")
public class IndexStatisticsManagerController {

    /**
     * 首页统计
     */
    @Autowired
    private IndexStatisticsService indexStatisticsService;

    @ApiOperation(value = "获取首页查询热卖商品TOP10")
    @GetMapping("/goodsStatistics")
    public ResponseEntity<List<ProductTopVO>> goodsStatistics(@Validated GoodsStatisticsQuery goodsStatisticsQuery) {

        return ResponseEntity.ok(indexStatisticsService.goodsStatistics(goodsStatisticsQuery));
    }

    @ApiOperation(value = "订单信息")
    @PostMapping("/orderStatistics")
    public ResponseEntity<List<OrderStatisticsVO>> orderStatistics(@RequestBody OrderStatisticsQuery param) {
        return ResponseEntity.ok(indexStatisticsService.orderStatistics(param));
    }
    
    @ApiOperation(value = "会员账户信息")
    @PostMapping("/memberAccountStatistics")
    public ResponseEntity<List<MemberStatisticsVO>> memberAccountStatistics(@RequestBody OrderStatisticsQuery param) {
        return ResponseEntity.ok(indexStatisticsService.memberAccountStatistics(param));
    }
    
    @ApiOperation(value = "会员状态数")
    @GetMapping("/memberStatusStatistics")
    public ResponseEntity<List<MemberStatusStatisticsVO>> statMemberStatus(){
        return ResponseEntity.ok(indexStatisticsService.memberStatusStatistics());
    }
    @ApiOperation(value = "App状态数")
    @GetMapping("/appStatusStatistics")
    public ResponseEntity<List<AppStatusStatisticsVO>> statAppStatus(){
        return ResponseEntity.ok(indexStatisticsService.appStatusStatistics());
    }
    
    @ApiOperation(value = "会员数，加购数")
    @GetMapping("/memberAndCart/statistics")
    public ResponseEntity<MemberAndCartStatisticsVO> statMemberAndCart(){
    	MemberAndCartStatisticsVO vo =indexStatisticsService.statMemberAndCart();
    	vo.setOnlineCount(WebSocketServer.getOnlineCount()); 
        return ResponseEntity.ok(vo);
    }

    @ApiOperation(value = "订单与售后单统计")
    @GetMapping("/order/aftersale/statistics")
    public ResponseEntity<OrderAndAftersaleStatisticsVO> orderAndAftersaleStatistics(){
        return ResponseEntity.ok(indexStatisticsService.orderAndAftersaleStatistics());
    }

    @ApiOperation(value = "在线会员数")
    @GetMapping("/member/online")
    public ResponseEntity<Integer> memberOnline(){
        return ResponseEntity.ok(WebSocketServer.getOnlineCount());
    }
    
}
