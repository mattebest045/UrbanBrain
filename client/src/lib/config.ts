
interface Config {
  URL_CLIENT: string;
  URL_SERVER: string;
}

const config: Config = {
  URL_CLIENT: String(process.env.REACT_APP_URL_CLIENT),
  URL_SERVER: String(process.env.REACT_APP_URL_SERVER),
};

export default config;