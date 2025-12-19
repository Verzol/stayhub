package com.verzol.stayhub.module.admin.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * Admin Dashboard Statistics DTO
 */
@Data
public class AdminStatsDTO {
    // User stats
    private Long totalUsers;
    private Long totalCustomers;
    private Long totalHosts;
    
    // Hotel stats
    private Long totalHotels;
    private Long totalRooms;
    
    // Booking stats
    private Long totalBookings;
    
    // Revenue stats
    private BigDecimal totalRevenue;
    private BigDecimal thisMonthRevenue;
}

