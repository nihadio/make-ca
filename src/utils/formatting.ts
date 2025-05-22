import { camelCase as toCamelCase, pascalCase as toPascalCase, paramCase as toParamCase } from 'change-case'
import { EntityNameFormats } from '../types'

const pluralize = require('pluralize')

/**
 * Generates all necessary format variations of an entity name
 *
 * @param entityName Entity name in kebab-case (e.g., "user-profile")
 * @returns Object with all variations of the entity name
 */
export function formatEntityName(entityName: string): EntityNameFormats {
	const kebabCase = toParamCase(entityName)
	const camelCase = toCamelCase(kebabCase)
	const pascalCase = toPascalCase(kebabCase)
	const pluralKebabCase = pluralize(kebabCase)
	const pluralCamelCase = pluralize(camelCase)
	const pluralPascalCase = pluralize(pascalCase)

	return {
		kebabCase,
		camelCase,
		pascalCase,
		pluralKebabCase,
		pluralCamelCase,
		pluralPascalCase,
	}
}
