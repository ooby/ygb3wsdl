const moment = require('moment');
const rmisjs = require('rmisjs');
const birthFormat = t => moment(t).format('YYYY-MM-DD');
module.exports = async s => {
    const { composer } = rmisjs(s);
    await composer.mongoConnect();
    return {
        service: {
            port: {
                changeSlotState: async (args, cb, headers, req) => {
                    let data = {
                        birthDate: birthFormat(args.slotInfo.patientInfo.birthDate),
                        searchDocument: {
                            docTypeId: 26,
                            docNumber: args.slotInfo.patientInfo.policyNumber
                        },
                        GUID: args.slotInfo.GUID
                    };
                    if (args.status && parseInt(args.status) === 3) {
                        try {
                            let r = await composer.deleteVisit(data);
                            if (r.length > 0) {
                                cb({ 'lt:slipNumber': r });
                            } else {
                                cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Ошибка отмены записи на прием' } });
                            }
                        } catch (e) {
                            console.log(e);
                            cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Попробуйте отменить запись позже' } });
                        }
                    } else if (parseInt(args.status) !== 3) {
                        try {
                            let r = await composer.createVisit(data);
                            if (r.length > 0) {
                                cb({ 'lt:slipNumber': r });
                            } else {
                                cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Ошибка записи на прием' } });
                            }
                        } catch (e) {
                            console.log(e);
                            cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Ошибка записи на прием' } });
                        }
                    } else {
                        cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Ошибка изменения состояния записи' } });
                    }
                },
                checkPatient: args => {
                    console.log('args > ', args);
                },
                validatePatient: async (args, cb, headers, req) => {
                    let data = {
                        birthDate: birthFormat(args.patientInfo.birthDate),
                        searchDocument: {
                            docTypeId: 26,
                            docNumber: args.patientInfo.policyNumber
                        }
                    };
                    try {
                        let r = await composer.validatePatient(data);
                        if (r && r.response && r.response.statusCode === 500) {
                            cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Нет прикрепления к учреждению' } });
                        } else if (r && !r.response) {
                            console.log(r);
                            cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 0 } });
                        } else {
                            cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Не найден в базе учреждения' } });
                        }
                    } catch (e) {
                        console.log(e);
                        cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 1, 'ct:ErrorText': 'Ошибка прикрепления к учреждению' } });
                    }
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
