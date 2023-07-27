export const get404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Sahifa topilmadi',
  });
};

const sendErrorDev = (err, req, res) => {
  console.log(err);
  return res.status(err.statusCode).render('error', {
    pageTitle: 'Xatolik!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  res.status(err.statusCode).render('error', {
    pageTitle: 'Xatolik!',
    msg: "Xatolik sodir bo'ldi. Iltimos qaytadan urinib ko'ring",
  });
};
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, req, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }
};
