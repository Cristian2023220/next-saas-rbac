import type { FastifyInstance, FastifyRequest, FastifyReply, FastifyError } from 'fastify'
import { ZodError } from 'zod'
import { BadRequestError } from './routes/_errors/bad-request-error';
import { UnauthorizedError } from './routes/_errors/unauthorized-error';

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    if(error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Invalid request data',
            errors: error.flatten().fieldErrors,
        });
    }

    if (error instanceof BadRequestError) {
        return reply.status(400).send({
            message: error.message,
        });
    }

    if (error instanceof UnauthorizedError) {
        return reply.status(401).send({
            message: error.message,
        });
    }

    console.error(error);

    //send error to some observability plataform

    return reply.status(500).send({
        message: 'Internal server error',
    });
}
