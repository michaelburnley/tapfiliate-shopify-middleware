module.exports = (error) => {
    console.log(error.message)
    Promise.reject(error);
};