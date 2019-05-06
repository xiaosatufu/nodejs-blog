const getList = (anthor, keyword) => {
  return [
    {
      id: 1,
      title: "标题A",
      content: "内容A",
      createTime: 1557114267400,
      author: "张三"
    },

    {
      id: 2,
      title: "标题B",
      content: "内容B",
      createTime: 1557114267411,
      author: "李四"
    }
  ];
};

const getDetail = id => {
  return [
    {
      id: 1,
      title: "标题A",
      content: "内容A",
      createTime: 1557114267400,
      author: "张三"
    }
  ];
};

const newBlog = (blogData = {}) => {
  console.log(blogData);
  return {
    id: 3
  };
};

const updateBlog = (id, blogData) => {
  console.log("update...", id, blogData);
  return true;
};

const delBlog = id => {
    return true
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
};
