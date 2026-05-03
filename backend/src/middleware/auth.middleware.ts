import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para autenticación básica del Dashboard
 */
export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
    // No aplicar a rutas de API o WebSockets
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
        return next();
    }

    const auth = { 
        login: process.env.DASHBOARD_USER || 'admin', 
        password: process.env.DASHBOARD_PASS || 'admin123' 
    };
    
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login && password && login === auth.login && password === auth.password) {
        return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="BotMaRe Dashboard"');
    res.status(401).send('Authentication required.');
};
