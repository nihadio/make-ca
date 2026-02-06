import path from 'path'
import { formatEntityName } from '../utils/formatting'
import { isProjectInitialized, createEntityDirectories, renderTemplate } from '../utils/filesystem'
import { GenerateOptions } from 'src/types'
import { logger } from '../utils/logger'

const ora = require('ora')
const chalk = require('chalk')

/**
 * Handler for the 'generate' command
 * Generates entity layers based on clean architecture principles
 *
 * @param entityName Entity name in kebab-case
 * @param options Command options
 */
export async function generate(entityName: string, options: GenerateOptions): Promise<void> {
	const spinner = ora('Starting entity generation...').start()

	try {
		// Use current directory as project path
		const projectPath = process.cwd()

		// Check if project is initialized
		if (!isProjectInitialized(projectPath)) {
			spinner.fail(chalk.red(`Project is not initialized in ${projectPath}!`))
			logger.command('Run', 'make-ca init')
			process.exit(1)
		}

		spinner.succeed(chalk.green(`Generating entity: ${entityName} in ${projectPath}`))

		// Format entity name to various formats
		const entity = formatEntityName(entityName)

		// Create directories for the entity
		const dirs = createEntityDirectories(entityName, projectPath)

		// Determine which layers to generate
		const generateDomain =
			options.onlyDomain || (!options.skipDomain && !options.onlyInfrastructure && !options.onlyApplication)
		const generateInfrastructure =
			options.onlyInfrastructure || (!options.skipInfrastructure && !options.onlyDomain && !options.onlyApplication)
		const generateApplication =
			options.onlyApplication || (!options.skipApplication && !options.onlyDomain && !options.onlyInfrastructure)

		// Generate templates based on options
		const templatesDir = path.join(__dirname, '../../templates')

		// Core domain layer
		if (generateDomain) {
			const domainSpinner = ora('Generating domain layer...').start()
			try {
				// DI
				await renderTemplate(
					path.join(templatesDir, 'domain/di/index.ts.ejs'),
					path.join(dirs.domainDir, 'di', 'index.ts'),
					{ entity }
				)

				// Entity
				await renderTemplate(
					path.join(templatesDir, 'domain/entity/Entity.ts.ejs'),
					path.join(dirs.domainDir, 'entity', `${entity.pascalCase}.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'domain/entity/index.ts.ejs'),
					path.join(dirs.domainDir, 'entity', 'index.ts'),
					{ entity }
				)

				// Exceptions
				await renderTemplate(
					path.join(templatesDir, 'domain/exception/NotFoundException.ts.ejs'),
					path.join(dirs.domainDir, 'exception', `${entity.pascalCase}NotFoundException.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'domain/exception/AlreadyExistsException.ts.ejs'),
					path.join(dirs.domainDir, 'exception', `${entity.pascalCase}AlreadyExistsException.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'domain/exception/index.ts.ejs'),
					path.join(dirs.domainDir, 'exception', 'index.ts'),
					{ entity }
				)

				// Repository
				await renderTemplate(
					path.join(templatesDir, 'domain/repository/Repository.ts.ejs'),
					path.join(dirs.domainDir, 'repository', `${entity.pascalCase}Repository.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'domain/repository/RepositoryPort.ts.ejs'),
					path.join(dirs.domainDir, 'repository', `${entity.pascalCase}RepositoryPort.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'domain/repository/RepositoryResult.ts.ejs'),
					path.join(dirs.domainDir, 'repository', `${entity.pascalCase}RepositoryResult.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'domain/repository/index.ts.ejs'),
					path.join(dirs.domainDir, 'repository', 'index.ts'),
					{ entity }
				)

				// Use cases
				await renderTemplate(
					path.join(templatesDir, 'domain/use-case/UseCasePort.ts.ejs'),
					path.join(dirs.domainDir, 'use-case', `${entity.pascalCase}UseCasePort.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'domain/use-case/UseCaseResult.ts.ejs'),
					path.join(dirs.domainDir, 'use-case', `${entity.pascalCase}UseCaseResult.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'domain/use-case/GetUseCase.ts.ejs'),
					path.join(dirs.domainDir, 'use-case', `Get${entity.pascalCase}UseCase.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'domain/use-case/GetManyUseCase.ts.ejs'),
					path.join(dirs.domainDir, 'use-case', `Get${entity.pluralPascalCase}UseCase.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'domain/use-case/CreateUseCase.ts.ejs'),
					path.join(dirs.domainDir, 'use-case', `Create${entity.pascalCase}UseCase.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'domain/use-case/UpdateUseCase.ts.ejs'),
					path.join(dirs.domainDir, 'use-case', `Update${entity.pascalCase}UseCase.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'domain/use-case/DeleteUseCase.ts.ejs'),
					path.join(dirs.domainDir, 'use-case', `Delete${entity.pascalCase}UseCase.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'domain/use-case/index.ts.ejs'),
					path.join(dirs.domainDir, 'use-case', 'index.ts'),
					{ entity }
				)

				domainSpinner.succeed(chalk.green('Domain layer generated successfully'))
			} catch (error) {
				domainSpinner.fail(chalk.red('Failed to generate domain layer'))
				throw error
			}
		}

		// Service layer
		if (generateDomain) {
			// Assuming service layer is part of domain generation
			const serviceSpinner = ora('Generating service layer...').start()
			try {
				await renderTemplate(
					path.join(templatesDir, 'service/GetService.ts.ejs'),
					path.join(dirs.serviceDir, `Get${entity.pascalCase}Service.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'service/GetManyService.ts.ejs'),
					path.join(dirs.serviceDir, `Get${entity.pluralPascalCase}Service.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'service/CreateService.ts.ejs'),
					path.join(dirs.serviceDir, `Create${entity.pascalCase}Service.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'service/UpdateService.ts.ejs'),
					path.join(dirs.serviceDir, `Update${entity.pascalCase}Service.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'service/DeleteService.ts.ejs'),
					path.join(dirs.serviceDir, `Delete${entity.pascalCase}Service.ts`),
					{ entity }
				)

				await renderTemplate(path.join(templatesDir, 'service/index.ts.ejs'), path.join(dirs.serviceDir, 'index.ts'), {
					entity,
				})

				serviceSpinner.succeed(chalk.green('Service layer generated successfully'))
			} catch (error) {
				serviceSpinner.fail(chalk.red('Failed to generate service layer'))
				throw error
			}
		}

		// Infrastructure layer
		if (generateInfrastructure) {
			const infraSpinner = ora('Generating infrastructure layer...').start()
			try {
				await renderTemplate(
					path.join(templatesDir, 'infrastructure/persistence/typeorm/feature/TypeOrmEntity.ts.ejs'),
					path.join(dirs.infraDir, `TypeOrm${entity.pascalCase}.entity.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'infrastructure/persistence/typeorm/feature/TypeOrmMapper.ts.ejs'),
					path.join(dirs.infraDir, `TypeOrm${entity.pascalCase}Mapper.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'infrastructure/persistence/typeorm/feature/TypeOrmRepository.ts.ejs'),
					path.join(dirs.infraDir, `TypeOrm${entity.pascalCase}Repository.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'infrastructure/persistence/typeorm/feature/index.ts.ejs'),
					path.join(dirs.infraDir, 'index.ts'),
					{ entity }
				)

				infraSpinner.succeed(chalk.green('Infrastructure layer generated successfully'))
			} catch (error) {
				infraSpinner.fail(chalk.red('Failed to generate infrastructure layer'))
				throw error
			}
		}

		// Application layer
		if (generateApplication) {
			const appSpinner = ora('Generating application layer...').start()
			try {
				await renderTemplate(
					path.join(templatesDir, 'application/controller/Controller.ts.ejs'),
					path.join(dirs.appDir, 'controller', `${entity.pascalCase}Controller.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'application/documentation/body/RestApiCreateBody.ts.ejs'),
					path.join(dirs.appDir, 'documentation', 'body', `RestApiCreate${entity.pascalCase}Body.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'application/documentation/body/RestApiUpdateBody.ts.ejs'),
					path.join(dirs.appDir, 'documentation', 'body', `RestApiUpdate${entity.pascalCase}Body.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'application/documentation/body/index.ts.ejs'),
					path.join(dirs.appDir, 'documentation', 'body', 'index.ts'),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'application/documentation/query/RestApiGetQuery.ts.ejs'),
					path.join(dirs.appDir, 'documentation', 'query', `RestApiGet${entity.pluralPascalCase}Query.ts`),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'application/documentation/query/index.ts.ejs'),
					path.join(dirs.appDir, 'documentation', 'query', 'index.ts'),
					{ entity }
				)

				await renderTemplate(
					path.join(templatesDir, 'application/documentation/index.ts.ejs'),
					path.join(dirs.appDir, 'documentation', 'index.ts'),
					{ entity }
				)

				// Entity module for DI
				await renderTemplate(
					path.join(templatesDir, 'application/di/feature/EntityModule.ts.ejs'),
					path.join(dirs.diFeatureDir, `${entity.pascalCase}Module.ts`),
					{ entity }
				)

				appSpinner.succeed(chalk.green('Application layer generated successfully'))
			} catch (error) {
				appSpinner.fail(chalk.red('Failed to generate application layer'))
				throw error
			}
		}

		logger.success(`Entity '${entityName}' generated successfully!`)
	} catch (error) {
		if (error instanceof Error) {
			logger.error(`Error generating entity: ${error.message}`)
		} else {
			logger.error('An unknown error occurred during generation')
		}
		process.exit(1)
	}
}
