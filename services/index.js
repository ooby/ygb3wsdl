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
                validatePatient: async args => {
                    try {
                        let data = {
                            birthDate: birthFormat(args.patientInfo.birthDate),
                            searchDocument: {
                                docTypeId: 26,
                                docNumber: args.patientInfo.policyNumber
                            }
                        };
                        let r = await composer.validatePatient(data);
                        return (r) ? { ErrorCode: 0 } : { ErrorCode: 1 };
                    } catch (e) { return { ErrorCode: 1 }; }
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
