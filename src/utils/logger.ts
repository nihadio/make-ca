import chalk from 'chalk'

/**
 * Logger utility for consistent console output
 */
export const logger = {
	/**
	 * Log regular information message
	 */
	log: (message: string): void => {
		console.log(message)
	},

	/**
	 * Log error message with red color
	 */
	error: (message: string): void => {
		console.error(chalk.red(message))
	},

	/**
	 * Log success message with green checkmark
	 */
	success: (message: string): void => {
		console.log('\n' + chalk.green('✓') + ' ' + message)
	},

	/**
	 * Log info message with blue color
	 */
	info: (message: string): void => {
		console.log(chalk.blue(message))
	},

	/**
	 * Log command usage hint
	 */
	command: (message: string, command: string): void => {
		console.log(message + ' ' + chalk.blue(command))
	},
}
