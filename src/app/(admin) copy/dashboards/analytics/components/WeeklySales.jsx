// src/app/(admin)/dash/an/components/WeeklySales.jsx

import ReactApexChart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';
import {
  Button, Card, CardBody, CardFooter, CardHeader, CardTitle,
  Carousel, CarouselItem, Col, Spinner,
} from 'react-bootstrap';
import { salesOptions } from '../data';

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220' viewBox='0 0 400 220'%3E%3Crect width='400' height='220' fill='%23eef2f7'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='%23aab8c5'%3ENo Image%3C/text%3E%3C/svg%3E";

// ── Base URL for media files ──────────────────────────────────────────────────
const MEDIA_BASE = 'https://essdemo.alwijha.net';

// ── Helper: convert relative path → full URL ─────────────────────────────────
function resolvePhotoUrl(raw) {
  if (!raw || typeof raw !== 'string') return PLACEHOLDER_IMG;
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;   // already absolute
  if (raw.startsWith('data:')) return raw;                                    // base64
  // relative path like "/media/property_photos/..."
  return `${MEDIA_BASE}${raw.startsWith('/') ? '' : '/'}${raw}`;
}

const WeeklySales = ({
  weeklyProperties = [],
  totalRented      = 0,
  dailyRentedData  = [0, 0, 0, 0, 0, 0, 0],
  loading          = false,
}) => {
  const navigate = useNavigate();

  // ── Build carousel slides ──────────────────────────────────────────────
  const slides = weeklyProperties.map((prop) => {
    // Pick first available photo and resolve to full URL
    let photoUrl = PLACEHOLDER_IMG;
    if (Array.isArray(prop.photos) && prop.photos.length > 0) {
      const first = prop.photos[0];
      const raw = typeof first === 'string'
        ? first
        : first?.url || first?.photo_url || first?.image || null;
      photoUrl = resolvePhotoUrl(raw);
    }

    const caption =
      prop.buildingDetails                ||
      prop.propertyDetails?.building_name ||
      prop.block                           ||
      '';
    const status =
      prop.propertyDetails?.current_status ||
      prop.currentStatus                   ||
      '';
    return { photoUrl, caption, status };
  });

  const carouselSlides = slides.length > 0
    ? slides
    : [{ photoUrl: PLACEHOLDER_IMG, caption: '', status: '' }];

  // ── Dynamic bar chart — highlight peak day ─────────────────────────────
  const maxVal = Math.max(...dailyRentedData, 1);
  const dynamicColors = dailyRentedData.map((v) =>
    v === maxVal && maxVal > 0 ? '#604ae3' : '#d8dff5'
  );

  const dynamicSalesOptions = {
    ...salesOptions,
    colors: dynamicColors,
  };
  const dynamicSeries = [{ name: 'Properties Rented', data: dailyRentedData }];

  return (
    <Col xl={3} lg={6}>
      <Card style={{ height: '510px' }}>
        <CardHeader>
          <CardTitle as="h4">Weekly Sales</CardTitle>
        </CardHeader>

        <CardBody className="p-2">
          {/* ── Carousel ─────────────────────────────────────────────── */}
          {loading ? (
            <div
              className="d-flex align-items-center justify-content-center rounded"
              style={{ height: '220px', backgroundColor: '#eef2f7' }}
            >
              <Spinner animation="border" variant="primary" size="sm" />
            </div>
          ) : (
            <Carousel
              indicators={false}
              id="weeklySalesCarousel"
              className="slide"
              data-bs-ride="carousel"
              style={{ borderRadius: '8px', overflow: 'hidden' }}
            >
              {carouselSlides.map((slide, idx) => (
                <CarouselItem key={idx} className={idx === 0 ? 'active' : ''}>
                  <img
                    src={slide.photoUrl}
                    width={327}
                    height={220}
                    className="d-block w-100 rounded"
                    alt={slide.caption || `property-${idx + 1}`}
                    style={{ objectFit: 'cover', height: '220px' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }}
                  />
                  {slide.caption && (
                    <div style={{
                      position: 'absolute', bottom: 8, left: 8,
                      background: 'rgba(0,0,0,0.55)', color: '#fff',
                      fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
                      maxWidth: '80%', whiteSpace: 'nowrap',
                      overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {slide.caption}
                      {slide.status && (
                        <span style={{
                          marginLeft: 6,
                          background: slide.status === 'Occupied' ? '#47ad94'
                            : slide.status === 'Vacant' ? '#604ae3' : '#f0a500',
                          color: '#fff', fontSize: '10px',
                          padding: '1px 5px', borderRadius: '3px',
                        }}>
                          {slide.status}
                        </span>
                      )}
                    </div>
                  )}
                </CarouselItem>
              ))}
            </Carousel>
          )}

          {/* ── Bar Chart ─────────────────────────────────────────────── */}
          <ReactApexChart
            key={JSON.stringify(dailyRentedData)}
            options={dynamicSalesOptions}
            series={dynamicSeries}
            height={120}
            type="bar"
            className="apex-charts mt-3"
          />
        </CardBody>

        <CardFooter className="border-top d-flex align-items-center justify-content-between">
          <p className="text-muted fw-medium fs-15 mb-0">
            <span className="text-dark me-1">Total Property Rented :</span>
            {loading
              ? <span className="text-muted">…</span>
              : <span className="text-primary fw-semibold">{Number(totalRented).toLocaleString()}</span>
            }
          </p>
          <Button variant="primary" size="sm" onClick={() => navigate('/landlord/property-grid')}>
            View More
          </Button>
        </CardFooter>
      </Card>
    </Col>
  );
};

export default WeeklySales;