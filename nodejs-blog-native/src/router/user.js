const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

const handleUserRouter = (req, res) => {
  const method = req.method;

  if (method === "GET" && req.path === "/api/user/login") {
    const { username, password } = req.query;
    const result = login(username, password);
    return result.then(data => {
      if (data.username) {
        // console.log(data.username)
        // console.log(data.realname)
        // console.log(req.session)
        req.session.username = data.username;
        req.session.realname = data.realname;
        // console.log(req.session.realname)
        console.log(req.session.username)
        return new SuccessModel({
          session:req.session
        });
      } else {
        return new ErrorModel("登录失败");
      }
    });

    // if (result) {
    //   return new SuccessModel();
    // } else {
    //   return new ErrorModel("登录失败");
    // }
  }

  if (method === "GET" && req.path === "/api/user/login-test") {
    console.log(req.session)
    console.log(req.session.username)
    if (req.session.username) {
      return Promise.resolve(
        new SuccessModel({
          session: req.session
        })
      );
    }
    return Promise.resolve(new ErrorModel("尚未登录"));
  }
};

module.exports = handleUserRouter;
