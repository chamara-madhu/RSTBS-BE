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
  console.log({ buffer });
  console.log("aws.AWS_ACCESS_KEY", aws.AWS_ACCESS_KEY);
  const params = {
    Bucket: bucketName,
    Key: `${folder}/${uuidv4()}`,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read",
  };

  //   new Upload({ client, params })
  //     .done()
  //     .then((data) => {
  //       console.log({ data });
  //       //  form.emit('data', { name: "complete", value: data });
  //     })
  //     .catch((err) => {
  //       //  form.emit('error', err);
  //     });
  try {
    const data = await new Upload({ client, params }).done();
    //   const data = await client.send(new PutObjectCommand(params));

    console.log("Successfully uploaded data to " + bucketName);
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
