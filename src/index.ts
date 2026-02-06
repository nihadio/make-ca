#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import { init } from './commands/init'
import { generate } from './commands/generate'
import { validateEntityName } from './utils/validation'
import { name, version, description } from '../package.json'
import { logger } from './utils/logger'

const program = new Command()

program.name(name).description(description).version(version)

// Initialize project command
program
	.command('init')
	.description('Initialize a new clean architecture project')
	.option('-p, --path <path>', 'Path where the project should be initialized (defaults to current directory)')
	.action(options => {
		init(options.path)
	})

// Generate entity command
program
	.command('generate <entity>')
	.alias('g')
	.description('Generate entity layers (e.g., make-ca generate user)')
	.option('--skip-domain', 'Skip generating domain layer')
	.option('--skip-infrastructure', 'Skip generating infrastructure layer')
	.option('--skip-application', 'Skip generating application layer')
	.option('--only-domain', 'Generate only the domain layer')
	.option('--only-infrastructure', 'Generate only the infrastructure layer')
	.option('--only-application', 'Generate only the application layer')
	.action((entity, options) => {
		const entityName = entity.trim().toLowerCase()

		try {
			validateEntityName(entityName)
			generate(entityName, options)
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error: ${error.message}`)
				process.exit(1)
			}
		}
	})

// Handle unknown commands
program.on('command:*', () => {
	logger.error(`Invalid command: ${program.args.join(' ')}`)
	logger.log(`See ${chalk.blue('--help')} for a list of available commands.`)
	process.exit(1)
})

// If no arguments provided, show help
if (process.argv.length === 2) {
	program.help()
}

program.parse(process.argv)
