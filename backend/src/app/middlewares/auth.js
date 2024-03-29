import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não informado' });
  }

  const [, token] = authHeader.split(' ');

  try {
    // promisify funcao para tranformar funcoes callback em promises
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // incluido o userId na requisição sendo assim toda a requisição que que o usuario estiver autenticado vai conter o idntificador dele
    req.userId = decoded.id;
    req.userProvider = decoded.provider;
    req.roules = decoded.roules;
    req.type = decoded.type;

    return next();
  } catch (error) {
    res.status(403).json({ error: 'Sua autenticação expirou. Faça o login novamente' });
  }
};
