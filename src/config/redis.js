const{ createClient } =require( 'redis');

const redisclient = createClient({
    username: 'default',
    password: 'vH6G23t8cjpTjg2EvTU2eWOAL1XsO3hO',
    socket: {
        host: 'redis-15297.crce276.ap-south-1-3.ec2.cloud.redislabs.com',
        port: 15297
    }
});
module.exports=redisclient;