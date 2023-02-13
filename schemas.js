const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.ojbject().required({
        title: Joi.string().required(),
        price: Joi.number().require().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    })
});
