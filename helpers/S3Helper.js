const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { v4: uuidv4 } = require("uuid");
const { aws } = require("../config/aws");

const client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: aws.AWS_ACCESS_KEY,
    secretAccessKey: aws.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = aws.S3_BUCKET_NAME;

exports.uploadFile = async (folder, buffer, contentType) => {
  const params = {
    Bucket: bucketName,
    Key: `${folder}/${uuidv4()}`,
    Body: buffer,
    ContentType: contentType,
    // ACL: "public-read",
  };
  try {
    const data = await new Upload({ client, params }).done();
    return data?.Key || "";
  } catch (err) {
    console.log("Error uploading file:", err);
    throw err;
  }
};

exports.getFile = async (key) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const { Body } = await client.send(new GetObjectCommand(params));
    console.log({ Body });
    // const fileStream = fs.createWriteStream(filePath);
    // await new Promise((resolve, reject) => {
    //     Body.pipe(fileStream);
    //     Body.on("error", reject);
    //     fileStream.on("finish", resolve);
    // });
    // console.log(`File downloaded successfully to ${filePath}`);
  } catch (error) {
    console.error("Error downloading file from S3:", error);
  }
};
