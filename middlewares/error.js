const notFound = (req, res, next) => {
  const error = new Error(`Not found ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, _req, res, next) => {
  if (err.name === 'ApplicationError') {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: Object.values(err.message)[0],
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      success: false,
    });
  } else {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message || err,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      success: false,
    });
  }
};

module.exports = { notFound, errorHandler };
