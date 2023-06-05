
exports.joiValidate = (schema, reqobj) => {
    // schema = rm.joi.object().keys({
    //     prefferedCurrency: rm.joi.string().allow('').optional().default(""),
    //     fareQuoteSource: rm.joi.string().required(), remarks: rm.joi.string().optional().default(""),
    //     rooms: rm.joi.array().items(
    //         rm.joi.object({
    //             adult: rm.joi.array().required().items(
    //                 rm.joi.object({
    //                     title: rm.joi.string().required()
    //                 })
    //             ),
    //             child: rm.joi
    //                 .array()
    //                 .optional()
    //                 .items(
    //                     rm.joi.object({
    //                         title: rm.joi.string().required(),
    //                         first: rm.joi.string().required(),
    //                         last: rm.joi.string().required(),
    //                         age: rm.joi.number().required()
    //                     })
    //                 )
    //         })
    //     ).min(1)
    // })
    // if (!isvalid.success) {

        const { error, value } = schema.validate(reqobj);
        const valid = error == null;
        var result = {};
        if (valid) {
            result.value = value;
            result.success = true;
            // return result
        }
        else {
            const { details } = error;
            const message = details.map(i => i.message).join(',')
            console.log("error", message);
            result.success = false
            result.message = message.replace('"', ' ').replace('/', '');
            // return result
        }
        return result

    // }
}