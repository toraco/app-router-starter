module.exports = {
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:sort/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'sort', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  root: true, // 上位ディレクトリにある他のeslintrcを参照しないようにする
  rules: {
    'react/react-in-jsx-scope': 0, // JSXファイルでReactの宣言を省略可能にする
    'react/prop-types': 0, // PropTypesを使わない
    'no-irregular-whitespace': 0,
    '@typescript-eslint/ban-ts-comment': 0, // ts-ignoreを許可する
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
      },
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
    react: {
      version: 'detect',
    },
  },
}
