import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import CheckOutInformationForm from "../views/check-out-information/CheckOutInformationForm";
import OverviewEditDetailsPage from "../views/check-out-information/edit-detail-page/OverviewEditDetailsPage.jsx";
import TenantDetailsEditDetailsPage from "../views/check-out-information/edit-detail-page/TenantDetailsEditDetailsPage.jsx";
import PropertyDetailsEditDetailsPage from "../views/check-out-information/edit-detail-page/PropertyDetailsEditDetailsPage.jsx";
import InspectionEditDetailsPage from "../views/check-out-information/edit-detail-page/InspectionEditDetailsPage.jsx";
import RepairApprovalEditDetailsPage from "../views/check-out-information/edit-detail-page/RepairApprovalEditDetailsPage.jsx";
import UtilityReadingsEditDetailsPage from "../views/check-out-information/edit-detail-page/UtilityReadingsEditDetailsPage.jsx";
import FinanceEditDetailsPage from "../views/check-out-information/edit-detail-page/FInancePage.jsx";
import KeyHandoverEditDetailsPage from "../views/check-out-information/edit-detail-page/KeyHandoverEditDetailsPage.jsx";
import DocumentsEditDetailsPage from "../views/check-out-information/edit-detail-page/DocumentsEditDetailsPage.jsx";

const sectionMap = {
  "check-out-information": OverviewEditDetailsPage,
  "tenant-details": TenantDetailsEditDetailsPage,
  "property-details": PropertyDetailsEditDetailsPage,
  "property-inspection": InspectionEditDetailsPage,
  "repair-damage": RepairApprovalEditDetailsPage,
  "utility-meter-readings": UtilityReadingsEditDetailsPage,
  "finance-details": FinanceEditDetailsPage,
  "key-handover": KeyHandoverEditDetailsPage,
  "documents-upload": DocumentsEditDetailsPage,
};

const CheckOutStart = () => {
  const location = useLocation();
  const hashKey = location.hash?.slice(1);

  const ActiveComponent = useMemo(
    () => sectionMap[hashKey] ?? CheckOutInformationForm,
    [hashKey],
  );

  return <ActiveComponent />;
};

export default CheckOutStart;
