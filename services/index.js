const moment = require('moment');
const birthFormat = t => moment(t).format('YYYY-MM-DD');
module.exports = c => {
    const rmisjs = require('rmisjs')(c);
    const composer = rmisjs.composer;
    return {
        service: {
            port: {
                changeSlotState: args => {
                    console.log('args > ', args);
                },
                checkPatient: args => {
                    console.log('args > ', args);
                },
                validatePatient: (args, cb, headers, req) => {
                    let data = {
                        birthDate: birthFormat(args.patientInfo.birthDate),
                        searchDocument: {
                            docTypeId: 26,
                            docNumber: args.patientInfo.policyNumber
                        }
                    };
                    composer.validatePatient(data)
                        .then(r => {
                            console.log(r);
                            cb({ 'ct:muCode': args.muCode, 'ct:portalServiceResponse': { 'ct:ErrorCode': 0 } });
                        })
                        .catch(e => {
                            console.log(e);
                            cb({ 'ct:muCode': args.muCode, 'ct:portalServiceResponse': { 'ct:ErrorCode': 1 } });
                        });
                },
                putParameters: args => {
                    console.log('args > ', args);
                },
                getAttachedMO: args => {
                    console.log('args > ', args);
                }
            }
        }
    };
};
