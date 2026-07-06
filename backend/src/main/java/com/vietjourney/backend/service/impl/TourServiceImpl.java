package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.entity.Tour;
import com.vietjourney.backend.repository.TourRepository;
import com.vietjourney.backend.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import org.springframework.cache.annotation.Cacheable;
import java.math.BigDecimal;

/*
 * Tại sao cache danh sách Tour/Hotel?
 * - Dữ liệu Tour/Hotel ít thay đổi (admin cập nhật không thường xuyên)
 *   nhưng được đọc rất nhiều lần (mỗi user vào trang chủ đều query)
 * - Không cache: mỗi request → 1 query SQL → tăng load DB khi traffic cao
 * - Có cache: request đầu → query DB + lưu cache; các request sau → lấy
 *   từ cache (Caffeine in-memory - zero latency) → giảm tải DB đáng kể
 * 
 * Lý do chọn Caffeine thay vì Redis:
 * - Project single-instance: không cần shared cache giữa nhiều server
 * - Caffeine zero-latency (in-process), Redis có network round-trip
 * - Nếu scale lên multi-instance sau này, sẽ migrate sang Redis
 * 
 * - KHÔNG cache: Booking, Payment (thay đổi liên tục, cần data real-time)
 */
@Service
@RequiredArgsConstructor
public class TourServiceImpl implements TourService {

    private final TourRepository tourRepository;

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Page<Tour> searchTours(String query, BigDecimal minPrice, BigDecimal maxPrice, String location, Pageable pageable) {
        if (query == null || query.trim().length() < 3) {
            // Full-text không hiệu quả với query quá ngắn → dùng LIKE cho query ngắn
            return tourRepository.searchToursLike(
                query == null ? null : query.trim(), minPrice, maxPrice, location, pageable);
        }
        // Full-text cho query dài hơn
        return tourRepository.searchToursFullText(query.trim(), minPrice, maxPrice, location, pageable);
    }

    @Override
    @Cacheable(value = "tour_slug", key = "#slug")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Tour getTourBySlug(String slug) {
        return tourRepository.findBySlug(slug)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Tour not found with slug: " + slug));
    }

    @Override
    @Cacheable(value = "tour_id", key = "#id")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Tour getTourById(Long id) {
        return tourRepository.findById(id)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Tour not found with id: " + id));
    }

    // NOTE: Hiện chưa có admin endpoint update/delete Tour.
    // Khi thêm sau này, nhớ bổ sung @CacheEvict tương ứng ở đây.
}
