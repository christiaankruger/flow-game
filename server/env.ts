interface Env {
  port: string;
}

export const getEnv = (): Env => {
  return {
    port: process.env.PORT!
  };
};
