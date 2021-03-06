const moment = require('moment');
const birthFormat = t => moment(t).format('YYYY-MM-DD');
module.exports = async c => {
    const rmisjs = require('rmisjs')(c);
    const composer = rmisjs.composer;
    await composer.mongoConnect();
    return {
        service: {
            port: {
                changeSlotState: (args, cb, headers, req) => {
                    let data = {
                        birthDate: birthFormat(args.slotInfo.patientInfo.birthDate),
                        searchDocument: {
                            docTypeId: 26,
                            docNumber: args.slotInfo.patientInfo.policyNumber
                        },
                        GUID: args.slotInfo.GUID
                    };
                    if (args.status && parseInt(args.status) === 3) {
                        composer.deleteVisit(data)
                            .then(r => {
                                if (r.length > 0) {
                                    cb({ 'lt:slipNumber': r });
                                } else {
                                    cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Ошибка отмены записи на прием' } });
                                }
                            })
                            .catch(e => {
                                console.log(e);
                                cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Попробуйте отменить запись позже' } });
                            });
                    } else if (parseInt(args.status) !== 3) {
                        composer.createVisit(data)
                            .then(r => {
                                if (r.length > 0) {
                                    cb({ 'lt:slipNumber': r });
                                } else {
                                    cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Ошибка записи на прием' } });
                                }
                            })
                            .catch(e => {
                                console.log(e);
                                cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Ошибка записи на прием' } });
                            });
                    } else {
                        cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Ошибка изменения состояния записи' } });
                    }
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
                            if (r && r.response && r.response.statusCode === 500) {
                                cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Нет прикрепления к учреждению' } });
                            } else if (r && !r.response) {
                                console.log(r);
                                cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 0 } });
                            } else {
                                cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Не найден в базе учреждения' } });
                            }
                        })
                        .catch(e => {
                            console.log(e);
                            cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Ошибка прикрепления к учреждению' } });
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
