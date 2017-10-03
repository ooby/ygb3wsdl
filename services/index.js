module.exports = () => {
    return {
        service: {
            port: {
                changeSlotState: args => {
                    console.log('args > ', args);
                },
                checkPatient: args => {
                    console.log('args > ', args);
                },
                validatePatient: args => {
                    console.log('args > ', args);
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
