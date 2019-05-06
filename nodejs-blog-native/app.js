const querystring = require("querystring");
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");

//处理post data

const getPostData = req => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    if (req.headers["content-type"] !== "application/json") {
      resolve({});
      return;
    }
    let postData = "";
    req.on("data", chunk => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

const serverHandle = (req, res) => {
  res.setHeader("Content-type", "application/json");
  //获取path
  const url = req.url;
  req.path = url.split("?")[0];

  //解析query
  req.query = querystring.parse(url.split("?")[1]);
  getPostData(req).then(postData => {
    // console.log(postData);
    req.body = postData;
    // console.log(postData)
    // console.log(req.path);
    // console.log(req.method);

    //处理路由
    const blogData = handleBlogRouter(req, res);
    // console.log(blogData);
    if (blogData) {
      res.end(JSON.stringify(blogData));
      return;
    }
    const userData = handleUserRouter(req, res);
    if (userData) {
      res.end(JSON.stringify(userData));
      return;
    }
    //未命中
    res.writeHead(404, { "Content-type": "text/plain" });
    res.write("404 Not Found\n");
    res.end();
  });

  // const resData = {
  //     name:'kunkka',
  //     site:'blog',
  //     env:process.env.NODE_ENV
  // }
  // res.end(JSON.stringify(resData))
};

module.exports = serverHandle;
