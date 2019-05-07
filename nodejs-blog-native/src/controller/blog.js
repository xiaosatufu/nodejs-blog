const { exec } = require("../db/mysql");
const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}'`;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }
  sql += `order by createtime desc;`;
  //返回promise
  return exec(sql);
};

const getDetail = id => {
  const sql = `select * from blogs where id='${id}'`;
  return exec(sql).then(rows => {
    console.log(rows[0]);
    return rows[0];
  });
};

const newBlog = (blogData = {}) => {
  const title = blogData.title;
  const content = blogData.content;
  const author = blogData.author;
  const createtime = Date.now();
  const sql = `insert into blogs (title,content,createtime,author) values ('${title}','${content}','${createtime}','${author}');`;
  return exec(sql).then(insertData => {
    console.log(insertData);
    return {
      id: insertData.insertId
    };
  });
};

const updateBlog = (id, blogData) => {
  // console.log("update...", id, blogData);
  const title = blogData.title;
  const content = blogData.content;

  const sql = `update blogs set title='${title}',content='${content}' where id=${id};`;
  return exec(sql).then(updateData => {
    // console.log(updateData);
    if (updateData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
  // return true;
};

const delBlog = (id,author) => {
  // return true;
  const sql = `delete from blogs where id=${id} and author='${author}';`;
  console.log(sql)
  return exec(sql).then(delData => {
    // console.log(updateData);
    if (delData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
};
