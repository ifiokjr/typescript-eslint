import { TSESTree } from '@typescript-eslint/typescript-estree';
import { createIdGenerator } from '../ID';
import { Scope } from '../scope';
import { Variable } from '../Variable';

enum ReferenceFlag {
  READ = 0x1,
  WRITE = 0x2,
  RW = 0x3,
}

interface ReferenceImplicitGlobal {
  node: TSESTree.Node;
  pattern: TSESTree.BindingName;
  ref?: Reference;
}

const generator = createIdGenerator();

/**
 * A Reference represents a single occurrence of an identifier in code.
 */
class Reference {
  /**
   * A unique ID for this instance - primarily used to help debugging and testing
   */
  public readonly $id: number = generator();
  /**
   * The read-write mode of the reference.
   */
  readonly #flag: ReferenceFlag;
  /**
   * Reference to the enclosing Scope.
   * @public
   */
  public readonly from: Scope;
  /**
   * Identifier syntax node.
   * @public
   */
  public readonly identifier: TSESTree.Identifier;
  /**
   * `true` if this writing reference is a variable initializer or a default value.
   * @public
   */
  public readonly init?: boolean;
  /**
   * The {@link Variable} object that this reference refers to. If such variable was not defined, this is `null`.
   * @public
   */
  public resolved: Variable | null;
  /**
   * If reference is writeable, this is the node being written to it.
   * @public
   */
  public readonly writeExpr?: TSESTree.Node | null;

  public readonly maybeImplicitGlobal?: ReferenceImplicitGlobal | null;

  /**
   * True if this reference was created from a type context, false otherwise
   */
  public readonly isTypeReference: boolean;

  constructor(
    identifier: TSESTree.Identifier,
    scope: Scope,
    flag: ReferenceFlag,
    writeExpr?: TSESTree.Node | null,
    maybeImplicitGlobal?: ReferenceImplicitGlobal | null,
    init?: boolean,
    isTypeReference = false,
  ) {
    this.identifier = identifier;
    this.from = scope;
    this.resolved = null;
    this.#flag = flag;

    if (this.isWrite()) {
      this.writeExpr = writeExpr;
      this.init = init;
    }

    this.maybeImplicitGlobal = maybeImplicitGlobal;
    this.isTypeReference = isTypeReference;
  }

  /**
   * Whether the reference is writeable.
   * @public
   */
  public isWrite(): boolean {
    return !!(this.#flag & ReferenceFlag.WRITE);
  }

  /**
   * Whether the reference is readable.
   * @public
   */
  public isRead(): boolean {
    return !!(this.#flag & ReferenceFlag.READ);
  }

  /**
   * Whether the reference is read-only.
   * @public
   */
  public isReadOnly(): boolean {
    return this.#flag === ReferenceFlag.READ;
  }

  /**
   * Whether the reference is write-only.
   * @public
   */
  public isWriteOnly(): boolean {
    return this.#flag === ReferenceFlag.WRITE;
  }

  /**
   * Whether the reference is read-write.
   * @public
   */
  public isReadWrite(): boolean {
    return this.#flag === ReferenceFlag.RW;
  }
}

export { Reference, ReferenceFlag, ReferenceImplicitGlobal };
