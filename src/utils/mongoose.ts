import { NextFunction } from 'express';
import { MongooseError } from 'mongoose';
import { message } from '../messages';
import { ApiError } from './api-error';

type MongooseErrorType = Record<string, number>;

var mongooseErrorType: MongooseErrorType = {
  CastError: 404,
  DocumentNotFoundError: 404,
  ValidationError: 400,
};

var catchError =
  (errorType: MongooseErrorType) =>
  (error: MongooseError, next: NextFunction, customMessage?: string) => {
    var code = errorType[error.name] || 500;
    var errorMessage =
      code >= 500 && !customMessage
        ? message.internalServerError()
        : customMessage || error.message;

    throw new ApiError(code, errorMessage);
  };

export var catchMongooseError = catchError(mongooseErrorType);
