import Joi from "joi";

export const VideoParamsSchema = Joi.object().keys({
    link: Joi.string(),
    start: Joi.number().integer().min(0).max(3 * 60 * 60),
    duration: Joi.number().integer().min(1).max(3 * 60 * 60),
    quality: Joi.string().valid('low', 'high'),
    text: Joi.string(),
    extension: Joi.string().valid('mp4', 'wav', 'webm'),
    color: Joi.string().valid('green', 'orange', 'blue')
});