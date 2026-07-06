package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.entity.Tour;
import com.vietjourney.backend.repository.TourRepository;
import com.vietjourney.backend.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional(readOnly = true)
    public Page<Tour> searchTours(String query, BigDecimal minPrice, BigDecimal maxPrice, String location, Pageable pageable) {
        if (query == null || query.trim().length() < 3) {
            // Full-text không hiệu quả với query quá ngắn → dùng LIKE cho query ngắn
            return tourRepository.searchToursLike(
                query == null ? null : query.trim(), minPrice, maxPrice, location, pageable);
        }
        // Full-text cho query dài hơn
        String escapedQuery = query.trim().replaceAll("[+\\-()*~@<>\"\\\\]", " ");
        return tourRepository.searchToursFullText(escapedQuery, minPrice, maxPrice, location, pageable);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"tour_slug", "tour_id"}, allEntries = true)
    public Tour createTour(Tour tour) {
        return tourRepository.save(tour);
    }

    @Override
    @Cacheable(value = "tour_slug", key = "#slug")
    @Transactional(readOnly = true)
    public Tour getTourBySlug(String slug) {
        return tourRepository.findBySlug(slug)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Tour not found with slug: " + slug));
    }

    @Override
    @Transactional
    @CacheEvict(value = {"tour_slug", "tour_id"}, allEntries = true)
    public Tour updateTour(Long id, Tour updatedTour) {
        Tour tour = getTourById(id);
        tour.setName(updatedTour.getName());
        tour.setSlug(updatedTour.getSlug());
        tour.setImage(updatedTour.getImage());
        tour.setLocation(updatedTour.getLocation());
        tour.setPrice(updatedTour.getPrice());
        tour.setOldPrice(updatedTour.getOldPrice());
        tour.setRating(updatedTour.getRating());
        tour.setReviewCount(updatedTour.getReviewCount());
        tour.setDuration(updatedTour.getDuration());
        tour.setOverview(updatedTour.getOverview());
        tour.setIsFeatured(updatedTour.getIsFeatured());
        if (tour.getItinerary() != null) { tour.getItinerary().clear(); }
        if (updatedTour.getItinerary() != null) {
            updatedTour.getItinerary().forEach(item -> { item.setTour(tour); tour.getItinerary().add(item); });
        }
        if (tour.getHighlights() != null) { tour.getHighlights().clear(); }
        if (updatedTour.getHighlights() != null) {
            updatedTour.getHighlights().forEach(item -> { item.setTour(tour); tour.getHighlights().add(item); });
        }
        if (tour.getIncluded() != null) { tour.getIncluded().clear(); }
        if (updatedTour.getIncluded() != null) {
            updatedTour.getIncluded().forEach(item -> { item.setTour(tour); tour.getIncluded().add(item); });
        }
        if (tour.getExcluded() != null) { tour.getExcluded().clear(); }
        if (updatedTour.getExcluded() != null) {
            updatedTour.getExcluded().forEach(item -> { item.setTour(tour); tour.getExcluded().add(item); });
        }
        return tourRepository.save(tour);
    }

    @Override
    @Cacheable(value = "tour_id", key = "#id")
    @Transactional(readOnly = true)
    public Tour getTourById(Long id) {
        return tourRepository.findById(id)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Tour not found with id: " + id));
    }

    // NOTE: Hiện chưa có admin endpoint update/delete Tour.
    // Khi thêm sau này, nhớ bổ sung @CacheEvict tương ứng ở đây.
    @Transactional
    @CacheEvict(value = {"tour_slug", "tour_id"}, allEntries = true)
    public void deleteTour(Long id) {
        tourRepository.deleteById(id);
    }
}
