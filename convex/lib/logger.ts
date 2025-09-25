/**
 * Centralized logging utility for Convex functions
 * Provides structured logging with different severity levels
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

interface LogContext {
  userId?: string;
  businessId?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): string {
    const timestamp = new Date().toISOString();
    const baseLog = `[${timestamp}] [${level}] ${message}`;
    
    // Safely stringify context to handle circular references
    let contextStr = '';
    if (context) {
      try {
        contextStr = ` | Context: ${JSON.stringify(context)}`;
      } catch (e) {
        // Fallback for circular references or other stringify errors
        contextStr = ` | Context: [Unserializable: ${Object.keys(context).join(', ')}]`;
      }
    }
    
    const errorStr = error ? ` | Error: ${error.message} | Stack: ${error.stack}` : '';
    
    return `${baseLog}${contextStr}${errorStr}`;
  }

  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): void {
    const formattedMessage = this.formatMessage(level, message, context, error);
    
    // In production, we might want to send logs to an external service
    // For now, we'll use console methods appropriately
    switch (level) {
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.log(formattedMessage);
        }
        break;
      case LogLevel.INFO:
        console.log(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedMessage);
        break;
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log(LogLevel.ERROR, message, context, errorObj);
  }

  fatal(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log(LogLevel.FATAL, message, context, errorObj);
  }

  // Specialized logging methods for common scenarios
  
  apiError(endpoint: string, error: Error | unknown, context?: LogContext): void {
    this.error(`API error at ${endpoint}`, error, {
      ...context,
      action: `api_${endpoint}`
    });
  }

  authError(action: string, error: Error | unknown, userId?: string): void {
    this.error(`Authentication error during ${action}`, error, {
      userId,
      action: `auth_${action}`
    });
  }

  businessOperation(
    operation: string,
    businessId: string,
    success: boolean,
    details?: Record<string, unknown>
  ): void {
    const level = success ? LogLevel.INFO : LogLevel.WARN;
    const message = `Business operation ${operation} ${success ? 'succeeded' : 'failed'}`;
    this.log(level, message, {
      businessId,
      action: `business_${operation}`,
      metadata: details
    });
  }

  emailOperation(
    operation: string,
    recipient: string,
    success: boolean,
    error?: Error
  ): void {
    if (success) {
      this.info(`Email ${operation} sent successfully`, {
        action: `email_${operation}`,
        metadata: { recipient }
      });
    } else {
      this.error(`Email ${operation} failed`, error, {
        action: `email_${operation}`,
        metadata: { recipient }
      });
    }
  }

  domainOperation(
    operation: string,
    domain: string,
    success: boolean,
    details?: Record<string, unknown>
  ): void {
    const level = success ? LogLevel.INFO : LogLevel.ERROR;
    const message = `Domain operation ${operation} for ${domain} ${success ? 'succeeded' : 'failed'}`;
    this.log(level, message, {
      action: `domain_${operation}`,
      metadata: { domain, ...details }
    });
  }
}

// Export a singleton instance
export const logger = new Logger();

// Export types for use in other files
export type { LogContext };