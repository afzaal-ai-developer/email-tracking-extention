
exports.handler = async (event) => {
  console.log("Email opened:", event.queryStringParameters);
  // In a real application, you would store this information in a database.
  // For this example, we'll just log it to the console.

  const gifData = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "image/gif",
      "Content-Length": gifData.length,
    },
    body: gifData.toString("base64"),
    isBase64Encoded: true,
  };
};


