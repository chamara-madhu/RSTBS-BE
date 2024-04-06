const formidable = require("formidable");
const QRCode = require("qrcode");
const Application = require("../models/applicationModel");
const SeasonTicket = require("../models/seasonTicketModel");
const User = require("../models/userModel");
const { uploadFile } = require("../helpers/S3Helper");
const { readFileSync } = require("fs");
const { APPLICATION_STATUSES, FLOWS } = require("../config/constant");

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
            start: fields.start[0],
            end: fields.end[0],
          },
          amount: fields.amount[0],
          km: fields.km[0],
          flow: [
            {
              name: FLOWS.APPLY,
            },
          ],
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

exports.updateSeasonTicket = (req, res) => {
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

    console.log({ fields });

    Application.findOne({ _id: fields.applicationId[0] })
      .then((application) => {
        application.fullName = fields.fullName[0];
        application.address = fields.address[0];
        application.nic = fields.nic[0];
        application.phone = fields.phone[0];
        application.stations = {
          origin: fields.origin[0],
          destination: fields.destination[0],
        };
        application.duration = {
          start: fields.start[0],
          end: fields.end[0],
        };

        if (files?.nicFS?.length) {
          application.nicImages.fs = nicImages.fs;
        }

        if (files?.nicBS?.length) {
          application.nicImages.bs = nicImages.bs;
        }

        if (files?.gnCert?.length) {
          application.gnCertificate = gnCertificate;
        }

        // save to database
        application
          .save()
          .then(() => {
            SeasonTicket.findOne({ _id: fields.seasonTicketId[0] })
              .then((sTicket) => {
                sTicket.duration = {
                  start: fields.start[0],
                  end: fields.end[0],
                };
                sTicket.amount = fields.amount[0];
                sTicket.km = fields.km[0];
                sTicket.status = APPLICATION_STATUSES.APPLICATION_PENDING;
                sTicket.flow = [
                  ...sTicket.flow,
                  {
                    name: FLOWS.APPLICATION_RE_SUBMITTED,
                  },
                ];

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
              })
              .catch((err) => {
                console.log(err);
                res.status(400).json({
                  code: 1000,
                  message: "Season ticket cannot find",
                });
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({
              code: 1000,
              message: "Application is not updated successfully",
            });
          });
      })
      .catch((err) => console.log(err));
  });
};

exports.acceptOrRejectApplication = (id, status, note, res) => {
  SeasonTicket.findOne({ _id: id })
    .exec()
    .then((sTicket) => {
      sTicket.status = status;

      if (status === APPLICATION_STATUSES.APPLICATION_REJECTED) {
        sTicket.note = note;
        sTicket.flow = [
          ...sTicket.flow,
          {
            name: FLOWS.APPLICATION_REJECTED,
            note: note,
          },
        ];
      } else {
        sTicket.note = null;
        sTicket.flow = [
          ...sTicket.flow,
          {
            name: FLOWS.APPLICATION_APPROVED,
          },
        ];
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
        sTicket.flow = [
          ...sTicket.flow,
          {
            name: FLOWS.BANK_DEPOSIT_SLIP_UPLOADED_FOR_APPROVAL,
          },
        ];

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
  console.log({ id, status, note });
  SeasonTicket.findOne({ _id: id })
    .then((sTicket) => {
      sTicket.status = status;

      if (status === APPLICATION_STATUSES.PAYMENT_REJECTED) {
        sTicket.note = note;
        sTicket.flow = [
          ...sTicket.flow,
          {
            name: FLOWS.PAYMENT_REJECTED,
            note,
          },
        ];
      } else {
        sTicket.note = null;
        sTicket.flow = [
          ...sTicket.flow,
          {
            name: FLOWS.PAYMENT_APPROVED,
          },
          {
            name: FLOWS.SEASON_TICKET_ACTIVATED_AND_QR_GENERATED,
          },
        ];
      }

      sTicket
        .save()
        .then(() => {
          if (status === APPLICATION_STATUSES.ACTIVE) {
            console.log("sTicket.userId", sTicket.userId);
            console.log("sTicket.userId", sTicket.userId.toString());
            this.generateQRCode(sTicket.userId.toString(), res);
          } else {
            res.status(200).json("Payment rejected");
          }
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.generateQRCode = async (userId, res) => {
  try {
    console.log({ userId });
    // Generate QR code data URL
    const qrDataUrl = await QRCode.toDataURL(userId, {
      width: 500,
      height: 500,
    });

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
