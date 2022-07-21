const Sequelize = require('sequelize');
var sequelize = new Sequelize('db9eo0crgu35lk', 'dyxqzpkyfmaouu', 'bbf33bce0b6f2d30a63c422cac5591fb8b2ccb030648be13fbc807ccaec3dbe7', {
    host: 'ec2-34-235-198-25.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Post = sequelize.define('post', {
    
    body:Sequelize.TEXT,
    title:Sequelize.STRING,
    postDate:Sequelize.DATE,
    featureImage:Sequelize.STRING,
    published:Sequelize.BOOLEAN,
});

var Category = sequelize.define('category', {
    categoryd:Sequelize.STRING
})

Post.belongsTo(Category, {foreignKey: 'categoryd'});

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(resolve('success'))
        .catch(reject('unable to sync the database'));
    });
}

module.exports.getAllPosts = function(){
    return new Promise((resolve,reject)=>{
        sequelize.sync()
        .then(resolve(Post.findAll()))
        .catch(reject('no results returned'));   
     });
}

module.exports.getPostsByCategory = function(category){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where: {
                category:category
            }
        })
        .then(resolve(Post.findAll({ where: { category:category }})))
        .catch(reject('no results returned')); 
    });
}

module.exports.getPostsByMinDate = function(minDateStr) {
    return new Promise((resolve, reject) => {
        const { gte } = Sequelize.Op;

Post.findAll({
    where: {
        postDate: {
            [gte]: new Date(minDateStr)
        }
    }
})

    });
}

module.exports.getPostById = function(id){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where: {
                id:id
            }
        })
        .then(resolve(Post.findAll({ where: { id:id }})))
        .catch(reject('no results returned')); 
    });
}

module.exports.addPost = function(postData){
    return new Promise((resolve,reject)=>{
        postData.published = (postData.published) ? true : false;
        for (var i in postData) {
            if (postData[i] == "") { postData[i] = null; }
        }

        Post.create(postData)
        .then(resolve(Post.findAll()))
        .catch(reject('unable to create post'))
    });
}

module.exports.getPublishedPosts = function(){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where: {
                published : true
            }
        })
        .then(resolve(Post.findAll({ where: { published : true }})))
        .catch(reject('no results returned')); 
    });
}

module.exports.getPublishedPostsByCategory = function(category){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where: {
                published : true,
                category : category
            }
        })
        .then(resolve(Post.findAll({ where: { published : true, category : category }})))
        .catch(reject('no results returned')); 
    });
}

module.exports.getCategories = function(){
    return new Promise((resolve,reject)=>{
        sequelize.sync()
        .then(resolve(Category.findAll()))
        .catch(reject('no results returned'));
    });
}

module.exports.addCategory = function(categoryData){
    return new Promise((resolve,reject)=>{
        for (var i in categoryData) {
            if (categoryData[i] == "") { categoryData[i] = null; }
        }

        Category.create(categoryData)
        .then(resolve(Category.findAll()))
        .catch(reject('unable to create post'))
    });
}

module.exports.deleteCategoryById = function(id){
    return new Promise((resolve,reject)=>{
        Category.destroy({
            where: {
                id : id
            }
        })
        .then(resolve())
        .catch(reject('unable to delete')); 
    });
}

module.exports.deletePostById = function(id){
    return new Promise((resolve,reject)=>{
        Post.destroy({
            where: {
                id : id
            }
        })
        .then(resolve())
        .catch(reject('unable to delete')); 
    });
}