import IconifyIcon from "@/components/wrappers/IconifyIcon";
import api from "@/helpers/api";
import { propertyData } from "@/assets/data/other";
import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const propertyStatuses = [
  "Rented",
  "Vacant",
  "Rented",
  "Rented",
  "Vacant",
  "Rented",
];

const getFirstValue = (item, keys, fallback = "") => {
  for (const key of keys) {
    if (
      item?.[key] !== undefined &&
      item?.[key] !== null &&
      item?.[key] !== ""
    ) {
      return item[key];
    }
  }

  return fallback;
};

const getPropertiesFromResponse = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.data?.data)) return responseData.data.data;
  if (Array.isArray(responseData?.results)) return responseData.results;
  if (Array.isArray(responseData?.properties)) return responseData.properties;
  if (Array.isArray(responseData?.property)) return responseData.property;

  return [];
};

const getPropertyImage = (item, fallbackImage) => {
  const image = getFirstValue(
    item,
    [
      "image",
      "photo",
      "property_image",
      "propertyImage",
      "thumbnail",
      "cover_image",
    ],
    "",
  );

  if (
    !image ||
    ["string", "n/a", "na", "null", "undefined"].includes(
      String(image).trim().toLowerCase(),
    )
  ) {
    return fallbackImage;
  }

  if (typeof image === "string" && image.startsWith("/")) {
    return `http://essdemo.alwijha.net${image}`;
  }

  if (typeof image === "string" && !image.startsWith("http")) {
    return `http://essdemo.alwijha.net/${image.replace(/^\/+/, "")}`;
  }

  return image;
};

const getApiErrorMessage = (err) => {
  const data = err?.response?.data;
  const status = err?.response?.status;

  if (status === 401) {
    return "Session expired. Please sign in again.";
  }

  if (typeof data === "string") {
    if (data.includes("AnonymousUser")) {
      return "Authentication token missing or invalid. Please set a valid token in localStorage.";
    }

    if (data.toLowerCase().includes("token has expired")) {
      return "Session expired. Please sign in again.";
    }

    if (data.includes("<!DOCTYPE html>")) {
      return "Server error while loading properties. Please check the API response in Network tab.";
    }

    return data;
  }

  const message = data?.message || data?.detail || data?.error;
  if (
    typeof message === "string" &&
    message.toLowerCase().includes("token has expired")
  ) {
    return "Session expired. Please sign in again.";
  }

  if (typeof message === "string") {
    return message;
  }

  return err?.message || "Unable to load properties.";
};

const mapProperty = (item, idx) => {
  const fallbackProperty = propertyData[idx % propertyData.length];

  return {
    id: getFirstValue(
      item,
      ["id", "property_id", "propertyId"],
      fallbackProperty.id,
    ),
    name: getFirstValue(
      item,
      ["name", "title", "property_name", "propertyName", "buildingDetails"],
      fallbackProperty.name,
    ),
    location: getFirstValue(
      item,
      ["location", "address", "property_location", "propertyLocation", "block"],
      fallbackProperty.location,
    ),
    image: getPropertyImage(item, fallbackProperty.image),
    icon: getFirstValue(item, ["icon"], fallbackProperty.icon),
    beds: getFirstValue(
      item,
      ["beds", "bedrooms", "bedroom", "no_of_bedrooms"],
      fallbackProperty.beds,
    ),
    bath: getFirstValue(
      item,
      ["bath", "baths", "bathrooms", "bathroom", "no_of_bathrooms"],
      fallbackProperty.bath,
    ),
    size: getFirstValue(
      item,
      [
        "size",
        "area",
        "property_size",
        "square_feet",
        "sqft",
        "dimensionAreaSqft",
      ],
      fallbackProperty.size,
    ),
    flor: getFirstValue(
      item,
      ["flor", "floor", "floors", "no_of_floors"],
      fallbackProperty.flor,
    ),
    price: getFirstValue(
      item,
      ["price", "rent", "amount", "monthly_rent", "expectedRent"],
      fallbackProperty.price,
    ),
    type: getFirstValue(
      item,
      ["type", "property_for", "listing_type", "rentalType", "rentalFor"],
      fallbackProperty.type,
    ),
    status: getFirstValue(
      item,
      ["status", "property_status"],
      propertyStatuses[idx % propertyStatuses.length],
    ),
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
  type,
  image,
  status,
  id,
}) => {
  const navigate = useNavigate();
  const isVacant = status === "Vacant";
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
          <img
            src={image}
            alt="properties"
            className="img-fluid rounded-top w-100"
            style={{ cursor: "pointer" }}
          />
        </button>
        <span className="position-absolute top-0 start-0 p-1"></span>
        <span className="position-absolute top-0 end-0 p-1">
          <span
            className={`badge text-white fs-13 ${isVacant ? "bg-danger" : "bg-success"}`}
          >
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
        <br></br>
        <p>Landlord : Ali Shaikh | Tenant Assigned : Zara Hamilton</p>
      </CardBody>
      <CardFooter className="bg-light-subtle d-flex justify-content-between align-items-center border-top">
        {type == "" ? (
          <p className="fw-medium text-muted text-decoration-line-through fs-16 mb-0">
            {}.00{" "}
          </p>
        ) : (
          <p className="fw-medium text-dark fs-16 mb-0">OMR {price}.00 </p>
        )}
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
const ListingGrid = () => {
  const [propertiesData, setPropertiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/property/get_all/");
        const properties = getPropertiesFromResponse(response.data).map(
          mapProperty,
        );

        setPropertiesData(properties);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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
          propertiesData?.map((item, idx) => (
            <Col lg={4} md={6} key={item.id ?? idx}>
              <PropertiesCard
                {...item}
                status={
                  item.status ?? propertyStatuses[idx % propertyStatuses.length]
                }
              />
            </Col>
          ))}
      </Row>
      <div className="p-3 border-top">
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-end mb-0">
            <li className="page-item">
              <Link className="page-link" to="">
                Previous
              </Link>
            </li>
            <li className="page-item active">
              <Link className="page-link" to="">
                1
              </Link>
            </li>
            <li className="page-item">
              <Link className="page-link" to="">
                2
              </Link>
            </li>
            <li className="page-item">
              <Link className="page-link" to="">
                3
              </Link>
            </li>
            <li className="page-item">
              <Link className="page-link" to="">
                Next
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </Col>
  );
};
export default ListingGrid;
