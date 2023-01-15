import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: 'AKIA4QFUKIH3ET73GLG7',
    secretAccessKey: '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',
    region: 'ap-southeast-2'
});

const S3 = new AWS.S3();

export async function getFileFromS3() {
    return  new Promise((resolve, reject) => {
        try {
            const bucketName = 'scb-aws-bucket';
            const objectKey = 'person-data.json';
            S3.getObject({
                Bucket: bucketName,
                Key: objectKey
            }, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });        
        }
        catch (e) {
            reject(e);
        }
    })
} 

