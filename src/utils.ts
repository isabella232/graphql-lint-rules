import {
  ASTNode,
  DirectiveNode,
  GraphQLCompositeType,
  GraphQLType,
  NamedTypeNode,
  NonNullTypeNode,
  TypeNode,
} from 'graphql';

export {
  ValidationError,
} from 'graphql-schema-linter/lib/validation_error';

const assertNever = (_x: never, message = 'Unrecognized type'): never => {
  throw new Error(message);
};

const isAllowedByDirective = (
  node: {
    directives?: readonly DirectiveNode[],
  },
  directiveName: string,
): boolean => {
  return !!node.directives && node.directives.some((directive) => {
    return directive.name.value === directiveName;
  });
};

const isNonNullTypeNode = (typeNode: TypeNode): typeNode is NonNullTypeNode => {
  return typeNode.kind === 'NonNullType';
};

const isTypeNode = (node: ASTNode): node is TypeNode => {
  return node.hasOwnProperty('type');
};

const isNamedTypeNode = (node: ASTNode): node is NamedTypeNode => {
  return isTypeNode(node) && node.kind === 'NamedType';
};

const isGraphQLCompositeType = (type?: GraphQLType): type is GraphQLCompositeType => {
  const objectType = (type as GraphQLCompositeType);
  return !!type && !!objectType.astNode && [
    'ObjectTypeDefinition',
    'InterfaceTypeDefinition',
    'UnionTypeDefinition',
  ].includes(objectType.astNode.kind);
};

const unwrapType = (typeNode: TypeNode): NamedTypeNode => {
  switch (typeNode.kind) {
    case 'NamedType':
      return typeNode;
    case 'NonNullType':
    case 'ListType':
      return unwrapType(typeNode.type);
    default:
      return assertNever(typeNode);
  }
};

const unwrapAstNode = (node: ASTNode | readonly ASTNode[]): ASTNode | undefined => {
  return Array.isArray(node) ? node[0] : node;
};

const getNodeName = (node: ASTNode): string | undefined => {
  return isNamedTypeNode(node) ? node.name.value : undefined;
};

export {
  assertNever,
  getNodeName,
  isNonNullTypeNode,
  isTypeNode,
  isNamedTypeNode,
  isGraphQLCompositeType,
  isAllowedByDirective,
  unwrapType,
  unwrapAstNode,
};
