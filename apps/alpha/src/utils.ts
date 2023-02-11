export const verifyEnv = () => {
  if (!process.env.PORT) {
    throw new Error('PORT is unset');
  }
};
