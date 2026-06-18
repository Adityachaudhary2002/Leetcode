const{ createClient } =require( 'redis');

const redisClient = createClient({
    username: 'default',
    password: 'Vuum1GVP8qEJXJwz2moaz9ii96KZIADi',
    socket: {
        host: 'redis-12306.crce300.ap-south-1-2.ec2.cloud.redislabs.com',
        port: 12306
    }
});
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err.message);
});

module.exports=redisClient;





