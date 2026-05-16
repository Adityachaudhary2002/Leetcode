const{ createClient } =require( 'redis');

const redisClient = createClient({
    username: 'default',
    password: 'SyX7LhkMVSVkKy5vZBszhUgI0ydLYoda',
    socket: {
        host: 'redis-14347.crce283.ap-south-1-2.ec2.cloud.redislabs.com',
        port: 14347
    }
});
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err.message);
});

module.exports=redisClient;