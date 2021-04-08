import roulesEnum from '../enums/roulesEnum';

export default async (req, res, next) => {
  const { roules } = req;

  try {
    if (roules !== roulesEnum.ADMIN) {
      return res
        .status(401)
        .json({ error: 'Usuário não tem permissão acessar esta rota' });
    }

    return next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
