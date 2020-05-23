import {
  TSESTreeOptions,
  EcmaVersion,
} from '@typescript-eslint/typescript-estree';

interface ParserOptions {
  comment?: boolean;
  ecmaFeatures?: {
    globalReturn?: boolean;
    jsx?: boolean;
  };
  ecmaVersion?: EcmaVersion;
  // ts-estree specific
  debugLevel?: TSESTreeOptions['debugLevel'];
  errorOnTypeScriptSyntacticAndSemanticIssues?: boolean;
  errorOnUnknownASTType?: boolean;
  extraFileExtensions?: string[];
  filePath?: string;
  loc?: boolean;
  project?: string | string[];
  projectFolderIgnoreList?: (string | RegExp)[];
  range?: boolean;
  sourceType?: 'script' | 'module';
  tokens?: boolean;
  tsconfigRootDir?: string;
  useJSXTextNode?: boolean;
  warnOnUnsupportedTypeScriptVersion?: boolean;
}

export { EcmaVersion, ParserOptions };
