const axios= require('axios');  

const refreshToken = (refreshToken)=>{
    return axios.create({
        headers:{
            x_authorization:refreshToken,
        }
    }).post('localhost:5000/api/refreshToken');

}
module.exports = {refreshToken};