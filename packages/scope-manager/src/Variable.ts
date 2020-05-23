import { TSESTree } from '@typescript-eslint/typescript-estree';
import { Definition } from './definition';
import { createIdGenerator } from './ID';
import { Reference } from './referencer/Reference';
import { Scope } from './scope';

const generator = createIdGenerator();

/**
 * A Variable represents a locally scoped identifier. These include arguments to functions.
 */
class Variable {
  /**
   * A unique ID for this instance - primarily used to help debugging and testing
   */
  public readonly $id: number = generator();

  /**
   * The array of the definitions of this variable.
   * @public
   */
  public readonly defs: Definition[] = [];
  /**
   * True if the variable is considered used for the purposes of `no-unused-vars`, false otherwise.
   * @public
   */
  public eslintUsed = false;
  /**
   * The array of `Identifier` nodes which define this variable.
   * If this variable is redeclared, this array includes two or more nodes.
   * @public
   */
  public readonly identifiers: TSESTree.Identifier[] = [];
  /**
   * The variable name, as given in the source code.
   * @public
   */
  public readonly name: string;
  /**
   * List of {@link Reference} of this variable (excluding parameter entries)  in its defining scope and all nested scopes.
   * For defining occurrences only see {@link Variable#defs}.
   * @public
   */
  public readonly references: Reference[] = [];
  /**
   * Reference to the enclosing Scope.
   */
  public readonly scope: Scope;

  constructor(name: string, scope: Scope) {
    this.name = name;
    this.scope = scope;
  }

  /**
   * `true` if the variable is valid in a type context, false otherwise
   */
  public isTypeVariable(): boolean {
    if (this.defs.length === 0) {
      // we don't statically know whether this is a type or a value
      return true;
    }

    return this.defs.some(def => def.isTypeDefinition);
  }

  /**
   * `true` if the variable is valid in a value context, false otherwise
   */
  public isValueVariable(): boolean {
    if (this.defs.length === 0) {
      // we don't statically know whether this is a type or a value
      return true;
    }

    return this.defs.some(def => def.isVariableDefinition);
  }
}

export { Variable };
