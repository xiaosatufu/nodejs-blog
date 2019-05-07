const querystring = require("querystring");
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");


//获取cookie过期时间
const getCookieExpores = () =>{
  const d = new Date()
  d.setTime(d.getTime()+(24*60*60*1000))
  return d.toGMTString()
}
const SESSION_DATA = {};
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

  //解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || "";
  cookieStr.split(";").forEach(item => {
    if (!item) {
      return;
    }
    const arr = item.split("=");
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
  });

  //解析session
  let needSetCookie = false
  let userId = req.cookie.userid;
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {};
    }
  } else {
    needSetCookie = true
    userId = Date.now();
    SESSION_DATA[userId] = {};
  }
  req.session = SESSION_DATA[userId];
  console.log(SESSION_DATA)
  console.log(req.session)

  getPostData(req).then(postData => {
    // console.log(postData);
    req.body = postData;
    // console.log(postData)
    // console.log(req.path);
    // console.log(req.method);

    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie',`userid=${userId};path=/;httpOnly;expires=${getCookieExpores()}`)
        }
        res.end(JSON.stringify(blogData));
      });
      return;
    }

    //处理路由
    // const blogData = handleBlogRouter(req, res);
    // // console.log(blogData);
    // if (blogData) {
    //   res.end(JSON.stringify(blogData));
    //   return;
    // }
    // const userData = handleUserRouter(req, res);
    // if (userData) {
    //   res.end(JSON.stringify(userData));
    //   return;
    // }

    const userResult = handleUserRouter(req, res);
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie',`userid=${userId};path=/;httpOnly;expires=${getCookieExpores()}`)
        }
        res.end(JSON.stringify(userData));
      });
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
