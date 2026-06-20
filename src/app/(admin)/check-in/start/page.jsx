import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import CheckInInformationForm from "../views/check-in-information/CheckInInformationForm.jsx";
import OverviewEditDetailsPage from "../views/check-in-information/edit-detail-page/OverviewEditDetailsPage.jsx";
import TenantDetailsEditDetailsPage from "../views/check-in-information/edit-detail-page/TenantDetailsEditDetailsPage.jsx";
import PropertyDetailsEditDetailsPage from "../views/check-in-information/edit-detail-page/PropertyDetailsEditDetailsPage.jsx";
import InspectionEditDetailsPage from "../views/check-in-information/edit-detail-page/InspectionEditDetailsPage.jsx";
import RepairApprovalEditDetailsPage from "../views/check-in-information/edit-detail-page/RepairApprovalEditDetailsPage.jsx";
import UtilityReadingsEditDetailsPage from "../views/check-in-information/edit-detail-page/UtilityReadingsEditDetailsPage.jsx";
import AgreementEditDetailsPage from "../views/check-in-information/edit-detail-page/AgreementEditDetailsPage.jsx";
import KeyHandoverEditDetailsPage from "../views/check-in-information/edit-detail-page/KeyHandoverEditDetailsPage.jsx";
import DocumentsEditDetailsPage from "../views/check-in-information/edit-detail-page/DocumentsEditDetailsPage.jsx";

const sectionMap = {
  "check-in-information": OverviewEditDetailsPage,
  "tenant-details": TenantDetailsEditDetailsPage,
  "property-details": PropertyDetailsEditDetailsPage,
  "property-inspection": InspectionEditDetailsPage,
  "repair-approval": RepairApprovalEditDetailsPage,
  "utility-meter-readings": UtilityReadingsEditDetailsPage,
  "agreement-details": AgreementEditDetailsPage,
  "key-handover": KeyHandoverEditDetailsPage,
  "documents-upload": DocumentsEditDetailsPage,
};

const CheckInStart = () => {
  const location = useLocation();
  const hashKey = location.hash?.slice(1);

  const ActiveComponent = useMemo(
    () => sectionMap[hashKey] ?? CheckInInformationForm,
    [hashKey],
  );

  return <ActiveComponent />;
};

export default CheckInStart;
