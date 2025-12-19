package com.verzol.stayhub.module.admin.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.verzol.stayhub.module.admin.dto.AdminStatsDTO;
import com.verzol.stayhub.module.booking.repository.BookingRepository;
import com.verzol.stayhub.module.hotel.repository.HotelRepository;
import com.verzol.stayhub.module.room.repository.RoomRepository;
import com.verzol.stayhub.module.user.entity.Role;
import com.verzol.stayhub.module.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Admin Service - Simple stats calculation
 * Uses aggregated queries for performance
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    /**
     * Get admin dashboard statistics
     * Simple aggregated queries for fast loading
     */
    @Transactional(readOnly = true)
    public AdminStatsDTO getAdminStats() {
        AdminStatsDTO stats = new AdminStatsDTO();
        
        // User stats - use count queries
        long totalUsers = userRepository.count();
        
        // Count by role (simple approach - can be optimized later with @Query)
        long totalCustomers = userRepository.findAll().stream()
            .filter(u -> u.getRole() == Role.CUSTOMER)
            .count();
        long totalHosts = userRepository.findAll().stream()
            .filter(u -> u.getRole() == Role.HOST)
            .count();
        
        // Hotel stats
        long totalHotels = hotelRepository.count();
        long totalRooms = roomRepository.count();
        
        // Booking stats
        long totalBookings = bookingRepository.count();
        
        // Revenue (from completed bookings) - simple approach
        BigDecimal totalRevenue = bookingRepository.findAll().stream()
            .filter(b -> "COMPLETED".equals(b.getStatus()))
            .map(b -> b.getTotalPrice() != null ? b.getTotalPrice() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // This month revenue
        LocalDateTime startOfMonth = java.time.LocalDate.now()
            .withDayOfMonth(1)
            .atStartOfDay();
        BigDecimal thisMonthRevenue = bookingRepository.findAll().stream()
            .filter(b -> "COMPLETED".equals(b.getStatus()))
            .filter(b -> b.getCheckedOutAt() != null && b.getCheckedOutAt().isAfter(startOfMonth))
            .map(b -> b.getTotalPrice() != null ? b.getTotalPrice() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Set stats
        stats.setTotalUsers(totalUsers);
        stats.setTotalCustomers(totalCustomers);
        stats.setTotalHosts(totalHosts);
        stats.setTotalHotels(totalHotels);
        stats.setTotalRooms(totalRooms);
        stats.setTotalBookings(totalBookings);
        stats.setTotalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        stats.setThisMonthRevenue(thisMonthRevenue != null ? thisMonthRevenue : BigDecimal.ZERO);
        
        return stats;
    }
}

