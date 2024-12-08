// jwt.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { logger } from 'src/core/utils/logger';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    async use(req: any, res: Response, next: NextFunction) {
        const authTokenHeader = req.headers['authorization'].split(' ')[1];
        const excludedRoutes = ['/api/admin/v1/auth/signin', '/api/admin/v1/auth/verify-otp', '/api/admin/v1/auth/forgot-password'];
        if (excludedRoutes.includes(req.baseUrl)) {
            // Skip JWT authentication for the excluded routes
            return next();
        }
        if (authTokenHeader) {
            try {
                const decodedToken = jwt.verify(authTokenHeader, process.env.JWTKEY); // Replace 'your-secret-key' with your actual secret key
                req.user = decodedToken; // Set the decoded token in the request object for further use in the route handler
            } catch (error) {
                // Handle token verification errors
                logger.error('Token_Expiry_Error: ' + JSON.stringify(error?.message || error?.stack || error?.name || error));
                if (error.name === 'TokenExpiredError') {
                    logger.error('Token_Expiry_exit: ' + JSON.stringify('Token has expired.'));
                    return res.status(403).json({ code: 401, message: 'Token has expired.' });
                } else {
                    logger.error('Token_Invalid_exit: ' + JSON.stringify('Token has expired.'));
                    return res.status(401).json({ code: 401, message: 'Invalid token' });
                }
            }
        } else {
            logger.error('Token_Unauthorized_exit: ' + JSON.stringify('Unauthorized'));
            return res.status(401).json({ code: 401, message: 'Unauthorized' });
        }
        next();
    }
}
