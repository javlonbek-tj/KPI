export default function (req, res, next) {
  try {
    if (!req.user) {
      return res.redirect('/login');
    }
    next();
  } catch (err) {
    console.log(err);
  }
}
