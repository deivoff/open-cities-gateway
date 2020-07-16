import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

function validate(value: any) {
  if (typeof value !== 'string') {
    throw new TypeError(`Value is not string: ${value}`)
  }

  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(value)) {
    throw new TypeError(`Value is not a valid HexColorCode: ${value}`)
  }

  return value;
}

export const HexColorScalar = new GraphQLScalarType({
  name: 'HEXColor',
  description: `A field whose value is a hex color code: https://en.wikipedia.org/wiki/Web_colors.`,
  serialize(value) {
    return validate(value)
  },

  parseValue(value) {
    return validate(value)
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as hex color codes but got a: ${ast.kind}`,
      )
    }

    return validate(ast.value)
  },
});
