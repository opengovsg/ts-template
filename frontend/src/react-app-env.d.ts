import 'react-scripts'
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_ENV: 'development' | 'production' | 'staging'
  }
}
