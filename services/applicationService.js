const formidable = require("formidable");
const QRCode = require("qrcode");
const Application = require("../models/applicationModel");
const SeasonTicket = require("../models/seasonTicketModel");
const User = require("../models/userModel");
const { uploadFile } = require("../helpers/S3Helper");
const { readFileSync } = require("fs");
const { APPLICATION_STATUSES } = require("../config/constant");

exports.applyForSeasonTicket = (req, res) => {
  const form = new formidable.IncomingForm({
    keepExtensions: true,
    allowEmptyFiles: false,
  });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({
        code: 1000,
        message: err,
      });
    }

    let nicImages = {
      fs: "",
      bs: "",
    };
    let gnCertificate = "";

    if (files?.nicFS?.length) {
      try {
        const file = files.nicFS[0];
        const fileStream = readFileSync(file.filepath);
        const key = await uploadFile("nic", fileStream, file.mimetype);

        console.log({ key });
        nicImages.fs = key;
      } catch (err) {
        console.log(err);
      }
    }

    if (files?.nicBS?.length) {
      try {
        const file = files.nicBS[0];
        const fileStream = readFileSync(file.filepath);
        const key = await uploadFile("nic", fileStream, file.mimetype);

        console.log({ key });
        nicImages.bs = key;
      } catch (err) {
        console.log(err);
      }
    }

    if (files?.gnCert?.length) {
      try {
        const file = files.gnCert[0];
        const fileStream = readFileSync(file.filepath);
        const key = await uploadFile("gnc", fileStream, file.mimetype);

        console.log({ key });
        gnCertificate = key;
      } catch (err) {
        console.log(err);
      }
    }

    // create new application
    const application = new Application({
      fullName: fields.fullName[0],
      address: fields.address[0],
      nic: fields.nic[0],
      phone: fields.phone[0],
      stations: {
        origin: fields.origin[0],
        destination: fields.destination[0],
      },
      duration: {
        start: fields.start[0],
        end: fields.end[0],
      },
      nicImages: nicImages,
      gnCertificate,
    });

    // save to database
    application
      .save()
      .then((data) => {
        const sTicket = new SeasonTicket({
          userId: req.user.id,
          applicationId: data._id,
          duration: {
            start: "2024-02-05",
            end: "2024-05-05",
          },
          amount: 1000,
        });

        // save to database
        sTicket
          .save()
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({
              code: 1000,
              message: "Season ticket is not added successfully",
            });
          });

        // sendMailHelper(
        //   res,
        //   "articustomercare@gmail.com",
        //   "New ad has been created",
        //   body
        // )
        //   .then(() => {
        //     console.log("mail sent");
        //   })
        //   .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          code: 1000,
          message: "Application is not added successfully",
        });
      });
  });
};

exports.acceptOrRejectApplication = (id, status, note, res) => {
  SeasonTicket.findOne({ _id: id })
    .exec()
    .then((sTicket) => {
      sTicket.status = status;

      if (status === APPLICATION_STATUSES.APPLICATION_REJECTED) {
        sTicket.note = note;
      } else {
        sTicket.note = null;
      }

      sTicket
        .save()
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.getAllApplications = (res) => {
  Application.find()
    .exec()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.getPendingApplications = (res) => {
  SeasonTicket.find({ status: APPLICATION_STATUSES.APPLICATION_PENDING })
    .populate("applicationId", "fullName nic stations")
    .select("amount duration")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.getPendingPaymentApprovals = (res) => {
  SeasonTicket.find({ status: APPLICATION_STATUSES.PAYMENT_APPROVAL_PENDING })
    .populate("applicationId", "fullName nic stations")
    .select("amount duration")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.getAnApplicationForReview = (id, res) => {
  SeasonTicket.findOne({
    _id: id,
    status: APPLICATION_STATUSES.APPLICATION_PENDING,
  })
    .populate(
      "applicationId",
      "fullName address nic phone stations nicImages gnCertificate"
    )
    .select(
      "-bankSlipImage -isApplicationResubmission -isPaymentResubmission -createdAt -updatedAt -__v"
    )
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.getAnApplicationForPaymentApprovalReview = (id, res) => {
  SeasonTicket.findOne({
    _id: id,
    status: APPLICATION_STATUSES.PAYMENT_APPROVAL_PENDING,
  })
    .populate("applicationId", "fullName")
    .select("bankSlipImage amount")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.myBookingHistory = (userId, res) => {
  SeasonTicket.find({ userId })
    .populate("applicationId", "stations")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.getAnApplication = (id, res) => {
  Application.findOne({ _id: id })
    .select("-__v -updatedAt")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.getPendingPaymentInfo = (id, res) => {
  SeasonTicket.findOne({ _id: id })
    .select("_id amount")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.uploadBankSlip = (req, res) => {
  const form = new formidable.IncomingForm({
    keepExtensions: true,
    allowEmptyFiles: false,
  });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({
        code: 1000,
        message: err,
      });
    }

    let bankSlipImage = "";

    if (files?.bankSlip?.length) {
      try {
        const file = files.bankSlip[0];
        const fileStream = readFileSync(file.filepath);
        const key = await uploadFile("bankSlips", fileStream, file.mimetype);

        bankSlipImage = key;
      } catch (err) {
        console.log(err);
      }
    }

    SeasonTicket.findOne({ _id: fields.id[0] })
      .exec()
      .then((sTicket) => {
        sTicket.status = fields.status[0];
        sTicket.bankSlipImage = bankSlipImage;

        sTicket
          .save()
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });
};

exports.acceptOrRejectPayment = (id, status, note, res) => {
  SeasonTicket.findOne({ _id: id })
    .populate("userId", "nic")
    .then((sTicket) => {
      sTicket.status = status;

      if (status === APPLICATION_STATUSES.PAYMENT_REJECTED) {
        sTicket.note = note;
      } else {
        sTicket.note = null;
      }

      console.log({ sTicket });

      sTicket
        .save()
        .then(() => {
          generateQRCode(sTicket.userId.nic, res);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const generateQRCode = async (nic, res) => {
  try {
    console.log({ nic });
    // Generate QR code data URL
    const qrDataUrl = await QRCode.toDataURL(nic, {
      width: 500,
      height: 500,
    });
    console.log({ qrDataUrl });

    // Extract base64 data from data URL
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");

    // Convert base64 to binary buffer
    const binaryData = Buffer.from(base64Data, "base64");

    const key = await uploadFile("qr", binaryData, "image/png");

    console.log({ key });

    User.findOne({ _id: userId })
      .then((user) => {
        user.qr = key;

        user
          .save()
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({
              code: 1000,
              message: "User QR is not updated successfully",
            });
          });
      })
      .catch((err) => {
        console.log({ err });
      });
  } catch (error) {
    console.error("Error generating or saving QR code:", error);
  }
};
