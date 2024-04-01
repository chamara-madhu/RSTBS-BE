const express = require("express");
const router = express.Router();
const applicationController = require("../../controllers/applicationController");
const { isPassenger, isAuth, isAdmin } = require("../../auth-middleware/check");

router.post(
  "/apply",
  isAuth,
  isPassenger,
  applicationController.applyForSeasonTicket
);

router.put(
  "/update",
  isAuth,
  isPassenger,
  applicationController.updateSeasonTicket
);

router.post(
  "/accept-or-reject-application",
  isAuth,
  isAdmin,
  applicationController.acceptOrRejectApplication
);

router.get("/", isAuth, isAdmin, applicationController.getAllApplications);

router.get(
  "/all-pending-applications",
  isAuth,
  isAdmin,
  applicationController.getPendingApplications
);

router.get(
  "/all-pending-payment-approvals",
  isAuth,
  isAdmin,
  applicationController.getPendingPaymentApprovals
);

router.get(
  "/pending-application/:id",
  isAuth,
  isAdmin,
  applicationController.getAnApplicationForReview
);

router.get(
  "/pending-payment-approval/:id",
  isAuth,
  isAdmin,
  applicationController.getAnApplicationForPaymentApprovalReview
);

router.get("/:id", isAuth, applicationController.getAnApplication);

router.get(
  "/payment-info/:id",
  isAuth,
  isPassenger,
  applicationController.getPendingPaymentInfo
);

router.post(
  "/upload-bank-slips",
  isAuth,
  isPassenger,
  applicationController.uploadBankSlip
);

router.post(
  "/accept-or-reject-payment-approval",
  isAuth,
  isAdmin,
  applicationController.acceptOrRejectPayment
);

// router.post(
//   "/generate-qr-code",
//   isAuth,
//   //   isAdmin,
//   applicationController.generateQRCode
// );

module.exports = router;
