// ============================================
// PHARMACY SERVICE - TÌM HIỆU THUỐC
// ============================================

// ============================================
// 1. GEOCODING - Chuyển địa chỉ → tọa độ
// ============================================

export async function geocodeAddress(address) {
  // Nếu không có địa chỉ, dùng mặc định TP.HCM
  if (!address || address.trim() === '') {
    console.log('ℹ️ No address, using default location (TP.HCM)');
    return { lat: 10.8231, lon: 106.6297 };
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    
    const response = await fetch(url, {
      headers: { 'User-Agent': 'ThuocVietApp/1.0' }
    });

    const data = await response.json();
    
    if (data && data.length > 0) {
      const coords = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
      console.log('✅ Geocoded:', coords);
      return coords;
    }
    
    // Không tìm thấy → dùng mặc định
    console.log('⚠️ Address not found, using default');
    return { lat: 10.8231, lon: 106.6297 };
    
  } catch (error) {
    console.error('❌ Geocoding error:', error);
    return { lat: 10.8231, lon: 106.6297 };
  }
}

// ============================================
// 2. TÌM HIỆU THUỐC GẦN - Overpass API
// ============================================

export async function findNearbyPharmacies(lat, lon) {
  try {
    const radius = 2000; // 2km
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="pharmacy"](around:${radius},${lat},${lon});
        way["amenity"="pharmacy"](around:${radius},${lat},${lon});
      );
      out body;
      >;
      out skel qt;
    `;

    console.log('🏥 Searching pharmacies near:', lat, lon);

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    const data = await response.json();
    
    // Không tìm thấy → dùng fallback
    if (!data.elements || data.elements.length === 0) {
      console.log('⚠️ No pharmacies found via API, using fallback');
      return getFallbackPharmacies();
    }

    // Parse dữ liệu
    const pharmacies = data.elements
      .filter(el => el.tags && el.tags.name)
      .map(el => {
        const pharmLat = el.lat || el.center?.lat;
        const pharmLon = el.lon || el.center?.lon;
        
        if (!pharmLat || !pharmLon) return null;

        const distance = calculateDistance(lat, lon, pharmLat, pharmLon);
        
        return {
          name: el.tags.name || 'Nhà thuốc',
          address: buildAddress(el.tags),
          distance: `${distance.toFixed(1)} km`,
          rating: (4.0 + Math.random() * 0.9).toFixed(1), // Random rating
          phone: el.tags.phone || 'N/A',
          distanceKm: distance // Để sort
        };
      })
      .filter(p => p !== null)
      .sort((a, b) => a.distanceKm - b.distanceKm) // Sắp xếp theo khoảng cách
      .slice(0, 5); // Lấy 5 gần nhất

    console.log('✅ Found', pharmacies.length, 'pharmacies');
    return pharmacies.length > 0 ? pharmacies : getFallbackPharmacies();

  } catch (error) {
    console.error('❌ Find pharmacies error:', error);
    return getFallbackPharmacies();
  }
}

// ============================================
// 3. HELPER FUNCTIONS
// ============================================

// Tính khoảng cách giữa 2 điểm (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Khoảng cách (km)
}

// Xây dựng địa chỉ từ tags
function buildAddress(tags) {
  const parts = [];
  
  if (tags['addr:housenumber']) {
    parts.push(tags['addr:housenumber']);
  }
  
  if (tags['addr:street']) {
    parts.push(tags['addr:street']);
  }
  
  if (tags['addr:quarter'] || tags['addr:suburb']) {
    parts.push(tags['addr:quarter'] || tags['addr:suburb']);
  }
  
  if (tags['addr:district']) {
    parts.push(tags['addr:district']);
  }
  
  if (tags['addr:city'] || tags['addr:province']) {
    parts.push(tags['addr:city'] || tags['addr:province'] || 'TP.HCM');
  } else {
    parts.push('TP.HCM');
  }
  
  if (parts.length === 0 && tags['addr:full']) {
    return tags['addr:full'];
  }
  
  return parts.length > 0 ? parts.join(', ') : 'Địa chỉ chưa cập nhật (xem trên bản đồ)';
}

// Hiệu thuốc mặc định (khi API fail)
function getFallbackPharmacies() {
  return [
    {
      name: 'Nhà thuốc Pharmacity',
      address: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
      distance: '0.8 km',
      rating: '4.5',
      phone: '1800 6821'
    },
    {
      name: 'Nhà thuốc Long Châu FPT',
      address: '456 Lê Văn Việt, Q.9, TP.HCM',
      distance: '1.2 km',
      rating: '4.7',
      phone: '1800 6928'
    },
    {
      name: 'Nhà thuốc An Khang',
      address: '789 Võ Văn Tần, Q.3, TP.HCM',
      distance: '1.5 km',
      rating: '4.3',
      phone: '028 3930 1234'
    }
  ];
}