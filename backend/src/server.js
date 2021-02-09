import app from './app';
const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
  console.log(`Backend UPIS saúde rodando na porta ${PORT}`);
});
