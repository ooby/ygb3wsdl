const moment = require('moment')
const rmisjs = require('rmisjs')
const birthFormat = t => moment(t).format('YYYY-MM-DD')

const log = args => console.log('args > ', args)
const respond = r => ({ 'lt:slipNumber': r })
const error = r => ({
  'ct:portalServiceResponse': {
    'ct:ErrorCode': 1,
    'ct:ErrorText': r
  }
})

module.exports = async c => {
  const { composer } = rmisjs(c)
  await composer.mongoConnect()
  return {
    service: {
      port: {
        changeSlotState: async (args, cb) => {
          let data = {
            birthDate: birthFormat(args.slotInfo.patientInfo.birthDate),
            searchDocument: {
              docTypeId: 26,
              docNumber: args.slotInfo.patientInfo.policyNumber
            },
            GUID: args.slotInfo.GUID
          }
          let status = parseInt(args.status)
          if (Number.isNaN(status))
            return cb(error('Ошибка изменения состояния записи'))
          else if (status === 3) {
            let r = await composer.deleteVisit(data).catch(console.error)
            if (!r) return cb(error('Попробуйте отменить запись позже'))
            if (!r.length) return cb(error('Ошибка отмены записи на прием'))
            return cb(respond(r))
          } else {
            let r = await composer.createVisit(data).catch(console.error)
            if (!r) return cb(error('Ошибка записи на прием'))
            if (!r.length) return cb(error('Ошибка записи на прием'))
            return cb(respond(r))
          }
        },
        validatePatient: async (args, cb) => {
          try {
            let r = await composer.validatePatient({
              birthDate: birthFormat(args.patientInfo.birthDate),
              searchDocument: {
                docTypeId: 26,
                docNumber: args.patientInfo.policyNumber
              }
            })
            if (r && r.patientUid)
              return cb({ 'ct:portalServiceResponse': { 'ct:ErrorCode': 0 } })
            return cb(error('Не найден в базе учреждения'))
          } catch (e) {
            console.error(e)
            cb(error('Ошибка прикрепления к учреждению'))
          }
        },
        checkPatient: log,
        putParameters: log,
        getAttachedMO: log
      }
    }
  }
}
