
exports.handler = async (event) => {
  const { trackingId } = event.queryStringParameters;

  // In a real application, you would check your database to see if the
  // trackingId exists and has been opened.
  // For this example, we'll just return a random status.
  const isOpened = Math.random() > 0.5;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ opened: isOpened }),
  };
};
