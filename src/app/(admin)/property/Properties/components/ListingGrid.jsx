import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { resolvePhotoSrc } from "@/utils/imageStorage";
import { useState } from "react";
import { Card, CardBody, CardFooter, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const DEFAULT_ICON = "solar:home-2-broken";

const mapProperty = (item) => {
  const details = item?.propertyDetails ?? {};
  const villa = item?.villaData ?? {};
  const flat = item?.flatData ?? {};

  return {
    id: item?.propertyId,
    name: item?.buildingDetails || details.buildingName || `Property #${item?.propertyId}`,
    location: [details.city, details.country].filter(Boolean).join(", ") || item?.block || "—",
    image: resolvePhotoSrc(item?.photos?.[0]) || "",
    icon: DEFAULT_ICON,
    beds: villa.numberOfBedrooms ?? "—",
    bath: villa.numberOfBathrooms ?? flat.noOfBathrooms ?? "—",
    size: item?.dimensionAreaSqft ?? "—",
    flor: item?.floor || "—",
    price: details.monthlyRent ?? item?.expectedRent ?? "—",
    type: item?.rentalType || item?.rentalFor || "—",
    status: details.currentStatus || "—",
  };
};

const PropertiesCard = ({
  bath,
  beds,
  flor,
  size: ft,
  icon,
  location,
  name,
  price,
  image,
  status,
  id,
}) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const statusBadge = {
    Occupied: "bg-success",
    Vacant: "bg-danger",
    Booked: "bg-warning",
    "Under Maintenance": "bg-secondary",
  }[status] ?? "bg-secondary";
  const openDetails = () => {
    navigate(`/landlord/detailspage?property_id=${id}`, {
      state: {
        propertyId: id,
      },
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="position-relative">
        <button
          type="button"
          className="border-0 bg-transparent p-0 w-100"
          onClick={openDetails}
          aria-label={`Open ${name} details`}
        >
          {image && !imgError ? (
            <img
              src={image}
              alt="properties"
              className="img-fluid rounded-top w-100"
              style={{ cursor: "pointer", height: 180, objectFit: "cover" }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center rounded-top w-100"
              style={{ cursor: "pointer", height: 180, background: "#e9ecef" }}
            >
              <IconifyIcon icon="solar:home-2-bold-duotone" width={48} height={48} className="text-muted" />
            </div>
          )}
        </button>
        <span className="position-absolute top-0 end-0 p-1">
          <span className={`badge text-white fs-13 ${statusBadge}`}>
            {status}
          </span>
        </span>
      </div>
      <CardBody>
        <div className="d-flex align-items-center gap-2">
          <div className="avatar bg-light rounded flex-centered">
            <IconifyIcon
              icon={icon}
              width={24}
              height={24}
              className="fs-24 text-primary"
            />
          </div>
          <div>
            <Link to="" className="text-dark fw-medium fs-16">
              {name}
            </Link>
            <p className="text-muted mb-0">{location}</p>
          </div>
        </div>
        <Row className="mt-2 g-2">
          <Col lg={3} xs={3}>
            <span
              className="badge bg-light-subtle text-muted border fs-12
      d-flex align-items-center gap-1 w-100"
              style={{ padding: "8px 6px" }}
            >
              <IconifyIcon
                icon="solar:bed-broken"
                className="fs-14 flex-shrink-0"
              />
              <span className="text-nowrap">{beds} Bed</span>
            </span>
          </Col>
          <Col lg={3} xs={3}>
            <span
              className="badge bg-light-subtle text-muted border fs-12
      d-flex align-items-center gap-1 w-100"
              style={{ padding: "8px 6px" }}
            >
              <IconifyIcon
                icon="solar:bath-broken"
                className="fs-14 flex-shrink-0"
              />
              <span className="text-nowrap">{bath} Bath</span>
            </span>
          </Col>
          <Col lg={3} xs={3}>
            <span
              className="badge bg-light-subtle text-muted border fs-12
      d-flex align-items-center gap-1 w-100"
              style={{ padding: "8px 6px" }}
            >
              <IconifyIcon
                icon="solar:scale-broken"
                className="fs-14 flex-shrink-0"
              />
              <span className="text-nowrap">{ft} ft</span>
            </span>
          </Col>
          <Col lg={3} xs={3}>
            <span
              className="badge bg-light-subtle text-muted border fs-12
      d-flex align-items-center gap-1 w-100"
              style={{ padding: "8px 6px" }}
            >
              <IconifyIcon
                icon="solar:double-alt-arrow-up-broken"
                className="fs-14 flex-shrink-0"
              />
              <span className="text-nowrap">{flor} Floor</span>
            </span>
          </Col>
        </Row>
      </CardBody>
      <CardFooter className="bg-light-subtle d-flex justify-content-between align-items-center border-top">
        <p className="fw-medium text-dark fs-16 mb-0">{price === '—' ? '—' : `OMR ${price}.00`}</p>
        <div>
          <Link to="" className="link-primary fw-medium">
            More Inquiry{" "}
            <IconifyIcon icon="ri:arrow-right-line" className="align-middle" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
const ListingGrid = ({ properties = [], loading, error, presentPage = 1, totalPage = 1, goToPage = () => {} }) => {
  const propertiesData = properties.map(mapProperty);

  const pageNumbers = Array.from(
    { length: Math.min(totalPage, 5) },
    (_, i) => {
      const start = Math.max(1, Math.min(presentPage - 2, totalPage - 4));
      return start + i;
    },
  ).filter((n) => n >= 1 && n <= totalPage);

  return (
    <Col xl={9} lg={12}>
      {loading && <div className="text-center py-5">Loading properties...</div>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {!loading && !error && propertiesData.length === 0 && (
        <div className="text-center py-5">No properties found.</div>
      )}
      <Row>
        {!loading &&
          !error &&
          propertiesData.map((item) => (
            <Col lg={4} md={6} key={item.id}>
              <PropertiesCard {...item} />
            </Col>
          ))}
      </Row>
      {!loading && !error && totalPage > 1 && (
        <div className="p-3 border-top">
          <nav aria-label="Property pagination">
            <ul className="pagination justify-content-end mb-0">
              <li className={`page-item ${presentPage <= 1 ? "disabled" : ""}`}>
                <button type="button" className="page-link" onClick={() => goToPage(presentPage - 1)}>
                  Previous
                </button>
              </li>
              {pageNumbers.map((n) => (
                <li key={n} className={`page-item ${n === presentPage ? "active" : ""}`}>
                  <button type="button" className="page-link" onClick={() => goToPage(n)}>
                    {n}
                  </button>
                </li>
              ))}
              <li className={`page-item ${presentPage >= totalPage ? "disabled" : ""}`}>
                <button type="button" className="page-link" onClick={() => goToPage(presentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </Col>
  );
};
export default ListingGrid;
