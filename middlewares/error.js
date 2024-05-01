exports.notFound = (req, res, next) => {
  const error = new Error(`Not found ${req.originalUrl}`);
  res.status(404);
  next(error);
};

exports.errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((value) => value.message);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      success: false,
    });
  } else if (err.name === 'CastError') {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const message = `Resource not found`;
    res.status(statusCode);
    res.json({
      message: message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      success: false,
    });
  } else if (err.code === 11000) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const dupField = Object.keys(err.keyValue)[0];
    const message = `Duplicate field (${dupField}) value entered. Please use another value(${err.keyValue[dupField]})!`;
    res.status(statusCode);
    res.json({
      message: message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      success: false,
    });
  } else if (err.name === 'ApplicationError') {
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
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      success: false,
    });
  }
};
